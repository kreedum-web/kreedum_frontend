import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { productService } from "@/api";
import { normalizeProducts } from "@/adapters/product.adapter";
import { COLORS } from "@/config/theme";
import ProductCard from "@/components/product/ProductCard";

const DEPARTMENTS = [
  { label: "All Departments", value: "" },
  { label: "Cardio", value: "cardio" },
  {
    label: "Strength Equipment",
    value: "strength-equipment",
  },
  {
    label: "Free Weights",
    value: "free-weights",
  },
  {
    label: "Sports Equipment",
    value: "sports-equipment",
  },
  {
    label: "Yoga & Recovery",
    value: "yoga-recovery",
  },
];

const PARENT_CATEGORIES = [
  { label: "All Categories", value: "" },
  { label: "Treadmills", value: "treadmills" },
  {
    label: "Upright Bikes",
    value: "upright-bikes",
  },
  {
    label: "Spin Bikes",
    value: "spin-bikes",
  },
  {
    label: "Rowing Machines",
    value: "rowing-machines",
  },
  {
    label: "Benches & Racks",
    value: "benches-racks",
  },
  {
    label: "Home Gyms",
    value: "home-gyms",
  },
  {
    label: "Pickleball",
    value: "pickleball",
  },
];

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  {
    label: "Price: Low to High",
    value: "price_low_high",
  },
  {
    label: "Price: High to Low",
    value: "price_high_low",
  },
  {
    label: "Highest Discount",
    value: "discount",
  },
  {
    label: "Most Popular",
    value: "popular",
  },
  {
    label: "Featured",
    value: "featured",
  },
];

