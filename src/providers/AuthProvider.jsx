import { useMemo, useState } from "react";
import AuthContext from "@/context/AuthContext";
import storage from "@/utils/storage";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(storage.getToken());
  const [loading, setLoading] = useState(false);

  const login = (userData, jwtToken) => {
    storage.setToken(jwtToken);

    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    storage.removeToken();

    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setLoading,
      setUser,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}