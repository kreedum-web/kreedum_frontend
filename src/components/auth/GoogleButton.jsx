import { useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let scriptPromise;

/** Load Google's sign-in script once. */
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = undefined;
        reject(new Error("Couldn't load Google sign-in."));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * Google's own "Continue with Google" button. When the customer picks an
 * account, onCredential(idToken) is called; the backend checks the token.
 */
export default function GoogleButton({ clientId, onCredential, onError, disabled = false }) {
  const holder = useRef(null);
  const callback = useRef(onCredential);
  const [failed, setFailed] = useState(false);

  // Always call the latest handler without re-drawing Google's button.
  useEffect(() => {
    callback.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId) return undefined;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !holder.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => callback.current?.(response.credential),
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        // Google draws the button at a fixed pixel width (max 400).
        const width = Math.min(400, Math.max(200, Math.floor(holder.current.offsetWidth || 320)));
        holder.current.innerHTML = "";
        window.google.accounts.id.renderButton(holder.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "center",
          width,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setFailed(true);
        onError?.(error.message);
      });

    return () => {
      cancelled = true;
    };
    // onError is only for reporting; re-rendering the button for it isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (!clientId || failed) return null;

  return (
    <div
      className={`flex min-h-11 w-full justify-center ${disabled ? "pointer-events-none opacity-60" : ""}`}
      aria-busy={disabled}
    >
      <div ref={holder} className="w-full max-w-[400px] [&>div]:mx-auto" />
    </div>
  );
}
