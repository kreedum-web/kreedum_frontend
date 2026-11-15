import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { useSignIn } from "@/contexts/SignInContext";
import { afterLoginPath } from "@/utils/afterLogin";

/**
 * Old links to /login, /register and /forgot-password: go to the home page
 * (or the page they asked for) and open the sign-in popup there.
 */
export default function SignInRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useSignIn();
  const target = afterLoginPath(location);

  useEffect(() => {
    if (!isAuthenticated) {
      openSignIn({ identifier: location.state?.identifier || location.state?.email || "" });
    }
  }, [isAuthenticated, openSignIn, location.state]);

  return <Navigate to={target} replace />;
}
