import clsx from "clsx";

export default function Input({
  label,
  error,
  className,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={clsx(
          "w-full rounded-xl border px-4 py-3 outline-none transition",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:border-[#2C62E0] focus:ring-2 focus:ring-blue-100",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}