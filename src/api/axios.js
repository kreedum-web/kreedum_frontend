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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // A failed login should be handled by LoginForm.
    // Do not clear credentials or reload the page.
    const isLoginRequest = /\/auth\/login(?:\?|$)/.test(requestUrl);

    if (status === 401 && isLoginRequest) {
      return Promise.reject(error);
    }

    if (status === 401) {
      const hasSavedSession =
        Boolean(localStorage.getItem("kreedum_token")) ||
        Boolean(localStorage.getItem("kreedum_user"));

      localStorage.removeItem("kreedum_token");
      localStorage.removeItem("kreedum_user");

      if (hasSavedSession && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.error("Access Forbidden");
    } else if (status === 404) {
      console.error("API Not Found");
    } else if (status === 500) {
      console.error("Internal Server Error");
    }

    return Promise.reject(error);
  }
);


export default api;