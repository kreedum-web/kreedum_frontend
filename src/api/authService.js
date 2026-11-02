import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const authService = {
  // Which sign-in buttons to show: { googleClientId, emailCode, phone }
  getOptions() {
    return api.get(API_ENDPOINTS.AUTH.OPTIONS);
  },

  // Sign in / sign up with a code sent to the email (no password)
  startEmailLogin(payload) {
    return api.post(API_ENDPOINTS.AUTH.EMAIL_START, payload);
  },

  verifyEmailLogin(payload) {
    return api.post(API_ENDPOINTS.AUTH.EMAIL_VERIFY, payload);
  },

  // Continue with Google: { credential } from Google's button
  googleLogin(payload) {
    return api.post(API_ENDPOINTS.AUTH.GOOGLE, payload);
  },

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