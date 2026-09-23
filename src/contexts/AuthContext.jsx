import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("kreedum_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("kreedum_token", token);
    localStorage.setItem("kreedum_user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("kreedum_token");
    localStorage.removeItem("kreedum_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);