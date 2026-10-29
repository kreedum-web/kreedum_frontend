/** Sort options understood by GET /products (see backend productQueryBuilder). */
export const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
  { label: "Highest Discount", value: "discount" },
  { label: "Most Popular", value: "popular" },
  { label: "Featured", value: "featured" },
];
