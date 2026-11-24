/**
 * Brand and price filters kept in the page address, so a filtered page can
 * be shared or reloaded: ?brand=aerofit,cockatoo&minPrice=5000&maxPrice=40000
 */
export function readListingFilters(searchParams) {
  const brands = (searchParams.get("brand") || "")
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);
  const number = (name) => {
    const value = searchParams.get(name);
    if (value === null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  return { brands, minPrice: number("minPrice"), maxPrice: number("maxPrice") };
}

/** Request parameters for the API (only the filters in use). */
export function listingFilterParams({ brands, minPrice, maxPrice }) {
  return {
    ...(brands.length ? { brand: brands.join(",") } : {}),
    ...(minPrice != null ? { minPrice } : {}),
    ...(maxPrice != null ? { maxPrice } : {}),
  };
}

/** A copy of the address parameters with the filters changed (page back to 1). */
export function withListingFilters(searchParams, changes) {
  const next = new URLSearchParams(searchParams);
  if ("brands" in changes) {
    if (changes.brands.length) next.set("brand", changes.brands.join(","));
    else next.delete("brand");
  }
  for (const name of ["minPrice", "maxPrice"]) {
    if (!(name in changes)) continue;
    if (changes[name] == null) next.delete(name);
    else next.set(name, String(changes[name]));
  }
  next.set("page", "1");
  return next;
}

export const activeFilterCount = ({ brands, minPrice, maxPrice }) =>
  brands.length + (minPrice != null || maxPrice != null ? 1 : 0);

export const rupees = (value) => `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
