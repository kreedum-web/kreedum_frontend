import { COLORS } from "@/config/theme";

/** The 6-digit one-time code box (phones offer the SMS code automatically). */
export default function CodeInput({ value, onChange, disabled, autoFocus = true, label = "6-digit code" }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="one-time-code" className="text-sm font-semibold" style={{ color: COLORS.navy }}>
        {label}
      </label>
      <input
        id="one-time-code"
        name="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="••••••"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
        disabled={disabled}
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:border-[#2C62E0] focus:outline-none focus:ring-2 focus:ring-[#EAF0FF]"
        style={{ color: COLORS.navy }}
      />
    </div>
  );
}
