import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import wishlistService from "@/api/wishlistService";

export const WISHLIST_IDS_KEY = ["wishlist", "ids"];

/**
 * Ids of the products in the signed-in customer's wishlist, fetched once and
 * shared by every product card and the product page (before: one request
 * per card). Adding / removing refreshes it through the ["wishlist"] key.
 */
export function useWishlistIds() {
  const { isAuthenticated } = useAuth();
  const query = useQuery({
    queryKey: WISHLIST_IDS_KEY,
    queryFn: async () => {
      const response = await wishlistService.getWishlistIds();
      return response?.data?.data?.productIds || [];
    },
    enabled: isAuthenticated,
    retry: false,
  });
  return useMemo(() => new Set(isAuthenticated ? query.data || [] : []), [isAuthenticated, query.data]);
}

/** Show a heart change straight away, before the server answers. */
export function setWishlisted(queryClient, productId, on) {
  queryClient.setQueryData(WISHLIST_IDS_KEY, (ids = []) =>
    on ? [...new Set([...ids, String(productId)])] : ids.filter((id) => id !== String(productId))
  );
}
