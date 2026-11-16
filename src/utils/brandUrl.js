/** Same as the backend's brand slugs (src/utils/generateSlug.js): "Vector X" → "vector-x". */
export function brandSlug(name = "") {
  return String(name)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[()'"`]/g, "")
    .replace(/[\\/]/g, "-")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The brand page of a product's brand, e.g. /brands/xpeed ("" when it has no brand). */
export function brandUrl(product) {
  const name = typeof product?.brand === "string" ? product.brand : product?.brand?.name || "";
  const slug = product?.brandSlug || product?.brand?.slug || brandSlug(name);
  return slug && slug !== "unknown" ? `/brands/${slug}` : "";
}
