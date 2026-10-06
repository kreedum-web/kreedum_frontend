import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { COLORS } from "@/config/theme";

const variants = {
  primary: {
    backgroundColor: COLORS.blue,
    color: COLORS.white,
  },

  secondary: {
    backgroundColor: COLORS.navy,
    color: COLORS.white,
  },

  outline: {
    backgroundColor: COLORS.white,
    color: COLORS.blue,
    border: `1px solid ${COLORS.blue}`,
  },

  danger: {
    backgroundColor: "#DC2626",
    color: COLORS.white,
  },

  ghost: {
    backgroundColor: "transparent",
    color: COLORS.slate,
  },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  style,
  ...props
}) {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  return (
    <button
      disabled={loading}
      style={{
        ...variants[variant],
        fontFamily: '"Manrope", sans-serif',
        ...style,
      }}
      className={clsx(
        "rounded-lg font-semibold transition-all duration-200",
        "flex items-center justify-center gap-2",
        "active:scale-[0.98]",
        sizes[size],
        fullWidth && "w-full",
        loading && "opacity-80 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}