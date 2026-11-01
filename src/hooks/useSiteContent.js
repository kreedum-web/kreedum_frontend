import { useQuery } from "@tanstack/react-query";

import { siteService } from "@/api";

/**
 * Announcements, leaders and clients from the backend (GET /site).
 * Each is null until set up in the database, or while loading / offline:
 * callers then show their built-in content.
 */
export function useSiteContent() {
  const query = useQuery({
    queryKey: ["site-content"],
    queryFn: () => siteService.getSiteContent(),
    select: (response) => response?.data?.data || {},
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const data = query.data || {};
  return {
    announcements: Array.isArray(data.announcements) ? data.announcements : null,
    leaders: Array.isArray(data.leaders) ? data.leaders : null,
    clients: Array.isArray(data.clients) ? data.clients : null,
    isLoading: query.isLoading,
  };
}
