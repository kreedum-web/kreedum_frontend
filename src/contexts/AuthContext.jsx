import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { authService } from "@/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("kreedum_token"));

  useEffect(() => {
    restoreSession();
  }, []);

const restoreSession = async () => {
  setLoading(true);

  const savedToken = localStorage.getItem("kreedum_token");
  const savedUser = localStorage.getItem("kreedum_user");

  if (!savedToken || !savedUser) {
    setLoading(false);
    return;
  }

  try {
    // Temporary QA mode (before real login API)
    setToken(savedToken);
    setUser(JSON.parse(savedUser));
  } catch (error) {
    console.error("Failed to restore session", error);

    localStorage.removeItem("kreedum_token");
    localStorage.removeItem("kreedum_user");
    setUser(null);
    setToken(null);
  } finally {
    setLoading(false);
  }
};

  const login = (jwtToken, userData) => {
    localStorage.setItem("kreedum_token", jwtToken);
    localStorage.setItem("kreedum_user", JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("kreedum_token");
    localStorage.removeItem("kreedum_user");

    setToken(null);
    setUser(null);
  };

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
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);