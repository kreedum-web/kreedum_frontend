import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { COLORS } from "@/config/theme";

/** Password box with a show / hide button. */
export default function PasswordInput({ id, label, value, onChange, autoComplete = "current-password", placeholder, disabled, autoFocus }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: COLORS.navy }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          autoFocus={autoFocus}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-12 text-sm transition-all focus:border-[#2C62E0] focus:outline-none focus:ring-2 focus:ring-[#EAF0FF] sm:px-4 sm:py-3 sm:text-base"
          style={{ fontFamily: '"Manrope", sans-serif', color: COLORS.navy }}
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={disabled}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg hover:bg-[#EAF0FF]"
          style={{ color: COLORS.slate }}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
