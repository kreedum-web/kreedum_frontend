import { Navigate, useLocation } from "react-router-dom";

/**
 * "Forgot password" is part of the sign-in page now (enter your email or
 * number → Forgot password?). Old links to /forgot-password land there.
 */
export default function ForgotPasswordPage() {
  const location = useLocation();
  return <Navigate to="/login" replace state={location.state} />;
}
