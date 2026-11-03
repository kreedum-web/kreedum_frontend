import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { authService } from "@/api";
import { SESSION_EXPIRED_EVENT } from "@/api/axios";

const AuthContext = createContext();

const TOKEN_KEY = "kreedum_token";
const USER_KEY = "kreedum_user";

// Data that belongs to the signed-in customer. Cleared when someone signs
// in or out, so the next person on this browser never sees it.
const PRIVATE_QUERIES = [
  "cart",
  "wishlist",
  "wishlist-status",
  "orders",
  "addresses",
  "account-profile",
  "account-dashboard",
  "me",
];

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUserState] = useState(() => (localStorage.getItem(TOKEN_KEY) ? readSavedUser() : null));
  // True while the saved sign-in is being checked with the server.
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const clearPrivateData = useCallback(() => {
    for (const key of PRIVATE_QUERIES) queryClient.removeQueries({ queryKey: [key] });
  }, [queryClient]);

  const setUser = useCallback((next) => {
    setUserState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      if (value) localStorage.setItem(USER_KEY, JSON.stringify(value));
      return value;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUserState(null);
    clearPrivateData();
  }, [clearPrivateData]);

  const login = useCallback(
    (jwtToken, userData) => {
      clearPrivateData();
      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(jwtToken);
      setUserState(userData);
    },
    [clearPrivateData]
  );

  /** Check the saved sign-in with the server and refresh the customer's details. */
  const restoreSession = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      const profile = response?.data?.data;
      if (profile) setUser(profile);
    } catch (error) {
      // 401 (expired / invalid) is handled by the session-expired event.
      // Offline or server asleep: keep the saved details for now.
      if (error?.response?.status !== 401) console.warn("Couldn't check the saved sign-in:", error?.message);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  // Once, when the site opens: check the saved sign-in (if any).
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    authService
      .getCurrentUser()
      .then((response) => {
        const profile = response?.data?.data;
        if (profile) setUser(profile);
      })
      .catch((error) => {
        // 401 (expired / invalid) is handled by the session-expired event.
        // Offline or server asleep: keep the saved details for now.
        if (error?.response?.status !== 401) console.warn("Couldn't check the saved sign-in:", error?.message);
      })
      .finally(() => setLoading(false));
  }, [setUser]);

  // Any request answered "not signed in" (expired after 7 days, signed out
  // elsewhere): sign out here quietly. Pages that need an account send the
  // customer to sign in; others just keep working.
  useEffect(() => {
    const onExpired = () => logout();
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      restoreSession,
      setUser,
      isAuthenticated: Boolean(token),
    }),
    [user, token, loading, login, logout, restoreSession, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
