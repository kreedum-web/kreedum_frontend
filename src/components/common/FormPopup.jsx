import { useEffect } from "react";
import { X } from "lucide-react";

import logo from "@/assets/logo.png";
import { COLORS } from "@/config/theme";
import { tenDigits } from "@/utils/phone";

/**
 * Popup card for short forms, the same look as the sign-in popup: the page
 * behind is dimmed and blurred; on phones it slides up from the bottom, on
 * desktop it sits in the middle. Closes with ✕, Esc or a click outside.
 *
 *   <FormPopup eyebrow="Get a quote" title="Get a price for your gym" subtitle="…" onClose={…}>
 *     …form…
 *   </FormPopup>
 */
export default function FormPopup({ eyebrow, title, subtitle, onClose, children, labelId = "form-popup-title" }) {
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
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
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

        {(eyebrow || title) && (
          <div className="mb-4 pr-8">
            {eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: COLORS.blue }}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 id={labelId} className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: COLORS.navy }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1.5 text-sm leading-5" style={{ color: COLORS.slate }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </section>
    </div>
  );
}

// Shared styles for the popup forms (16px text on phones so iPhones don't zoom in).
export const POPUP_INPUT =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-[#0E1A3D] outline-none transition placeholder:text-slate-400 focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100 sm:text-sm";
export const POPUP_LABEL = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#0E1A3D]";

export function PopupFieldError({ message }) {
  return message ? <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p> : null;
}

/** Tap-to-choose buttons (one choice). options: [{ label, value }] */
export function ChoiceChips({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? "" : option.value)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              active
                ? "border-[#2C62E0] bg-[#EAF0FF] text-[#1F49B8]"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#2C62E0] hover:text-[#0E1A3D]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** "+91" box joined to a 10-digit number field. */
export function PhoneField({ id, value, onChange, error }) {
  return (
    <div className={`flex overflow-hidden rounded-xl border bg-white transition focus-within:border-[#2C62E0] focus-within:ring-4 focus-within:ring-blue-100 ${error ? "border-red-400" : "border-slate-200"}`}>
      <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-base font-semibold text-[#0E1A3D] sm:text-sm">+91</span>
      <input
        id={id}
        name="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="10-digit mobile number"
        value={value}
        onChange={(event) => onChange(tenDigits(event.target.value))}
        className="w-full px-4 py-3 text-base text-[#0E1A3D] outline-none placeholder:text-slate-400 sm:text-sm"
      />
    </div>
  );
}
