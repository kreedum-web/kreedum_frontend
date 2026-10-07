import { normalizeProducts } from "./product.adapter";
import { normalizeCategories } from "./category.adapter";
import { normalizeBrands } from "./brand.adapter";

export function normalizeHeroBanner(banner) {
  if (!banner) return null;

  return {
    ...banner,

    id: banner.id,
    title: banner.title || "",
    subtitle: banner.subtitle || "",
    image: banner.image || "",
    buttonText: banner.buttonText || "",
    buttonLink: banner.buttonLink || "",
  };
}

export function normalizeHomepage(data) {
  if (!data) {
    return {
      heroBanners: [],
      categories: [],
      featuredProducts: [],
      bestSellers: [],
      newArrivals: [],
      trendingProducts: [],
      deals: [],
      popularBrands: [],
      stats: {},
    };
  }

  return {
    heroBanners: Array.isArray(data.heroBanners)
      ? data.heroBanners
          .map(normalizeHeroBanner)
          .filter(Boolean)
      : [],

    categories: normalizeCategories(data.categories),

    featuredProducts: normalizeProducts(
      data.featuredProducts
    ),

    bestSellers: normalizeProducts(
      data.bestSellers
    ),

    newArrivals: normalizeProducts(
      data.newArrivals
    ),

    trendingProducts: normalizeProducts(
      data.trendingProducts
    ),

    deals: normalizeProducts(
      data.deals
    ),

    popularBrands: normalizeBrands(
      data.popularBrands
    ),

    stats: data.stats || {},
  };
}