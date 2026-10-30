import { useQuery, } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { homepageService } from "@/api";
import {Loader,SectionTitle} from "@/components/common";
import { normalizeHomepage } from "@/adapters/homepage.adapter";
import { COLORS } from "@/config/theme";
import ProductCard from "@/components/product/ProductCard";
import homepageTestimonials from "@/data/homepageTestimonials";
import homepageClients from "@/data/homepageClients";
import { categoryUrl, useCategoryTree } from "@/hooks/useCategories";

// Category tiles (swipeable, two rows per page). These come first, then
// every department and every category that has products and a photo.
const TILE_CATEGORIES = [
  "treadmill",
  "home-gym",
  "dumbbells",
  "benches-racks",
  "spin-bike",
  "massagers",
  "boxing-and-punching-bags",
  "yoga",
];

// Shorter names where the full one doesn't fit on a small tile.
const TILE_LABELS = {
  "benches-racks": "Benches & Racks",
  "benches-racks-domestic": "Home Benches",
  "boxing-and-punching-bags": "Boxing Bags",
  "functional-trainer-cable-cross-over": "Cable Crossover",
  "functional-trainer-smith-machine-combo": "Smith Combo",
  "plate-loaded-station": "Plate Loaded",
  "outdoor-gym-equipment": "Outdoor Gym",
  "air-bikes-orbitracts": "Air Bikes",
  "elliptical-cross-trainer": "Ellipticals",
  "fixed-weighted-barbells": "Fixed Barbells",
  "full-body-vibrator-massager": "Body Vibrator",
  "leg-foot-massager": "Foot Massager",
  "attachments-for-machines": "Attachments",
  "boxes-bags": "Strength Bags",
  "training-hammer-sled": "Hammer & Sled",
  "band": "Bands",
  "tubes": "Tubes",
  "other-accessories": "More Gear",
};


const HERO_FALLBACK_IMAGES = [
  "/images/home-hero/aerofit-gym.jpg",
  "/images/home-hero/home-gym-setup.jpg",
  "/images/home-hero/sports-courts.jpg",
];

/* =========================================================
   CUSTOMER REVIEWS STRIP (top of the page, auto-scrolling)
========================================================= */

