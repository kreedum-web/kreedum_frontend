import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,

  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kreedum_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR

/** Fired when the server says the saved sign-in is no longer valid. */
export const SESSION_EXPIRED_EVENT = "kreedum:session-expired";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // Sign-in screens handle their own errors (e.g. "Wrong password" is a 401).
    // Only /auth/me and the rest of the site mean "your sign-in has expired".
    const isSignInRequest = /\/auth\//.test(requestUrl) && !/\/auth\/me(?:\?|$)/.test(requestUrl);
    const hadSession = Boolean(error.config?.headers?.Authorization);

    if (status === 401 && !isSignInRequest && hadSession) {
      localStorage.removeItem("kreedum_token");
      localStorage.removeItem("kreedum_user");
      // AuthContext signs out quietly; pages that need an account send the
      // customer to sign in, everything else keeps working.
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    if (status === 500) console.error("Internal Server Error");

    return Promise.reject(error);
  }
);

export default api;