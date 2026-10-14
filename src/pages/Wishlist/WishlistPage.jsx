
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, ShoppingBag, Trash2, RefreshCw } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import { wishlistService } from "@/api";
import { normalizeProducts } from "@/adapters/product.adapter";
import { useAuth } from "@/contexts/AuthContext";
import { COLORS } from "@/config/theme";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getWishlist(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  const responseData = wishlistQuery.data?.data?.data;

  // Support common wishlist response shapes.
  const rawItems = Array.isArray(responseData)
    ? responseData
    : responseData?.items ??
      responseData?.wishlist?.items ??
      responseData?.wishlist ??
      responseData?.products ??
      [];

  const products = normalizeProducts(
    rawItems
      .map((item) => item?.product ?? item?.productId ?? item)
      .filter((item) => item && typeof item === "object")
  );

  const removeMutation = useMutation({
    mutationFn: (productId) =>
      wishlistService.removeFromWishlist(productId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  if (authLoading) {
    return <WishlistLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: "/wishlist" }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        eyebrow="Kreedum Sports"
        title="My Wishlist"
        description="Your saved sports and fitness essentials, all in one place."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Wishlist" },
        ]}
        rightContent={
          <>
            <span className="font-semibold text-white">
              {products.length}
            </span>{" "}
            saved {products.length === 1 ? "product" : "products"}
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-7 md:px-6 md:py-10">
        {wishlistQuery.isLoading ? (
          <WishlistLoading />
        ) : wishlistQuery.isError ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-gray-300" />
            <h2
              className="mt-4 text-xl font-bold"
              style={{ color: COLORS.navy }}
            >
              Unable to load your wishlist
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => wishlistQuery.refetch()}
              className="mt-5 inline-flex items-center gap-2 font-semibold"
              style={{ color: COLORS.blue }}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF0FF]">
              <Heart
                className="h-8 w-8"
                style={{ color: COLORS.blue }}
              />
            </div>

            <h2
              className="mt-5 text-xl font-bold"
              style={{ color: COLORS.navy }}
            >
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Save products you like and come back to them whenever
              you are ready.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: COLORS.blue }}
            >
              <ShoppingBag size={17} />
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  className="text-lg font-bold md:text-xl"
                  style={{ color: COLORS.navy }}
                >
                  Your Saved Products
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Keep track of the products you love.
                </p>
              </div>

              <Link
                to="/products"
                className="text-sm font-semibold"
                style={{ color: COLORS.blue }}
              >
                Continue Shopping →
              </Link>
            </div>

            {removeMutation.isError && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {removeMutation.error?.response?.data?.message ||
                  "Unable to remove this product. Please try again."}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {products.map((product) => {
                const productId = product.id;

                return (
                  <div
                    key={productId || product.slug}
                    className="min-w-0"
                  >
                    <ProductCard product={product} />

                    <button
                      type="button"
                      disabled={!productId || removeMutation.isPending}
                      onClick={() => {
                        if (
                          productId &&
                          window.confirm(
                            `Remove "${product.name}" from your wishlist?`
                          )
                        ) {
                          removeMutation.mutate(productId);
                        }
                      }}
                      className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60"
                    >
                      <Trash2 size={15} />
                      Remove from Wishlist
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function WishlistLoading() {
  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="space-y-3 p-4">
                <div className="h-3 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-5 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
