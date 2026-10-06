import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const addressService = {
  lookupPincode(pincode) {
    return api.get(`${API_ENDPOINTS.ADDRESS.PINCODE}/${pincode}`);
  },

  getAddresses() {
    return api.get(API_ENDPOINTS.ADDRESS.SAVED);
  },

  createAddress(payload) {
    return api.post(API_ENDPOINTS.ADDRESS.SAVED, payload);
  },

  updateAddress(id, payload) {
    return api.patch(`${API_ENDPOINTS.ADDRESS.SAVED}/${id}`, payload);
  },

  deleteAddress(id) {
    return api.delete(`${API_ENDPOINTS.ADDRESS.SAVED}/${id}`);
  },

  setDefaultAddress(id) {
    return api.patch(`${API_ENDPOINTS.ADDRESS.SAVED}/${id}/default`);
  },
};

export default addressService;