const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    PROFILE: "/auth/profile",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_CODE: "/auth/resend-code",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    OPTIONS: "/auth/options",
    EMAIL_START: "/auth/email/start",
    EMAIL_VERIFY: "/auth/email/verify",
    GOOGLE: "/auth/google",
    PHONE_FIREBASE: "/auth/phone/firebase",
    PHONE_START: "/auth/phone/start",
    PHONE_VERIFY: "/auth/phone/verify",
  },

  PRODUCTS: "/products",
  HOMEPAGE: "/homepage",
  SITE: "/site",
  SEARCH: "/search",
  CATEGORIES: "/categories",
  BRANDS: "/brands",
  WISHLIST: "/wishlist",
  CART: "/cart",

  ADDRESS: {
    PINCODE: "/address/pincode",
    SAVED: "/addresses",
  },

  ORDERS: "/orders",
  PROFILE: "/profile",
};

export default API_ENDPOINTS;