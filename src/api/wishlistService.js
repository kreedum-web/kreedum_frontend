
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
