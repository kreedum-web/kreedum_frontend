import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const A = API_ENDPOINTS.AUTH;

/**
 * Accounts sign in with the email or mobile number they signed up with + a
 * password (or Google). A one-time code is only sent to create an account or
 * to set / reset a password.
 */
const authService = {
  // Which options to show: { googleClientId, phone: null | "firebase" | "sms", firebase }
  getOptions: () => api.get(A.OPTIONS),

  // { identifier } → { type: "email" | "phone", value, exists, hasPassword }
  identify: (payload) => api.post(A.IDENTIFY, payload),

  // { identifier, password }
  login: (payload) => api.post(A.LOGIN, payload),

  // Email sign-up: { email, password } emails a code; verifyEmail({ email, code }) finishes it.
  register: (payload) => api.post(A.REGISTER, payload),
  verifyEmail: (payload) => api.post(A.VERIFY_EMAIL, payload),
  resendCode: (payload) => api.post(A.RESEND_CODE, payload),

  // Phone sign-up after the SMS code: { idToken, password } (Firebase) or { phone, code, password }.
  registerPhone: (payload) => api.post(A.REGISTER_PHONE, payload),
  // Own SMS provider only (Firebase sends its own SMS from the website).
  startPhoneCode: (payload) => api.post(A.PHONE_START, payload),

  // Forgot / set password by email: { email } then { email, code, password }.
  forgotPassword: (payload) => api.post(A.FORGOT_PASSWORD, payload),
  resetPassword: (payload) => api.post(A.RESET_PASSWORD, payload),
  // By phone, after the SMS code: { idToken | phone+code, password }.
  resetPasswordWithPhone: (payload) => api.post(A.RESET_PASSWORD_PHONE, payload),

  // Continue with Google: { credential } from Google's button.
  googleLogin: (payload) => api.post(A.GOOGLE, payload),

  getCurrentUser: () => api.get(A.ME),
  updateProfile: (payload) => api.put(A.PROFILE, payload),
  // { currentPassword?, newPassword, confirmPassword? }
  changePassword: (payload) => api.put(A.PASSWORD, payload),
};

export default authService;
