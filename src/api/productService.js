import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const productService = {
  getProducts(params = {}) {
    return api.get(API_ENDPOINTS.PRODUCTS, {
      params,
    });
  },

  getProductBySlug(slug) {
    return api.get(`${API_ENDPOINTS.PRODUCTS}/${slug}`);
  },
};

export default productService;