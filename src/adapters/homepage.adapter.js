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

// Rows of an older server without `sections`: the five fixed rows.
const OLD_ROWS = [
  ["featured", "featuredProducts", "Featured Products", "Hand-picked products from Kreedum."],
  ["bestsellers", "bestSellers", "Best Sellers", "Products customers are buying the most."],
  ["new-arrivals", "newArrivals", "New Arrivals", "Fresh products added to the store."],
  ["trending", "trendingProducts", "Trending Now", "Popular products worth checking out."],
  ["deals", "deals", "Today's Deals", "Grab the best available discounts."],
];

/** The home page's product rows, in the order set in the admin. */
function normalizeSections(data) {
  const rows = Array.isArray(data.sections)
    ? data.sections
    : OLD_ROWS.map(([key, field, title, subtitle]) => ({ key, title, subtitle, products: data[field] }));
  return rows
    .map((row) => ({
      key: row.key || row.id,
      title: row.title || "",
      subtitle: row.subtitle || "",
      viewAll: row.viewAll || "",
      products: normalizeProducts(row.products),
    }))
    .filter((row) => row.products.length);
}

export function normalizeHomepage(data) {
  if (!data) {
    return {
      heroBanners: [],
      categories: [],
      sections: [],
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

    sections: normalizeSections(data),

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