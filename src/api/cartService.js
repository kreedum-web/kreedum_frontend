import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const cartService = {
  getCart() {
    return api.get(API_ENDPOINTS.CART);
  },

  addToCart(productId, quantity = 1) {
    return api.post(
      `${API_ENDPOINTS.CART}/${productId}`,
      {
        quantity,
      }
    );
  },

  updateCartItem(productId, quantity) {
    return api.patch(
      `${API_ENDPOINTS.CART}/${productId}`,
      {
        quantity,
      }
    );
  },

  removeCartItem(productId) {
    return api.delete(
      `${API_ENDPOINTS.CART}/${productId}`
    );
  },

  clearCart() {
    return api.delete(
      API_ENDPOINTS.CART
    );
  },
};

export default cartService;