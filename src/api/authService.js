import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const authService = {
  register(payload) {
    return api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  login(payload) {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  },

  getCurrentUser() {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },

  updateProfile(payload) {
    return api.put(API_ENDPOINTS.AUTH.PROFILE, payload);
  },
};

export default authService;