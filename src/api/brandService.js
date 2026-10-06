import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const brandService = {
  getBrands() {
    return api.get(API_ENDPOINTS.BRANDS);
  },

  getBrandProducts(slug, params = {}) {
    return api.get(`${API_ENDPOINTS.BRANDS}/${slug}`, {
      params,
    });
  },
};

export default brandService;