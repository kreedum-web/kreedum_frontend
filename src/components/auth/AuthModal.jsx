import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import logo from "@/assets/logo.png";
import { COLORS } from "@/config/theme";
import SignInFlow from "./SignInFlow";

/** Title, subtitle and the step's form, inside the popup card. */
function ModalFrame({ title, subtitle, children }) {
  return (
    <>
      <div className="mb-4 pr-8">
        <h2 id="auth-modal-title" className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: COLORS.navy }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-5" style={{ color: COLORS.slate }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </>
  );
}

/**
 * Sign-in / sign-up popup: the page behind is dimmed and blurred, like the
 * birthday popup. Closes with ✕, Esc or a click outside the card.
 */
export default function AuthModal({ initialIdentifier, onClose, onFinished }) {
  const cardRef = useRef(null);

  // Keep the page behind from scrolling while the popup is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="kr-fade-in fixed inset-0 z-[120] flex items-end justify-center bg-[#0E1A3D]/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{ fontFamily: '"Manrope", sans-serif' }}
    >
      <section
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="kr-pop-in relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pb-6 pt-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:px-7 sm:pb-7 sm:pt-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#0E1A3D]"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-8 object-contain" />
          <span className="text-base font-extrabold tracking-tight" style={{ color: COLORS.navy }}>
            Kreedum<span style={{ color: COLORS.blue }}>Sports</span>
          </span>
        </div>

        <SignInFlow Frame={ModalFrame} initialIdentifier={initialIdentifier} onFinished={onFinished} />

        <p className="mt-4 text-center text-xs leading-5" style={{ color: COLORS.slateLight }}>
          By continuing, you agree to our{" "}
          <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2C62E0]">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2C62E0]">
            Privacy Policy
          </a>
          .
        </p>
      </section>
    </div>
  );
}
