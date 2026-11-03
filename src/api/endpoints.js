const API_ENDPOINTS = {
  AUTH: {
    OPTIONS: "/auth/options",
    IDENTIFY: "/auth/identify",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_CODE: "/auth/resend-code",
    REGISTER_PHONE: "/auth/register-phone",
    PHONE_START: "/auth/phone/start",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    RESET_PASSWORD_PHONE: "/auth/reset-password-phone",
    GOOGLE: "/auth/google",
    ME: "/auth/me",
    PROFILE: "/auth/profile",
    PASSWORD: "/auth/password",
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