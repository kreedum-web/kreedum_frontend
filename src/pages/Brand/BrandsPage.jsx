import { Link } from "react-router-dom";

import { COLORS } from "@/config/theme";
import { brandUrl } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import BrandLogo from "@/components/brand/BrandLogo";

/** /brands — every brand we sell (logo or name), with its product count. */
export default function BrandsPage() {
  const { brands, isLoading, isError } = useBrands();

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        title="Our Brands"
        description="Shop sports and fitness equipment by brand."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Brands" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-8 pb-14">
        {isError && (
          <p className="py-12 text-center text-gray-500">Something went wrong while loading the brands.</p>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-white" />
            ))}

          {brands.map((brand) => (
            <Link
              key={brand.slug}
              to={brandUrl(brand.slug)}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex aspect-[16/9] items-center justify-center bg-white p-5 transition-transform duration-300 group-hover:scale-105 md:p-7">
                <BrandLogo brand={brand} />
              </div>
              <div className="border-t border-gray-100 p-4">
                <p className="font-semibold" style={{ color: COLORS.navy }}>
                  {brand.name}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">{brand.productCount} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
