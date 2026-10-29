import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { brandService, productService } from "@/api";
import { normalizeProducts } from "@/adapters/product.adapter";
import { COLORS } from "@/config/theme";
import { SORT_OPTIONS } from "@/constants/productFilters";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import ProductCard from "@/components/product/ProductCard";
import SortDropdown from "@/components/common/SortDropdown";
import Pagination from "@/components/common/Pagination";

const LIMIT = 20;

/**
 * /brands/:slug — all of one brand's products, filterable by the
 * department and category they belong to.
 */
export default function BrandPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const department = searchParams.get("department") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "latest";
  const page = Number(searchParams.get("page")) || 1;

  const brandQuery = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => brandService.getBrand(slug),
    staleTime: 10 * 60 * 1000,
    retry: (count, error) => error?.response?.status !== 404 && count < 2,
  });

  const brand = brandQuery.data?.data?.brand;

  const params = {
    brand: slug,
    page,
    limit: LIMIT,
    sort,
    ...(department ? { department } : {}),
    ...(category ? { parentCategory: category } : {}),
  };

  const productsQuery = useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    enabled: Boolean(brand),
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

  function update(changes) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in changes)) next.set("page", "1");
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------------------------------------------------------------- states

  if (brandQuery.isLoading) {
    return (
      <main className="min-h-screen bg-[#F6F8FC]">
        <InnerPageHeader title="Loading…" />
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="min-h-screen bg-[#F6F8FC]">
        <InnerPageHeader
          title={brandQuery.isError && brandQuery.error?.response?.status !== 404 ? "Unable to load brand" : "Brand not found"}
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Brands", to: "/brands" }]}
        />
        <section className="mx-auto max-w-6xl px-6 py-12 text-center">
          <Link to="/brands" className="font-semibold" style={{ color: COLORS.blue }}>
            See all brands
          </Link>
        </section>
      </main>
    );
  }

  const departments = brand.categories || [];
  const selectedDepartment = departments.find((d) => d.slug === department);

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        title={brand.name}
        description={brand.description || `${brand.stats?.totalProducts ?? 0} products`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Brands", to: "/brands" }, { label: brand.name }]}
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
          BY CATEGORY
      ====================================================== */}

      {departments.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 md:pt-7">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-widest" style={{ color: COLORS.blue }}>
            Shop {brand.name} by Category
          </p>

          {/* Mobile: compact dropdowns */}
          <div className="grid grid-cols-1 gap-2 md:hidden">
            <SortDropdown
              fullWidth
              align="left"
              label="Departments"
              value={department}
              options={[
                { label: `All ${brand.name} (${brand.stats?.totalProducts ?? 0})`, value: "" },
                ...departments.map((d) => ({ label: `${d.name} (${d.productCount})`, value: d.slug })),
              ]}
              onChange={(value) => update({ department: value, category: "" })}
            />

            {selectedDepartment && selectedDepartment.children.length > 1 && (
              <SortDropdown
                fullWidth
                align="left"
                label="Categories"
                value={category}
                options={[
                  { label: `All ${selectedDepartment.name}`, value: "" },
                  ...selectedDepartment.children.map((c) => ({ label: `${c.name} (${c.productCount})`, value: c.slug })),
                ]}
                onChange={(value) => update({ category: value })}
              />
            )}
          </div>

          {/* Desktop: buttons */}
          <div className="hidden flex-wrap gap-2 md:flex">
            <Chip active={!department} onClick={() => update({ department: "", category: "" })}>
              All
              <Count>{brand.stats?.totalProducts}</Count>
            </Chip>

            {departments.map((item) => (
              <Chip
                key={item.slug}
                active={item.slug === department}
                onClick={() => update({ department: item.slug, category: "" })}
              >
                {item.name}
                <Count>{item.productCount}</Count>
              </Chip>
            ))}
          </div>

          {selectedDepartment && selectedDepartment.children.length > 1 && (
            <div className="mt-3 hidden flex-wrap gap-2 border-t border-gray-200 pt-3 md:flex">
              <Chip small active={!category} onClick={() => update({ category: "" })}>
                All {selectedDepartment.name}
              </Chip>
              {selectedDepartment.children.map((item) => (
                <Chip
                  small
                  key={item.slug}
                  active={item.slug === category}
                  onClick={() => update({ category: item.slug })}
                >
                  {item.name}
                  <Count>{item.productCount}</Count>
                </Chip>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-4 pt-3 sm:px-6 md:pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[13px] text-gray-500">
            {pagination.totalPages > 0 && (
              <>
                Page{" "}
                <span className="font-medium" style={{ color: COLORS.navy }}>
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-medium" style={{ color: COLORS.navy }}>
                  {pagination.totalPages}
                </span>
              </>
            )}
          </span>

          <div className="flex items-center gap-2">
            <span className="hidden whitespace-nowrap text-[13px] text-gray-500 md:inline">Sort By</span>
            <SortDropdown value={sort} options={SORT_OPTIONS} onChange={(value) => update({ sort: value })} />
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-4 py-5 pb-10 sm:px-6 md:py-7">
        {productsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl border border-gray-100 bg-white" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.navy }}>
              No products found
            </h2>
            <button
              type="button"
              onClick={() => update({ department: "", category: "" })}
              className="mt-5 font-semibold"
              style={{ color: COLORS.blue }}
            >
              Show all {brand.name} products
            </button>
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
          update({ page: String(next) });
        }}
      />
    </main>
  );
}

function Chip({ active, small = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border font-medium transition-colors hover:border-[#2C62E0] ${
        small ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]"
      }`}
      style={{
        color: active ? COLORS.white : COLORS.navy,
        backgroundColor: active ? COLORS.blue : COLORS.white,
        borderColor: active ? COLORS.blue : "#E5E7EB",
      }}
    >
      {children}
    </button>
  );
}

function Count({ children }) {
  return <span className="ml-1 text-[11px] opacity-60">{children}</span>;
}
