import clsx from "clsx";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-[#2C62E0] text-white hover:bg-[#1F49B8] shadow-sm",

  secondary:
    "bg-[#0E1A3D] text-white hover:bg-[#16234A]",

  outline:
    "border border-[#2C62E0] text-[#2C62E0] hover:bg-blue-50",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  ghost:
    "text-gray-700 hover:bg-gray-100",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
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
      className={clsx(
        "rounded-xl font-semibold transition duration-200 flex items-center justify-center gap-2",
        variants[variant],
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