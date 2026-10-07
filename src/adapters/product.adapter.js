export function normalizeProduct(product) {
  if (!product) return null;

  return {
    ...product,

    // Identity
    id: product._id,
    slug: product.slug,

    // Basic information
    name: product.name || "",
    brand: product.brand || "Unknown",

    // Pricing
    price: Number(product.sellingPrice) || 0,
    originalPrice: Number(product.mrp) || 0,
    discount: Number(product.discountPercent) || 0,

    // Images
    image:
      product.thumbnail ||
      product.images?.[0] ||
      "",

    images: Array.isArray(product.images)
      ? product.images
      : [],

    // Stock
    inStock: product.stockStatus === "in_stock",
    stockStatus: product.stockStatus || "",

    // Product information
    sku: product.sku || "",
    description: product.descriptionText || "",
    features: Array.isArray(product.features)
      ? product.features
      : [],

    // Category
    parentCategory: product.parentCategory || "",
    childCategory: product.childCategory || "",

    // Backend metadata
    availabilityMessage:
      product.availabilityMessage || "",
  };
}

export function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];

  return products
    .map(normalizeProduct)
    .filter(Boolean);
}