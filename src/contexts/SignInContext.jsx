import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthModal from "@/components/auth/AuthModal";

const SignInContext = createContext({ openSignIn: () => {}, closeSignIn: () => {} });

/**
 * The sign-in / sign-up popup, opened from anywhere:
 *
 *   const { openSignIn } = useSignIn();
 *   openSignIn();                              // stay on this page afterwards
 *   openSignIn({ redirectTo: "/checkout" });   // go there once signed in
 *   openSignIn({ onSuccess: () => … });        // run something once signed in
 *
 * The page behind stays where it is (blurred) while the popup is open.
 */
export function SignInProvider({ children }) {
  const navigate = useNavigate();
  const [request, setRequest] = useState(null); // { redirectTo, identifier, key }
  const onSuccess = useRef(null);

  const openSignIn = useCallback((options = {}) => {
    onSuccess.current = options.onSuccess || null;
    setRequest((current) =>
      current || { redirectTo: options.redirectTo || "", identifier: options.identifier || "", key: Date.now() }
    );
  }, []);

  const closeSignIn = useCallback(() => {
    onSuccess.current = null;
    setRequest(null);
  }, []);

  const finished = useCallback(() => {
    const next = request?.redirectTo;
    const callback = onSuccess.current;
    onSuccess.current = null;
    setRequest(null);
    if (next) navigate(next, { replace: true });
    callback?.();
  }, [navigate, request]);

  const value = useMemo(() => ({ openSignIn, closeSignIn, isOpen: Boolean(request) }), [openSignIn, closeSignIn, request]);

  return (
    <SignInContext.Provider value={value}>
      {children}
      {request && (
        <AuthModal key={request.key} initialIdentifier={request.identifier} onClose={closeSignIn} onFinished={finished} />
      )}
    </SignInContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSignIn = () => useContext(SignInContext);
