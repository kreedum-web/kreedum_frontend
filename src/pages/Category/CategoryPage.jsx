import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { brandService, productService } from "@/api";
import { normalizeProducts } from "@/adapters/product.adapter";
import { COLORS } from "@/config/theme";
import { SORT_OPTIONS } from "@/constants/productFilters";
import { CATEGORY_FIELD_BY_LEVEL, categoryUrl, useCategoryTree } from "@/hooks/useCategories";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import ProductCard from "@/components/product/ProductCard";
import SortDropdown from "@/components/common/SortDropdown";
import Pagination from "@/components/common/Pagination";

const LIMIT = 20;

/**
 * /categories/:slug — one department, category or sub-category, like a
 * Metro Sports category page: breadcrumb, sub-categories, products.
 */
export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { bySlug, isLoading: treeLoading, isError: treeError } = useCategoryTree();

  const category = bySlug.get(slug);
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "latest";
  const brand = searchParams.get("brand") || "";

  const params = category
    ? {
        [CATEGORY_FIELD_BY_LEVEL[category.level]]: category.slug,
        page,
        limit: LIMIT,
        sort,
        ...(brand ? { brand } : {}),
      }
    : null;

  const productsQuery = useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    enabled: Boolean(params),
  });

  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.getBrands(),
    staleTime: 10 * 60 * 1000,
  });

  const products = normalizeProducts(productsQuery.data?.data?.products || []);
  const pagination = productsQuery.data?.data?.pagination || {
    page: 1,
    limit: LIMIT,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const brandOptions = [
    { label: "All Brands", value: "" },
    ...(brandsQuery.data?.data?.brands || [])
      .filter((b) => b.isActive !== false && (b.productCount ?? 1) > 0)
      .map((b) => ({ label: b.name, value: b.slug })),
  ];

  function setParam(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    if (name !== "page") next.set("page", "1");
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------------------------------------------------------------- states

  if (treeLoading) return <CategoryLoading />;

  if (!category) {
    return (
      <main className="min-h-screen bg-[#F6F8FC]">
        <InnerPageHeader
          title={treeError ? "Unable to load categories" : "Category not found"}
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Categories", to: "/categories" }]}
        />
        <section className="mx-auto max-w-6xl px-6 py-12 text-center">
          <p className="text-gray-500">
            {treeError
              ? "Something went wrong while loading the categories."
              : "This category doesn't exist or has no products right now."}
          </p>
          <Link to="/categories" className="mt-5 inline-block font-semibold" style={{ color: COLORS.blue }}>
            Browse all categories
          </Link>
        </section>
      </main>
    );
  }

  // Sub-categories to show: this category's children, or — on the deepest
  // level — its siblings, so shoppers can move sideways like on Metro Sports.
  const parent = category.parentSlug ? bySlug.get(category.parentSlug) : null;
  const subNav = category.children.length ? category.children : parent?.children || [];
  const showingSiblings = !category.children.length && subNav.length > 1;

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Categories", to: "/categories" },
    ...category.path.slice(0, -1).map((item) => ({ label: item.name, to: categoryUrl(item.slug) })),
    { label: category.name },
  ];

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        title={category.name}
        breadcrumbs={breadcrumbs}
        description={`${category.productCount} product${category.productCount === 1 ? "" : "s"}`}
        rightContent={
          !productsQuery.isLoading && (
            <>
              Showing <span className="font-semibold text-white">{products.length}</span> of{" "}
              <span className="font-semibold text-white">{pagination.totalProducts}</span> products
            </>
          )
        }
      />

      {/* =====================================================
          SUB-CATEGORIES
      ====================================================== */}

      {(category.children.length > 0 || showingSiblings) && (
        <section className="mx-auto max-w-6xl px-6 pt-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.blue }}>
            {showingSiblings ? `More in ${parent.name}` : "Shop by Category"}
          </p>

          <div className="flex flex-wrap gap-2">
            {showingSiblings && (
              <Link
                to={categoryUrl(parent.slug)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                style={{ color: COLORS.navy }}
              >
                All {parent.name}
              </Link>
            )}

            {subNav.map((item) => {
              const current = item.slug === category.slug;

              return (
                <Link
                  key={item.slug}
                  to={categoryUrl(item.slug)}
                  aria-current={current ? "page" : undefined}
                  className="rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                  style={{
                    color: current ? COLORS.white : COLORS.navy,
                    backgroundColor: current ? COLORS.blue : COLORS.white,
                    borderColor: current ? COLORS.blue : "#E5E7EB",
                  }}
                >
                  {item.name}
                  <span className="ml-1.5 text-xs font-medium opacity-60">{item.productCount}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-gray-500">Brand</span>
            <select
              value={brand}
              onChange={(event) => setParam("brand", event.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#2C62E0]"
              style={{ color: COLORS.navy }}
            >
              {brandOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
            {pagination.totalPages > 0 && (
              <span className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold" style={{ color: COLORS.navy }}>
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold" style={{ color: COLORS.navy }}>
                  {pagination.totalPages}
                </span>
              </span>
            )}

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm text-gray-500">Sort By</span>
              <SortDropdown value={sort} options={SORT_OPTIONS} onChange={(value) => setParam("sort", value)} />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-7 pb-10">
        {productsQuery.isLoading ? (
          <ProductGridSkeleton />
        ) : productsQuery.isError ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.navy }}>
              Unable to load products
            </h2>
            <button
              type="button"
              onClick={() => productsQuery.refetch()}
              className="mt-5 font-semibold"
              style={{ color: COLORS.blue }}
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.navy }}>
              No products found
            </h2>
            <p className="mt-2 text-gray-500">
              {brand ? "No products from this brand in this category." : "This category has no products right now."}
            </p>
            {brand && (
              <button
                type="button"
                onClick={() => setParam("brand", "")}
                className="mt-5 font-semibold"
                style={{ color: COLORS.blue }}
              >
                Show all brands
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      <Pagination
        pagination={pagination}
        onPageChange={(next) => {
          if (next < 1 || next > pagination.totalPages || next === pagination.page) return;
          setParam("page", String(next));
        }}
      />
    </main>
  );
}

/* =========================================================
   LOADING
========================================================= */

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="aspect-square animate-pulse bg-gray-200" />
          <div className="p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-5 w-24 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader title="Loading…" />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <ProductGridSkeleton />
      </section>
    </main>
  );
}
