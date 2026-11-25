
import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const wishlistService = {
  getWishlist() {
    return api.get(API_ENDPOINTS.WISHLIST);
  },

  addToWishlist(productId) {
    return api.post(`${API_ENDPOINTS.WISHLIST}/${productId}`);
  },

  removeFromWishlist(productId) {
    return api.delete(`${API_ENDPOINTS.WISHLIST}/${productId}`);
  },

  /** Ids of all products in the wishlist (one request for every card on a page). */
  getWishlistIds() {
    return api.get(`${API_ENDPOINTS.WISHLIST}/ids`);
  },

  checkWishlist(productId) {
    return api.get(
      `${API_ENDPOINTS.WISHLIST}/check/${productId}`
    );
  },

  getWishlistCount() {
    return api.get(`${API_ENDPOINTS.WISHLIST}/count`);
  },
};

export default wishlistService;
