import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const productService = {
  getProducts(params = {}) {
    return api.get(API_ENDPOINTS.PRODUCTS, { params });
  },

  getProductBySlug(slug) {
    return api.get(`${API_ENDPOINTS.PRODUCTS}/${slug}`);
  },

  getFeaturedProducts() {
    return api.get(`${API_ENDPOINTS.PRODUCTS}/featured`);
  },

  getBestSellers() {
    return api.get(`${API_ENDPOINTS.PRODUCTS}/best-sellers`);
  },

  getNewArrivals() {
    return api.get(`${API_ENDPOINTS.PRODUCTS}/new-arrivals`);
  },

  getRelatedProducts(slug) {
    return api.get(`${API_ENDPOINTS.PRODUCTS}/${slug}/related`);
  },
};

export default productService;