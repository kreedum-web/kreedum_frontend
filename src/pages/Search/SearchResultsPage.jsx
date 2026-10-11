import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { searchService } from "@/api";
import { normalizeProducts } from "@/adapters/product.adapter";
import { COLORS } from "@/config/theme";
import ProductCard from "@/components/product/ProductCard";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import SortDropdown from "@/components/common/SortDropdown";

const LIMIT = 20;

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
  { label: "Highest Discount", value: "discount" },
  { label: "Most Popular", value: "popular" },
  { label: "Featured", value: "featured" },
];

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSort = searchParams.get("sort");

const sort = SORT_OPTIONS.some(
  (option) => option.value === requestedSort
)
  ? requestedSort
  : "relevance";

  const query = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["search-results", query, page, sort],
    queryFn: () =>
      searchService.searchProducts({
        q: query,
        page,
        limit: LIMIT,
        sort,
      }),
    enabled: query.length > 0,
  });

  const data = response?.data;
  const products = normalizeProducts(data?.products || []);
  const pagination = data?.pagination;

  function changePage(nextPage) {
    if (
      !pagination ||
      nextPage < 1 ||
      nextPage > pagination.totalPages
    ) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        eyebrow="Kreedum Sports"
        title={query ? `Search results for "${query}"` : "Search Products"}
        description="Find the sports and fitness equipment you need."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Search" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-7 md:px-6 md:py-10">
        {!query ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-4 text-xl font-bold" style={{ color: COLORS.navy }}>
              Enter a product to search
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Use the search bar above to find products.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl bg-white"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <h2 className="text-xl font-bold" style={{ color: COLORS.navy }}>
              Unable to load search results
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please try searching again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 font-semibold"
              style={{ color: COLORS.blue }}
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-4 text-xl font-bold" style={{ color: COLORS.navy }}>
              No products found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              No results for "{query}". Try a different product name or keyword.
            </p>
          </div>
        ) : (
          <>
           
<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h2
      className="text-lg font-bold md:text-xl"
      style={{ color: COLORS.navy }}
    >
      Products matching "{query}"
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      {pagination?.totalProducts ?? products.length} products found
    </p>
  </div>

 



<div className="flex items-center justify-between gap-3 sm:justify-start">
  <span className="whitespace-nowrap text-sm text-gray-500">
    Sort By
  </span>

  <SortDropdown
    value={sort}
    options={SORT_OPTIONS}
    onChange={(value) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("sort", value);
      nextParams.set("page", "1");
      setSearchParams(nextParams);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }}
  />
</div>


</div>


            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => changePage(page - 1)}
                  className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ color: COLORS.navy }}
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => changePage(page + 1)}
                  className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ color: COLORS.navy }}
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
