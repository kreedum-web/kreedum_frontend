export function normalizeBrand(brand) {
  if (!brand) return null;

  return {
    ...brand,

    id: brand._id,

    name: brand.name || "",
    slug: brand.slug || "",

    logo: brand.logo || null,
    image: brand.image || null,

    productCount: Number(brand.productCount) || 0,
  };
}

export function normalizeBrands(brands) {
  if (!Array.isArray(brands)) return [];

  return brands
    .map(normalizeBrand)
    .filter(Boolean);
}