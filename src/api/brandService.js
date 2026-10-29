import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const brandService = {
  /** All brands with product counts and an image. */
  getBrands() {
    return api.get(API_ENDPOINTS.BRANDS);
  },

  /** One brand, with the departments / categories it has products in. */
  getBrand(slug) {
    return api.get(`${API_ENDPOINTS.BRANDS}/${slug}`);
  },

  getBrandProducts(slug, params = {}) {
    return api.get(`${API_ENDPOINTS.BRANDS}/${slug}/products`, {
      params,
    });
  },
};

export default brandService;
