import { useQuery, } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef,useState } from "react";
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
import homepageTestimonials from "@/data/homepageTestimonials";
import homepageClients from "@/data/homepageClients";


const HERO_FALLBACK_IMAGES = [
  "/images/home-hero/aerofit-gym.jpg",
  "/images/home-hero/home-gym-setup.jpg",
  "/images/home-hero/sports-courts.jpg",
];


  
function TestimonialsSection() {
const trackRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);


  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 25; // pixels per secondF

    const animate = (time) => {
      if (lastTimeRef.current !== null && !isPaused) {
        const delta = time - lastTimeRef.current;

        track.scrollLeft += (speed * delta) / 1000;

        // Loop smoothly back to the start
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }

      lastTimeRef.current = time;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPaused]);

  return (
    <section className="relative overflow-hidden bg-[#F6F8FC] py-10 md:py-14">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center md:mb-12">
          

          
<div className="mb-7 text-center md:mb-9">
  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2C62E0]">
    What Our Customers Say
  </p>

  <h2 className="text-2xl font-bold text-[#0E1A3D] sm:text-3xl">
    Trusted by Customers
  </h2>

  <p className="mt-2 text-sm text-gray-500">
    Real experiences from people who choose Kreedum for sports and fitness.
  </p>
</div>

        </div>

        <div
          ref={trackRef}
          className="testimonials-track flex gap-4 overflow-x-auto pb-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onWheel={() => setIsPaused(true)}
        >
          {/* Duplicate cards for seamless looping */}
          {[...homepageTestimonials, ...homepageTestimonials].map(
            (testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="flex w-[82vw] max-w-[300px] shrink-0 flex-col rounded-xl border border-white bg-white p-5 shadow-[0_8px_28px_rgba(14,26,61,0.07)] sm:w-[280px]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-3xl font-bold leading-none text-[#2C62E0]/25">
                    &ldquo;
                  </span>

                  <div
                    className="flex gap-0.5 text-sm text-[#F59E0B]"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < testimonial.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mb-5 text-sm leading-6 text-[#4B5568]">
                  {testimonial.review}
                </p>

                <div className="mt-auto border-t border-gray-100 pt-3">
                  <h3 className="text-sm font-semibold text-[#0E1A3D]">
                    {testimonial.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400">Customer</p>
                </div>
              </article>
            )
          )}
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
    <section className="overflow-hidden border-y border-gray-100 bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-7 text-center md:mb-9">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2C62E0]">
            Our Trusted Partners
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A3D] sm:text-3xl">
            Trusted By Our Clients
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Supporting institutions and organizations with quality sports infrastructure.
          </p>
        </div>

        <div
          ref={trackRef}
          className="clients-track flex items-center gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onWheel={() => setIsPaused(true)}
          aria-label="Our clients"
        >
          {clients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-[#F8FAFD] px-4 py-3 transition duration-300 hover:-translate-y-1 hover:border-[#DCE6FF] hover:bg-white hover:shadow-md sm:h-28 sm:w-44"
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
      {/* =====================================================
          HERO
      ====================================================== */}
      {currentBanner && (
<section
  className="relative min-h-[440px] sm:min-h-[520px] md:min-h-[680px] overflow-hidden bg-[#0E1A3D] touch-pan-y"
  onTouchStart={handleHeroTouchStart}
  onTouchEnd={handleHeroTouchEnd}
>      {currentBanner.image && (
            <img
                src={
    !heroImageFailed && currentBanner?.image
      ? resolveImageUrl(currentBanner.image)
      : HERO_FALLBACK_IMAGES[
          activeBanner % HERO_FALLBACK_IMAGES.length
        ]
  }
              alt={currentBanner?.title || "Kreedum Sports fitness equipment"}
  className="absolute inset-0 h-full w-full object-cover"
  onError={() => {
    if (!heroImageFailed) {
      setHeroImageFailed(true);
    }
  }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A3D]/95 via-[#0E1A3D]/70 to-[#0E1A3D]/20" />

<div className="relative mx-auto max-w-7xl px-5 pt-36 pb-20 sm:px-6 sm:pt-36 sm:pb-24 md:pt-44 md:pb-32">
     <div className="max-w-3xl">
              {/* <Badge type="new">
                KREEDUM SPORTS
              </Badge> */}

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
className="hidden md:flex absolute left-5 md:left-8 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition"            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Next */}
          {heroBanners.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next banner"
className="hidden md:flex absolute right-5 md:right-8 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition"            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Indicators */}
          {heroBanners.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
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



<TestimonialsSection />
<ClientsSection />

 

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      {/* {categories.length > 0 && (
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
      )} */}

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
      {/* {popularBrands.length > 0 && (
        <section className="bg-white border-y border-gray-100">
<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">   
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
      )} */}

      {/* =====================================================
          STATS
      ====================================================== */}
      {stats && (
       <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10">

        {/* Section heading */}
        <div className="mb-4 flex items-end justify-between gap-2 md:mb-8">
          <SectionTitle
            title={title}
            subtitle={subtitle}
          />

          <div className="flex shrink-0 items-center gap-3">

            {/* View all */}
            <Link
              to="/products"
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
              className="w-[68vw] max-w-[250px] shrink-0 snap-start sm:w-[240px] md:w-[250px]"
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