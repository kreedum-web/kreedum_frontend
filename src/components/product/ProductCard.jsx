import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Heart,
  LoaderCircle,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { cartService, wishlistService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { COLORS } from "@/config/theme";

export default function ProductCard({ product, variant = "default" }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [actionError, setActionError] = useState("");

  const productId = product?.id || product?._id;
  const image = product?.image || product?.thumbnail || product?.images?.[0] || "";
  const slug = product?.slug;
  const price = Number(product?.price ?? product?.sellingPrice) || 0;
  const originalPrice = Number(product?.originalPrice ?? product?.mrp) || 0;
  const discount = Number(product?.discount ?? product?.discountPercent) || 0;
  const isWishlistCard = variant === "wishlist";
  const brand = typeof product?.brand === "string"
    ? product.brand
    : product?.brand?.name || "Unknown";

  const wishlistStatusQuery = useQuery({
    queryKey: ["wishlist-status", productId],
    queryFn: async () => {
      const response = await wishlistService.checkWishlist(productId);
      return Boolean(response?.data?.data?.wishlisted);
    },
    enabled: Boolean(product && isAuthenticated && productId && !isWishlistCard),
    retry: false,
  });

  const isWishlisted = isWishlistCard || Boolean(wishlistStatusQuery.data);

  const wishlistMutation = useMutation({
    mutationFn: () => isWishlisted
      ? wishlistService.removeFromWishlist(productId)
      : wishlistService.addToWishlist(productId),
    onSuccess: async () => {
      setFeedback(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
      setActionError("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
        queryClient.invalidateQueries({ queryKey: ["wishlist-status", productId] }),
      ]);
    },
    onError: (error) => {
      setActionError(
        error?.response?.data?.message ||
          "Could not update your wishlist. Please try again."
      );
    },
  });

  const cartMutation = useMutation({
    mutationFn: () => cartService.addToCart(productId, 1),
    onSuccess: async () => {
      setFeedback("Added to cart");
      setActionError("");
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      setActionError(
        error?.response?.data?.message ||
          "Could not add this product to your cart. Please try again."
      );
    },
  });

  if (!product) return null;

  function handleWishlistClick() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (!productId || wishlistMutation.isPending) return;
    setFeedback("");
    setActionError("");
    wishlistMutation.mutate();
  }

  function handleCartClick() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (!productId || cartMutation.isPending) return;
    setFeedback("");
    setActionError("");
    cartMutation.mutate();
  }

  const actionPending = wishlistMutation.isPending || cartMutation.isPending;
  const unavailable = Boolean(product.stockStatus && product.stockStatus !== "in_stock");

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-[#F6F8FC]">
        {slug ? (
          <Link to={`/products/${slug}`} aria-label={`View ${product.name}`} className="block h-full w-full">
            {image ? (
              <img
                src={image}
                alt={product.name || "Product"}
                loading="lazy"
                className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] md:p-5"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">No image available</div>
            )}
          </Link>
        ) : image ? (
          <img src={image} alt={product.name || "Product"} loading="lazy" className="h-full w-full object-contain p-4 md:p-5" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No image available</div>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {discount}% off
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={!productId || actionPending || (!isWishlistCard && wishlistStatusQuery.isLoading && isAuthenticated)}
          aria-label={isWishlistCard || isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          title={isWishlistCard || isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-[#0E1A3D] shadow-sm transition hover:scale-105 hover:text-red-600 disabled:cursor-wait disabled:opacity-60"
        >
          {wishlistMutation.isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : isWishlistCard ? (
            <X className="h-4 w-4" />
          ) : (
            <Heart
              className="h-[18px] w-[18px]"
              fill={isWishlisted ? "currentColor" : "none"}
              style={{ color: isWishlisted ? "#DC2626" : COLORS.navy }}
            />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 md:p-4">
        {brand !== "Unknown" && (
          <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] md:text-[11px]" style={{ color: COLORS.slateLight }}>
            {brand}
          </p>
        )}

        {slug ? (
          <Link to={`/products/${slug}`} className="block">
            <h3 className="line-clamp-2 min-h-[2.6rem] text-[13px] font-semibold leading-[1.3rem] transition-colors hover:text-[#2C62E0] md:text-sm" style={{ color: COLORS.navy }}>
              {product.name}
            </h3>
          </Link>
        ) : (
          <h3 className="line-clamp-2 min-h-[2.6rem] text-[13px] font-semibold leading-[1.3rem] md:text-sm" style={{ color: COLORS.navy }}>
            {product.name}
          </h3>
        )}

        {/* Static presentation rating, as requested. This is not live review data. */}
        <div className="mt-2 flex items-center gap-1.5" aria-label="Rated 4.5 out of 5">
          <span className="flex items-center gap-px text-[15px] leading-none text-amber-500" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className="relative inline-block">
                {index === 4 ? (
                  <>
                    <span className="text-gray-300">★</span>
                    <span className="absolute inset-y-0 left-0 overflow-hidden text-amber-500" style={{ width: "50%" }}>★</span>
                  </>
                ) : "★"}
              </span>
            ))}
          </span>
          <span className="text-[11px] font-medium text-gray-500">4.5</span>
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-extrabold leading-6 md:text-lg" style={{ color: COLORS.navy }}>
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice > price && (
            <span className="text-[11px] text-gray-400 line-through md:text-xs">
              MRP ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={handleCartClick}
            disabled={!productId || actionPending || unavailable}
            aria-label={`Add ${product.name} to cart`}
            title={unavailable ? "Currently unavailable" : "Add to cart"}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[#0E1A3D] transition hover:border-[#2C62E0] hover:bg-[#EAF0FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cartMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : cartMutation.isSuccess ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>

          {slug ? (
            <Link to={`/products/${slug}`} className="inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-3 text-xs font-semibold text-white transition hover:opacity-90 md:text-sm" style={{ backgroundColor: COLORS.blue }}>
              View Product <Plus className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <button type="button" disabled className="inline-flex h-9 min-w-0 flex-1 items-center justify-center rounded-lg px-3 text-xs font-semibold text-white opacity-50 md:text-sm" style={{ backgroundColor: COLORS.blue }}>
              View Product
            </button>
          )}
        </div>

        {(feedback || actionError) && (
          <p role={actionError ? "alert" : "status"} aria-live="polite" className={`mt-2 line-clamp-2 text-[11px] ${actionError ? "text-red-600" : "text-green-600"}`}>
            {actionError || feedback}
          </p>
        )}
      </div>
    </article>
  );
}
