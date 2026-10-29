import { Navigate, useSearchParams } from "react-router-dom";

/**
 * The old Shop page (/products) was replaced by categories and brands.
 * Old links and bookmarks still land somewhere sensible:
 *   /products?brand=aerofit  -> /brands/aerofit
 *   /products                -> /categories
 */
export default function ProductsRedirect() {
  const [searchParams] = useSearchParams();
  const brand = searchParams.get("brand");

  return <Navigate to={brand ? `/brands/${encodeURIComponent(brand)}` : "/categories"} replace />;
}
