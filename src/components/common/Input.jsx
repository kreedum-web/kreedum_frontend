import clsx from "clsx";
import { COLORS } from "@/config/theme";

export default function Input({
  label,
  error,
  className,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          className="text-sm font-semibold"
          style={{ color: COLORS.navy }}
        >
          {label}
        </label>
      )}

      <input
        className={clsx(
          "w-full rounded-lg border px-3 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base",
          "transition-all duration-200",
          "bg-white",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-[#2C62E0] focus:ring-2 focus:ring-[#EAF0FF]",
          className
        )}
        style={{
          fontFamily: '"Manrope", sans-serif',
        }}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}