import { useQuery } from "@tanstack/react-query";

import { categoryService } from "@/api";

/**
 * Product field that holds a category of each level:
 *   level 1 (department)   -> product.department      e.g. "cardio"
 *   level 2 (category)     -> product.parentCategory  e.g. "treadmill"
 *   level 3 (sub-category) -> product.childCategory   e.g. "commercial-treadmill"
 */
export const CATEGORY_FIELD_BY_LEVEL = {
  1: "department",
  2: "parentCategory",
  3: "childCategory",
};

export const categoryUrl = (slug) => `/categories/${slug}`;
export const brandUrl = (slug) => `/brands/${slug}`;

/**
 * Turn the API tree into what the website needs:
 *  - tree:   only categories that have products, in the Metro Sports menu order
 *  - bySlug: slug -> { ...category, level, parentSlug, path: [ancestors…, self] }
 */
function buildCategoryIndex(categories = []) {
  const bySlug = new Map();

  const visit = (nodes, level, ancestors) =>
    nodes
      .filter((node) => (node.productCount ?? 0) > 0)
      .map((node) => {
        const path = [...ancestors, { name: node.name, slug: node.slug }];

        const entry = {
          _id: node._id,
          name: node.name,
          slug: node.slug,
          level: node.level || level,
          productCount: node.productCount ?? 0,
          image: node.image || "",
          parentSlug: ancestors.at(-1)?.slug || null,
          path,
        };

        entry.children = visit(node.children || [], level + 1, path);
        bySlug.set(entry.slug, entry);
        return entry;
      });

  return { tree: visit(categories, 1, []), bySlug };
}

const EMPTY = { tree: [], bySlug: new Map() };

/** Category tree for the menu, category pages, filters and breadcrumbs (cached for 10 min). */
export function useCategoryTree() {
  const query = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: () => categoryService.getCategoryTree(),
    select: (response) => buildCategoryIndex(response?.data?.categories || []),
    staleTime: 10 * 60 * 1000,
  });

  return {
    ...(query.data || EMPTY),
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Breadcrumb items for a product from its category fields, deepest first known category last.
 * Returns [{ label, to }] ready for InnerPageHeader.
 */
export function productCategoryTrail(product, bySlug) {
  if (!product) return [];

  const deepest = [product.childCategory, product.parentCategory, product.department]
    .filter(Boolean)
    .map((slug) => bySlug.get(slug))
    .find(Boolean);

  return (deepest?.path || []).map((item) => ({ label: item.name, to: categoryUrl(item.slug) }));
}
