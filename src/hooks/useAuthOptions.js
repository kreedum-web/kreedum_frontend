import { useQuery } from "@tanstack/react-query";

import { authService } from "@/api";

/** Sign-in methods the backend has set up. Google and phone stay hidden until they are. */
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
    // null (hidden) · "firebase" · "sms" (our own SMS provider)
    phoneProvider: query.data?.phone || null,
    firebaseConfig: query.data?.firebase || null,
    isLoading: query.isLoading,
  };
}
