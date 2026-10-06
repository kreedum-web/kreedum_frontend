import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const profileService = {
  getProfile() {
    return api.get(API_ENDPOINTS.PROFILE);
  },

  updateProfile(payload) {
    return api.patch(API_ENDPOINTS.PROFILE, payload);
  },

  changePassword(payload) {
    return api.patch(`${API_ENDPOINTS.PROFILE}/change-password`, payload);
  },
};

export default profileService;