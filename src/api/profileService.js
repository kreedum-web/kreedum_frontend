
import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const profileService = {
  getProfile() {
    return api.get(API_ENDPOINTS.PROFILE);
  },

  getDashboard() {
    return api.get(`${API_ENDPOINTS.PROFILE}/dashboard`);
  },

  updateProfile(payload) {
    return api.patch(API_ENDPOINTS.PROFILE, payload);
  },

  changePassword(payload) {
    return api.patch(`${API_ENDPOINTS.PROFILE}/password`, payload);
  },
};

export default profileService;
