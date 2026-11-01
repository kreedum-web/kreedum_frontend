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