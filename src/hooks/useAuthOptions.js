import { useQuery } from "@tanstack/react-query";

import { authService } from "@/api";

/** Sign-in methods the backend has set up. Google stays hidden until it is. */
export function useAuthOptions() {
  const query = useQuery({
    queryKey: ["auth-options"],
    queryFn: () => authService.getOptions(),
    select: (response) => response?.data?.data || {},
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
  return {
    googleClientId: query.data?.googleClientId || null,
    isLoading: query.isLoading,
  };
}
