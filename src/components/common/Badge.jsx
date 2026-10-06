import clsx from "clsx";
import { COLORS } from "@/config/theme";

const badgeStyles = {
  sale: "bg-red-50 text-red-600",
  bestseller: "bg-orange-50 text-orange-600",
  new: "bg-[#EAF0FF] text-[#2C62E0]",
  stock: "bg-gray-100 text-[#4B5568]",
};

export default function Badge({
  type = "sale",
  children,
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center",
        "rounded-full px-3 py-1",
        "text-xs font-semibold",
        "whitespace-nowrap"
      )}
      style={{
        fontFamily: '"Manrope", sans-serif',
        ...getBadgeStyle(type),
      }}
    >
      {children}
    </span>
  );
}

function getBadgeStyle(type) {
  const styles = {
    sale: {
      backgroundColor: "#FEF2F2",
      color: "#DC2626",
    },

    bestseller: {
      backgroundColor: "#FFF7ED",
      color: "#EA580C",
    },

    new: {
      backgroundColor: COLORS.tint,
      color: COLORS.blue,
    },

    stock: {
      backgroundColor: COLORS.paperDim,
      color: COLORS.slate,
    },
  };

  return styles[type] || styles.stock;
}