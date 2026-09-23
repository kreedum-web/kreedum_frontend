import clsx from "clsx";

const badgeStyles = {
  sale: "bg-red-100 text-red-600",
  bestseller: "bg-orange-100 text-orange-600",
  new: "bg-green-100 text-green-600",
  stock: "bg-gray-200 text-gray-700",
};

export default function Badge({ type = "sale", children }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold",
        badgeStyles[type]
      )}
    >
      {children}
    </span>
  );
}