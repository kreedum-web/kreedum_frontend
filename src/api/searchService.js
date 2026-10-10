
import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const searchService = {
  searchProducts(params = {}) {
    return api.get(API_ENDPOINTS.SEARCH, {
      params,
    });
  },

  getSuggestions(query) {
    return api.get(`${API_ENDPOINTS.SEARCH}/suggestions`, {
      params: { q: query },
    });
  },

  getPopularSearches() {
    return api.get(`${API_ENDPOINTS.SEARCH}/popular`);
  },
};

export default searchService;
