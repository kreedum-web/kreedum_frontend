import api from "./axios";
import API_ENDPOINTS from "./endpoints";

/**
 * Cart lines are one product + one option (weight, size …). `variantId` is
 * the chosen option for products that have options, "" otherwise.
 */
const cartService = {
  getCart() {
    return api.get(API_ENDPOINTS.CART);
  },

  addToCart(productId, quantity = 1, variantId = "") {
    return api.post(`${API_ENDPOINTS.CART}/${productId}`, {
      quantity,
      ...(variantId ? { variantId } : {}),
    });
  },

  updateCartItem(productId, quantity, variantId = "") {
    return api.patch(`${API_ENDPOINTS.CART}/${productId}`, {
      quantity,
      ...(variantId ? { variantId } : {}),
    });
  },

  removeCartItem(productId, variantId = "") {
    return api.delete(`${API_ENDPOINTS.CART}/${productId}`, {
      params: variantId ? { variant: variantId } : undefined,
    });
  },

  clearCart() {
    return api.delete(API_ENDPOINTS.CART);
  },
};

export default cartService;
