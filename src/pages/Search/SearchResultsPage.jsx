import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { searchService } from "@/api";
import { normalizeProducts } from "@/adapters/product.adapter";
import { COLORS } from "@/config/theme";
import ProductCard from "@/components/product/ProductCard";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import Dropdown from "@/components/common/Dropdown";
import Pagination from "@/components/common/Pagination";

const LIMIT = 20;

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
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
  const understood = data?.interpreted;

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
              No results for "{query}".{" "}
              {understood?.minPrice != null || understood?.maxPrice != null
                ? `Nothing in that price range (${priceText(understood)}): try a different budget.`
                : "Try a different product name or keyword."}
            </p>
          </div>
        ) : (
          <>
           

<div className="mb-5">
  <div className="mb-4">
    <h2
      className="text-lg font-bold md:text-xl"
      style={{ color: COLORS.navy }}
    >
      Products matching "{query}"
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      {pagination?.totalProducts ?? products.length} products found
    </p>
    <SearchUnderstood understood={understood} />
  </div>

  <div className="flex w-full items-center justify-between gap-3">
    <span className="whitespace-nowrap text-sm text-gray-500">
      Page{" "}
      <span className="font-semibold" style={{ color: COLORS.navy }}>
        {pagination?.page || page}
      </span>{" "}
      of{" "}
      <span className="font-semibold" style={{ color: COLORS.navy }}>
        {pagination?.totalPages || 1}
      </span>
    </span>

    <div className="flex min-w-0 items-center gap-2">
      <span className="whitespace-nowrap text-sm text-gray-500">
        Sort By
      </span>

      <Dropdown
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
</div>



            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>

            <Pagination
  pagination={pagination}
  onPageChange={changePage}
/>
          </>
        )}
      </section>
    </main>
  );
}

const rupees = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

/** "under ₹1,00,000", "₹10,000 – ₹20,000", "above ₹50,000" */
function priceText({ minPrice, maxPrice } = {}) {
  if (minPrice != null && maxPrice != null) return `${rupees(minPrice)} – ${rupees(maxPrice)}`;
  if (maxPrice != null) return `under ${rupees(maxPrice)}`;
  if (minPrice != null) return `above ${rupees(minPrice)}`;
  return "";
}

/** What the search understood: typo fixes, the price range, closest matches. */
function SearchUnderstood({ understood }) {
  if (!understood) return null;
  const { corrections = [], relaxed } = understood;
  const price = priceText(understood);
  if (!corrections.length && !price && !relaxed) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      {corrections.length > 0 && (
        <span className="rounded-full bg-[#EAF0FF] px-3 py-1 text-[#1F49B8]">
          Showing results for{" "}
          {corrections.map((c, i) => (
            <span key={c.from}>
              {i > 0 && ", "}
              <strong>{c.to}</strong>
            </span>
          ))}
        </span>
      )}
      {price && (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
          Price: <strong>{price}</strong>
        </span>
      )}
      {relaxed && (
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-900">
          No product matches every word. Showing the closest matches.
        </span>
      )}
    </div>
  );
}
