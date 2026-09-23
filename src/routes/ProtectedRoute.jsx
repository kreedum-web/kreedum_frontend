import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}