function TestimonialStrip() {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const speed = 28; // pixels per second
    let frameId;
    let lastTime = null;

    const animate = (time) => {
      if (lastTime !== null && !isPaused) {
        track.scrollLeft += (speed * (time - lastTime)) / 1000;
        // The cards are listed twice, so jumping back half way is seamless.
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft -= track.scrollWidth / 2;
        }
      }
      lastTime = time;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  return (
    <section aria-label="Customer reviews" className="bg-[#0E1A3D]">
      <div className="mx-auto flex max-w-7xl items-stretch gap-2 py-2.5 pl-3 sm:px-4 md:gap-4 md:px-6 md:py-4">
        <div className="flex w-[84px] shrink-0 flex-col justify-center text-white md:w-[160px]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-blue-200 md:text-xs">
            Customer stories
          </p>
          <p className="mt-0.5 text-sm font-bold leading-tight md:text-lg">
            Trusted by customers
          </p>
        </div>

        <div
          ref={trackRef}
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {[...homepageTestimonials, ...homepageTestimonials].map((testimonial, index) => (
            <article
              key={`${testimonial.name}-${index}`}
              aria-hidden={index >= homepageTestimonials.length || undefined}
              className="flex w-[150px] shrink-0 flex-col rounded-lg bg-white px-2.5 py-2 md:w-[240px] md:px-3.5 md:py-2.5"
            >
              <div
                className="text-[10px] leading-none text-[#F59E0B] md:text-xs"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, i) => (i < testimonial.rating ? "★" : "☆")).join("")}
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#4B5568] md:text-[13px]">
                {testimonial.review}
              </p>
              <p className="mt-auto pt-1 text-[10px] font-semibold text-[#0E1A3D] md:text-xs">
                {testimonial.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsSection() {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frameId;
    const speed = 32; // pixels per second

    const animate = (time) => {
      if (lastTimeRef.current !== null && !isPaused) {
        const delta = time - lastTimeRef.current;
        track.scrollLeft += (speed * delta) / 1000;

        // The list is duplicated for a seamless loop.
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft -= track.scrollWidth / 2;
        }
      }

      lastTimeRef.current = time;
      frameId = requestAnimationFrame(animate);
      animationRef.current = frameId;
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      lastTimeRef.current = null;
    };
  }, [isPaused]);

  const clients = [...homepageClients, ...homepageClients];

  return (
    <section aria-label="Our clients" className="mt-3 bg-[#0E1A3D] md:mt-5">
      <div className="mx-auto flex max-w-7xl items-center gap-2 py-2.5 pl-3 sm:px-4 md:gap-4 md:px-6 md:py-3">
        <div className="w-[84px] shrink-0 md:w-[160px]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-blue-200 md:text-xs">
            Our clients
          </p>
          <p className="mt-0.5 text-sm font-bold leading-tight text-white md:text-lg">
            Trusted by institutions
          </p>
        </div>

        <div
          ref={trackRef}
          className="clients-track flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {clients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-white px-2 py-1.5 md:h-16 md:w-32 md:px-3"
            >
              <img
                src={client.image}
                alt={index < homepageClients.length ? client.name : ""}
                aria-hidden={index >= homepageClients.length}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const { tree: categoryTree, bySlug: categoriesBySlug } = useCategoryTree();

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

  const homepage = normalizeHomepage(
    response?.data?.data
  );

  const {
    heroBanners,
    featuredProducts,
    bestSellers,
    newArrivals,
    trendingProducts,
    deals,
    stats,
  } = homepage;

  const currentBanner =
    heroBanners[activeBanner];

const goNext = () => {
  if (!heroBanners.length) return;

  setHeroImageFailed(false);

  setActiveBanner(
    (current) => (current + 1) % heroBanners.length
  );
};

const goPrevious = () => {
  if (!heroBanners.length) return;

  setHeroImageFailed(false);

  setActiveBanner(
    (current) =>
      (current - 1 + heroBanners.length) %
      heroBanners.length
  );
};

const handleHeroTouchStart = (event) => {
  const touch = event.touches[0];

  touchStartX.current = touch.clientX;
  touchStartY.current = touch.clientY;
};

const handleHeroTouchEnd = (event) => {
  if (
    touchStartX.current === null ||
    touchStartY.current === null
  ) {
    return;
  }

  const touch = event.changedTouches[0];

  const deltaX = touch.clientX - touchStartX.current;
  const deltaY = touch.clientY - touchStartY.current;

  // Only respond to horizontal swipes.
  if (
    Math.abs(deltaX) > 50 &&
    Math.abs(deltaX) > Math.abs(deltaY)
  ) {
    if (deltaX < 0) {
      goNext();
    } else {
      goPrevious();
    }
  }

  touchStartX.current = null;
  touchStartY.current = null;
};

  
  return (
    <div
      className="bg-[#F6F8FC]"
      style={{ color: COLORS.navy }}
    >
      {/* Clears the fixed navbar (158px on mobile, 114px on desktop).
          Navy on desktop, where the navbar is see-through at the top. */}
      <div aria-hidden="true" className="h-[158px] bg-white md:h-[114px] md:bg-[#0E1A3D]" />

      {/* =====================================================
          CUSTOMER REVIEWS
      ====================================================== */}
      <TestimonialStrip />

      {/* =====================================================
          CATEGORY TILES
      ====================================================== */}
      <CategoryTiles tree={categoryTree} bySlug={categoriesBySlug} />

      {/* =====================================================
          CLIENTS
      ====================================================== */}
      <ClientsSection />

      {/* =====================================================
          OFFER BANNER (managed in the admin as homepage banners)
      ====================================================== */}
      {currentBanner && (
<section
  className="relative mt-3 h-[210px] overflow-hidden bg-[#0E1A3D] touch-pan-y sm:h-[280px] md:mt-5 md:h-[360px]"
  onTouchStart={handleHeroTouchStart}
  onTouchEnd={handleHeroTouchEnd}
>
          <img
            src={
              !heroImageFailed && currentBanner.image
                ? resolveImageUrl(currentBanner.image)
                : HERO_FALLBACK_IMAGES[activeBanner % HERO_FALLBACK_IMAGES.length]
            }
            alt={currentBanner.title || "Kreedum Sports fitness equipment"}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => {
              if (!heroImageFailed) setHeroImageFailed(true);
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A3D]/90 via-[#0E1A3D]/55 to-transparent" />

          <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-9 sm:px-6 md:items-center md:pb-0">
            <div className="max-w-xl">
              <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl">
                {currentBanner.title}
              </h1>

              {currentBanner.subtitle && (
                <p className="mt-1.5 text-sm text-white/80 md:mt-3 md:text-lg">
                  {currentBanner.subtitle}
                </p>
              )}

              {currentBanner.buttonText && (
                <Link
                  to={currentBanner.buttonLink || "/categories"}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#0E1A3D] transition-colors hover:bg-[#EAF0FF] md:mt-6 md:px-6 md:py-3 md:text-sm"
                >
                  {currentBanner.buttonText}
                  <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Link>
              )}
            </div>
          </div>

          {heroBanners.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous banner"
                className="absolute left-5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next banner"
                className="absolute right-5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                {heroBanners.map((banner, index) => (
                  <button
                    key={banner.id || index}
                    type="button"
                    onClick={() => {
                      setHeroImageFailed(false);
                      setActiveBanner(index);
                    }}
                    aria-label={`Go to banner ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeBanner ? "w-6 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
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
          STATS
      ====================================================== */}
      {stats && (
       <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-10">
          <div
            className="grid grid-cols-3 gap-3 rounded-2xl p-5 md:gap-8 md:p-10"
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
   CATEGORY TILES — swipeable pages
   (4 x 2 per page on mobile, one row of 8 on desktop)
========================================================= */

// One page of tiles = the visible width plus the gap after it.
function tilePageWidth(track) {
  return track.clientWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
}

function CategoryTiles({ tree, bySlug }) {
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const tiles = [];
  const seen = new Set();
  const add = (item) => {
    if (item?.productCount > 0 && item.image && !seen.has(item.slug)) {
      seen.add(item.slug);
      tiles.push(item);
    }
  };
  TILE_CATEGORIES.forEach((slug) => add(bySlug.get(slug)));
  tree.forEach(add);
  tree.forEach((department) => department.children.forEach(add));

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const width = tilePageWidth(track);
    const count = Math.max(1, Math.ceil((track.scrollWidth + 1) / width - 0.01));
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    setPageCount(count);
    setPage(atEnd ? count - 1 : Math.round(track.scrollLeft / width));
  }, []);

  // Page count changes with the screen size (4 or 8 columns per page).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const observer = new ResizeObserver(() => update());
    observer.observe(track);
    return () => observer.disconnect();
  }, [update, tiles.length]);

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * tilePageWidth(track), behavior: "smooth" });
  };

  if (!tiles.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-3 pt-3 sm:px-4 md:px-6 md:pt-5">
      <div className="relative">
      <div
        ref={trackRef}
        onScroll={update}
        className="grid snap-x snap-mandatory grid-flow-col grid-rows-2 md:grid-rows-1 auto-cols-[calc((100%-3*0.375rem)/4)] gap-1.5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:auto-cols-[calc((100%-7*0.75rem)/8)] md:gap-3"
      >
        {tiles.map((category, index) => (
          <Link
            key={category.slug}
            to={categoryUrl(category.slug)}
            title={category.name}
            // a new page starts every 8 tiles (4 x 2 on mobile, 8 x 1 on desktop)
            className={`group relative block aspect-square overflow-hidden rounded-lg bg-white ${
              index % 8 === 0 ? "snap-start" : ""
            }`}
          >
            <img
              src={category.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-contain p-1.5 pb-6 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 line-clamp-2 bg-gradient-to-t from-white via-white/95 to-white/0 px-1 pb-1 pt-3 text-center text-[10px] font-semibold leading-tight text-[#0E1A3D] md:text-xs">
              {TILE_LABELS[category.slug] || category.name}
            </span>
          </Link>
        ))}
      </div>

        {/* Desktop: arrows on the sides of the row */}
        {page > 0 && (
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            aria-label="Previous categories"
            className="absolute -left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E1A3D] shadow-md ring-1 ring-black/5 transition hover:text-[#2C62E0] md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {page < pageCount - 1 && (
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            aria-label="More categories"
            className="absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E1A3D] shadow-md ring-1 ring-black/5 transition hover:text-[#2C62E0] md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-2 flex items-center justify-center">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Categories page ${index + 1}`}
                aria-current={index === page ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  index === page ? "w-5 bg-[#2C62E0]" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>

        </div>
      )}
    </section>
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
  const scrollRef = useRef(null);

  if (!products?.length) return null;

  const scrollProducts = (direction) => {
    const track = scrollRef.current;
    if (!track) return;

    const scrollAmount = track.clientWidth * 0.8;

    track.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className={background ? "bg-white" : ""}>
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-8">

        {/* Section heading */}
        <div className="mb-3 flex items-end justify-between gap-2 md:mb-5">
          <SectionTitle
            title={title}
            subtitle={subtitle}
          />

          <div className="flex shrink-0 items-center gap-3">

            {/* View all */}
            <Link
              to="/categories"
className="flex shrink-0 items-center gap-1 text-xs font-semibold sm:text-sm"        
      style={{ color: COLORS.blue }}
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Desktop carousel controls */}
            {products.length > 1 && (
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scrollProducts(-1)}
                  aria-label={`Previous ${title} products`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-[#2C62E0] hover:text-[#2C62E0]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollProducts(1)}
                  aria-label={`Next ${title} products`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-[#2C62E0] hover:text-[#2C62E0]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal product track */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id || product.slug}
  className="w-[calc((100vw-44px)/2)] min-w-0 shrink-0 snap-start sm:w-[240px] md:w-[250px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   STAT
========================================================= */

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div
        className="text-xl font-bold md:text-4xl"
        style={{ color: COLORS.white }}
      >
        {Number(value || 0).toLocaleString(
          "en-IN"
        )}
      </div>

      <div className="mt-0.5 text-xs text-white/55 md:mt-1 md:text-sm">
        {label}
      </div>
    </div>
  );
}