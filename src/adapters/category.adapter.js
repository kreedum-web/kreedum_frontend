export function normalizeCategory(category) {
  if (!category) return null;

  return {
    ...category,

    id: category._id,

    name: category.name || "",
    slug: category.slug || "",

    image: category.image || null,
    icon: category.icon || null,

    productCount: Number(category.productCount) || 0,
  };
}

export function normalizeCategories(categories) {
  if (!Array.isArray(categories)) return [];

  return categories
    .map(normalizeCategory)
    .filter(Boolean);
}