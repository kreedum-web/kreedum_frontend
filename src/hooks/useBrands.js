import { useQuery } from "@tanstack/react-query";

import { brandService } from "@/api";

/** Brands that have products on the website, A–Z (cached for 10 min). */
export function useBrands() {
  const query = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.getBrands(),
    staleTime: 10 * 60 * 1000,
    select: (response) =>
      (response?.data?.brands || []).filter(
        (brand) => brand.isActive !== false && (brand.productCount ?? 0) > 0
      ),
  });

  return {
    brands: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
