import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { homepageService } from "@/api";
import {
  Badge,
  Loader,
  SectionTitle,
} from "@/components/common";
import { normalizeHomepage } from "@/adapters/homepage.adapter";
import { COLORS } from "@/config/theme";

import ProductCard from "@/components/product/ProductCard";

function getBackendOrigin() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "";

  return apiUrl.replace(/\/api\/v1\/?$/, "");
}

function resolveImageUrl(image) {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${getBackendOrigin()}${image}`;
}

export default function HomePage() {
  const [activeBanner, setActiveBanner] = useState(0);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homepage"],
    queryFn: () =>
      homepageService.getHomepageData(),
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F6F8FC]">
        <Loader.Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F6F8FC] px-6">
        <div className="text-center">
          <h1
            className="text-2xl font-bold"
            style={{ color: COLORS.navy }}
          >
            Unable to load Kreedum
          </h1>

          <p className="mt-2 text-gray-500">
            We couldn't load the store right now.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 text-sm font-semibold"
            style={{ color: COLORS.blue }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /*
   * Backend response:
   *
   * {
   *   success: true,
   *   message: "...",
   *   data: { ... }
   * }
   */
  const homepage = normalizeHomepage(
    response?.data?.data
  );

  const {
    heroBanners,
    categories,
    featuredProducts,
    bestSellers,
    newArrivals,
    trendingProducts,
    deals,
    popularBrands,
    stats,
  } = homepage;

  const currentBanner =
    heroBanners[activeBanner];

  const goNext = () => {
    if (!heroBanners.length) return;

    setActiveBanner(
      (current) =>
        (current + 1) % heroBanners.length
    );
  };

  const goPrevious = () => {
    if (!heroBanners.length) return;

    setActiveBanner(
      (current) =>
        (current - 1 + heroBanners.length) %
        heroBanners.length
    );
  };

  return (
    <div
      className="bg-[#F6F8FC]"
      style={{ color: COLORS.navy }}
    >
      {/* =====================================================
          HERO
      ====================================================== */}
      {currentBanner && (
        <section className="relative min-h-[620px] md:min-h-[680px] overflow-hidden bg-[#0E1A3D]">
          {currentBanner.image && (
            <img
              src={resolveImageUrl(
                currentBanner.image
              )}
              alt={currentBanner.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A3D]/95 via-[#0E1A3D]/70 to-[#0E1A3D]/20" />

          <div className="relative max-w-7xl mx-auto px-6 pt-36 md:pt-44 pb-28">
            <div className="max-w-3xl">
              <Badge type="new">
                KREEDUM SPORTS
              </Badge>

              <h1
                className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05]"
                style={{ color: COLORS.white }}
              >
                {currentBanner.title}
              </h1>

              {currentBanner.subtitle && (
                <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/75">
                  {currentBanner.subtitle}
                </p>
              )}

              {currentBanner.buttonText && (
                <Link
                  to={
                    currentBanner.buttonLink ||
                    "/products"
                  }
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-full font-semibold transition-transform hover:scale-105"
                  style={{
                    backgroundColor: COLORS.blue,
                    color: COLORS.white,
                  }}
                >
                  {currentBanner.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Previous */}
          {heroBanners.length > 1 && (
            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous banner"
              className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Next */}
          {heroBanners.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next banner"
              className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Indicators */}
          {heroBanners.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {heroBanners.map((banner, index) => (
                <button
                  key={banner.id || index}
                  type="button"
                  onClick={() =>
                    setActiveBanner(index)
                  }
                  aria-label={`Go to banner ${
                    index + 1
                  }`}
                  className={`h-2 rounded-full transition-all ${
                    index === activeBanner
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          TRUST STRIP
      ====================================================== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrustItem
            icon={<Truck className="w-6 h-6" />}
            title="Reliable Delivery"
            description="Sports equipment delivered safely"
          />

          <TrustItem
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Trusted Products"
            description="Quality sports & fitness equipment"
          />

          <TrustItem
            icon={<RotateCcw className="w-6 h-6" />}
            title="Customer Support"
            description="We're here when you need us"
          />
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <SectionTitle
            title="Shop by Category"
            subtitle="Find the equipment and sports products you need."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((category) => (
              <Link
                key={category.id || category.slug}
                to={`/categories/${category.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square bg-[#EEF1F8] overflow-hidden">
                  {category.image ? (
                    <img
                      src={resolveImageUrl(
                        category.image
                      )}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span
                        className="text-5xl font-bold"
                        style={{ color: COLORS.blue }}
                      >
                        {category.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3
                    className="font-semibold"
                    style={{ color: COLORS.navy }}
                  >
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {category.productCount} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}
      <ProductSection
        title="Featured Products"
        subtitle="Hand-picked products from Kreedum."
        products={featuredProducts}
      />

      {/* =====================================================
          BEST SELLERS
      ====================================================== */}
      <ProductSection
        title="Best Sellers"
        subtitle="Products customers are buying the most."
        products={bestSellers}
        background
      />

      {/* =====================================================
          NEW ARRIVALS
      ====================================================== */}
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh products added to the store."
        products={newArrivals}
      />

      {/* =====================================================
          TRENDING
      ====================================================== */}
      <ProductSection
        title="Trending Now"
        subtitle="Popular products worth checking out."
        products={trendingProducts}
        background
      />

      {/* =====================================================
          DEALS
      ====================================================== */}
      {deals.length > 0 && (
        <ProductSection
          title="Today's Deals"
          subtitle="Grab the best available discounts."
          products={deals}
        />
      )}

      {/* =====================================================
          BRANDS
      ====================================================== */}
      {popularBrands.length > 0 && (
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <SectionTitle
              title="Popular Brands"
              subtitle="Explore products from trusted sports brands."
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {popularBrands.map((brand) => (
                <Link
                  key={brand.id || brand.slug}
                  to={`/brands/${brand.slug}`}
                  className="min-h-[96px] rounded-xl border border-gray-100 bg-white flex items-center justify-center p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {brand.logo ? (
                    <img
                      src={resolveImageUrl(brand.logo)}
                      alt={brand.name}
                      loading="lazy"
                      className="max-h-12 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          STATS
      ====================================================== */}
      {stats && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div
            className="rounded-3xl p-8 md:p-12 grid grid-cols-1 sm:grid-cols-3 gap-8"
            style={{
              backgroundColor: COLORS.navy,
            }}
          >
            <Stat
              value={stats.totalProducts}
              label="Products"
            />

            <Stat
              value={stats.totalCategories}
              label="Categories"
            />

            <Stat
              value={stats.totalBrands}
              label="Brands"
            />
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   PRODUCT SECTION
========================================================= */

function ProductSection({
  title,
  subtitle,
  products,
  background = false,
}) {
  if (!products?.length) return null;

  return (
    <section className={background ? "bg-white" : ""}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle
            title={title}
            subtitle={subtitle}
          />

          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold mb-6"
            style={{ color: COLORS.blue }}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={
                product.id ||
                product.slug
              }
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ color: COLORS.blue }}>
        {icon}
      </div>

      <div>
        <p
          className="font-semibold text-sm"
          style={{ color: COLORS.navy }}
        >
          {title}
        </p>

        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl md:text-4xl font-bold"
        style={{ color: COLORS.white }}
      >
        {Number(value || 0).toLocaleString(
          "en-IN"
        )}
      </div>

      <div className="mt-1 text-sm text-white/55">
        {label}
      </div>
    </div>
  );
}