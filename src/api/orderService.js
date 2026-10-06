import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const orderService = {
  placeOrder(payload) {
    return api.post(API_ENDPOINTS.ORDERS, payload);
  },

  getOrders() {
    return api.get(API_ENDPOINTS.ORDERS);
  },

  getOrderDetails(id) {
    return api.get(`${API_ENDPOINTS.ORDERS}/${id}`);
  },

  cancelOrder(id) {
    return api.patch(`${API_ENDPOINTS.ORDERS}/${id}/cancel`);
  },
};

export default orderService;