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

  // 6-digit codes sent by email (sign-up and forgot password)
  verifyEmail(payload) {
    return api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
  },

  resendCode(payload) {
    return api.post(API_ENDPOINTS.AUTH.RESEND_CODE, payload);
  },

  forgotPassword(payload) {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  },

  resetPassword(payload) {
    return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  },
};

export default authService;