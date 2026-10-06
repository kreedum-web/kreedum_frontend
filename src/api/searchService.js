import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const searchService = {
  searchProducts(keyword, filters = {}) {
    return api.get(API_ENDPOINTS.SEARCH, {
      params: {
        keyword,
        ...filters,
      },
    });
  },
};

export default searchService;