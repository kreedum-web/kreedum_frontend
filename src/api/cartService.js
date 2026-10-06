import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const cartService = {
  getCart() {
    return api.get(API_ENDPOINTS.CART);
  },

  addToCart(productId, quantity = 1) {
    return api.post(API_ENDPOINTS.CART, {
      productId,
      quantity,
    });
  },

  updateCartItem(cartItemId, quantity) {
    return api.patch(`${API_ENDPOINTS.CART}/${cartItemId}`, {
      quantity,
    });
  },

  removeCartItem(cartItemId) {
    return api.delete(`${API_ENDPOINTS.CART}/${cartItemId}`);
  },

  clearCart() {
    return api.delete(`${API_ENDPOINTS.CART}/clear`);
  },
};

export default cartService;