const STOCK_OPTIONS = [
  { label: "All Stock Status", value: "" },
  { label: "In Stock", value: "in_stock" },
  {
    label: "Out of Stock",
    value: "out_of_stock",
  },
  {
    label: "Enquiry Only",
    value: "enquiry_only",
  },
  {
    label: "Preorder",
    value: "preorder",
  },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const page =
    Number(searchParams.get("page")) || 1;

  const limit = 20;

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [filters, setFilters] = useState(() => ({
    department:
      searchParams.get("department") || "",

    parentCategory:
      searchParams.get("parentCategory") || "",

    childCategory:
      searchParams.get("childCategory") || "",

    brand: searchParams.get("brand") || "",

    stockStatus:
      searchParams.get("stockStatus") || "",

    minPrice:
      searchParams.get("minPrice") || "",

    maxPrice:
      searchParams.get("maxPrice") || "",

    sort:
      searchParams.get("sort") || "latest",
  }));

const queryParams = useMemo(() => {
  const params = {
    page,
    limit,
  };

  const filterKeys = [
    "department",
    "parentCategory",
    "childCategory",
    "brand",
    "stockStatus",
    "minPrice",
    "maxPrice",
    "sort",
  ];

  filterKeys.forEach((key) => {
    const value = searchParams.get(key);

    if (value) {
      params[key] = value;
    }
  });

  return params;
}, [searchParams, page]);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", queryParams],

    queryFn: () =>
      productService.getProducts(
        queryParams
      ),
  });

  const data = response?.data;

  const products = normalizeProducts(
    data?.products || []
  );

  const pagination =
    data?.pagination || {
      page: 1,
      limit,
      totalProducts: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };

  function updateFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function applyFilters() {
    const nextParams = {};

    Object.entries(filters).forEach(
      ([key, value]) => {
        if (value !== "") {
          nextParams[key] = value;
        }
      }
    );

    nextParams.page = "1";

    setSearchParams(nextParams);
    setFiltersOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetFilters() {
  const reset = {
    department: "",
    parentCategory: "",
    childCategory: "",
    brand: "",
    stockStatus: "",
    minPrice: "",
    maxPrice: "",
    sort: "latest",
  };

  // Reset local form state
  setFilters(reset);

  // Remove all filter parameters from URL
  setSearchParams({
    page: "1",
  });

  // Close filter panel
  setFiltersOpen(false);

  // Return to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  function goToPage(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === pagination.page
    ) {
      return;
    }

    const nextParams = new URLSearchParams(
      searchParams
    );

    nextParams.set(
      "page",
      String(nextPage)
    );

    setSearchParams(nextParams);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (isLoading) {
    return <ProductsLoading />;
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] pt-24">
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center">
            <h1
              className="text-2xl font-bold"
              style={{
                color: COLORS.navy,
              }}
            >
              Unable to load products
            </h1>

            <p className="mt-2 text-gray-500">
              Something went wrong while loading
              the catalogue.
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 font-semibold"
              style={{
                color: COLORS.blue,
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-[#F6F8FC]">

  {/* =====================================================
      HEADER
  ====================================================== */}

  <section className="relative overflow-hidden bg-gradient-to-br from-[#0E1A3D] via-[#16234A] to-[#2C62E0] text-white">

    {/* Background glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#2C62E0] opacity-30 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#1F49B8] opacity-30 blur-3xl" />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-14">

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

        <div>

          <p className="text-xs font-mono tracking-widest uppercase mb-3 text-blue-200">
            Kreedum Sports
          </p>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Shop All Products
          </h1>

          <p className="mt-3 text-blue-100 text-base md:text-lg">
            Explore sports, fitness and gym equipment.
          </p>

        </div>

        <div className="text-sm text-blue-100">

          Showing{" "}

          <span className="font-semibold text-white">
            {products.length}
          </span>{" "}

          of{" "}

          <span className="font-semibold text-white">
            {pagination.totalProducts}
          </span>{" "}

          products

        </div>

      </div>

    </div>

  </section>

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

<section className="max-w-6xl mx-auto px-6 pt-7">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    {/* Filter button */}
    <button
      type="button"
      onClick={() => setFiltersOpen((current) => !current)}
      className="
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-3
        rounded-2xl
        bg-white
        border
        border-gray-200
        text-sm
        font-semibold
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-sm
      "
      style={{
        color: COLORS.navy,
      }}
    >
      <SlidersHorizontal
        className="w-4 h-4"
        style={{
          color: COLORS.blue,
        }}
      />

      Filters
    </button>

    {/* Right side controls */}
    <div className="flex items-center gap-4">

      <span className="text-sm text-gray-500">
        Page{" "}
        <span
          className="font-semibold"
          style={{
            color: COLORS.navy,
          }}
        >
          {pagination.page}
        </span>{" "}
        of{" "}
        <span
          className="font-semibold"
          style={{
            color: COLORS.navy,
          }}
        >
          {pagination.totalPages}
        </span>
      </span>

      {/* Sort */}
      <label className="flex items-center gap-2">

        <span className="text-sm text-gray-500 whitespace-nowrap">
          Sort By
        </span>

        <select
          value={filters.sort}
          onChange={(event) => {
            const value = event.target.value;

            updateFilter("sort", value);

            const nextParams = new URLSearchParams(
              searchParams
            );

            nextParams.set("sort", value);
            nextParams.set("page", "1");

            setSearchParams(nextParams);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            outline-none
            focus:border-[#2C62E0]
            font-medium
          "
          style={{
            color: COLORS.navy,
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

      </label>

    </div>

  </div>
</section>

      {/* =====================================================
          FILTER PANEL
      ====================================================== */}

      {filtersOpen && (
        <section className="max-w-6xl mx-auto px-6 pt-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="font-semibold"
                  style={{
                    color: COLORS.navy,
                  }}
                >
                  Filter Products
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Refine the catalogue using
                  backend-supported filters.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFiltersOpen(false)
                }
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FilterSelect
                label="Department"
                value={filters.department}
                options={DEPARTMENTS}
                onChange={(value) =>
                  updateFilter(
                    "department",
                    value
                  )
                }
              />

              <FilterSelect
                label="Category"
                value={
                  filters.parentCategory
                }
                options={PARENT_CATEGORIES}
                onChange={(value) =>
                  updateFilter(
                    "parentCategory",
                    value
                  )
                }
              />

              <FilterInput
                label="Subcategory"
                placeholder="e.g. commercial-treadmill"
                value={
                  filters.childCategory
                }
                onChange={(value) =>
                  updateFilter(
                    "childCategory",
                    value
                  )
                }
              />

              <FilterInput
                label="Brand"
                placeholder="e.g. aerofit"
                value={filters.brand}
                onChange={(value) =>
                  updateFilter(
                    "brand",
                    value
                  )
                }
              />

              <FilterInput
                label="Minimum Price"
                type="number"
                placeholder="₹ Minimum"
                value={filters.minPrice}
                onChange={(value) =>
                  updateFilter(
                    "minPrice",
                    value
                  )
                }
              />

              <FilterInput
                label="Maximum Price"
                type="number"
                placeholder="₹ Maximum"
                value={filters.maxPrice}
                onChange={(value) =>
                  updateFilter(
                    "maxPrice",
                    value
                  )
                }
              />

              {/* <FilterSelect
                label="Stock"
                value={
                  filters.stockStatus
                }
                options={STOCK_OPTIONS}
                onChange={(value) =>
                  updateFilter(
                    "stockStatus",
                    value
                  )
                }
              /> */}

           
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={applyFilters}
                className="px-5 py-3 rounded-xl font-semibold text-sm text-white"
                style={{
                  backgroundColor:
                    COLORS.blue,
                }}
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-3 rounded-xl font-semibold text-sm border border-gray-200"
                style={{
                  color: COLORS.navy,
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="max-w-6xl mx-auto px-6 py-7 pb-10">
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <h2
              className="text-xl font-semibold"
              style={{
                color: COLORS.navy,
              }}
            >
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing or removing your
              filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 font-semibold"
              style={{
                color: COLORS.blue,
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={
                  product.id ||
                  product.slug
                }
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          searchParams={searchParams}
          onPageChange={goToPage}
        />
      )}
    </main>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  pagination,
  onPageChange,
}) {
  const {
    page,
    totalPages,
    hasPrevPage,
    hasNextPage,
  } = pagination;

  const pages = getPageNumbers(
    page,
    totalPages
  );

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="flex justify-center">
        <div className="flex items-center gap-1 sm:gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
          <button
            type="button"
            disabled={!hasPrevPage}
            onClick={() =>
              onPageChange(page - 1)
            }
            className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              Previous
            </span>
          </button>

          {pages.map((item, index) =>
            item === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() =>
                  onPageChange(item)
                }
                className={`min-w-10 h-10 px-3 rounded-xl text-sm font-semibold ${
                  item === page
                    ? "text-white"
                    : "hover:bg-gray-100"
                }`}
                style={
                  item === page
                    ? {
                        backgroundColor:
                          COLORS.blue,
                      }
                    : {
                        color:
                          COLORS.navy,
                      }
                }
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() =>
              onPageChange(page + 1)
            }
            className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <span className="hidden sm:inline">
              Next
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function getPageNumbers(
  currentPage,
  totalPages
) {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  const pages = [1];

  if (currentPage > 4) {
    pages.push("...");
  }

  const start = Math.max(
    2,
    currentPage - 1
  );

  const end = Math.min(
    totalPages - 1,
    currentPage + 1
  );

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

/* =========================================================
   FILTER COMPONENTS
========================================================= */

function FilterSelect({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 mb-2">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#2C62E0]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 mb-2">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#2C62E0]"
      />
    </label>
  );
}

/* =========================================================
   LOADING
========================================================= */

function ProductsLoading() {
  return (
    <main className="min-h-screen bg-[#F6F8FC] pt-24">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />

          <div className="h-10 w-72 bg-gray-200 rounded mt-4 animate-pulse" />

          <div className="h-5 w-96 max-w-full bg-gray-200 rounded mt-3 animate-pulse" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100"
            >
              <div className="aspect-square bg-gray-200 animate-pulse" />

              <div className="p-4">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />

                <div className="h-10 w-full bg-gray-200 rounded mt-3 animate-pulse" />

                <div className="h-5 w-24 bg-gray-200 rounded mt-4" />

                <div className="h-10 w-full bg-gray-200 rounded mt-4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}