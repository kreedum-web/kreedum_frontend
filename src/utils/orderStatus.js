/** Customer-friendly names and colours for order and payment statuses. */
const LABELS = {
  AWAITING_PAYMENT: "Awaiting payment",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
  PAID: "Paid",
  FAILED: "Failed",
  REFUND_INITIATED: "Refund initiated",
  REFUNDED: "Refunded",
};

export const statusLabel = (status) =>
  LABELS[String(status || "").toUpperCase()] || String(status || "Unknown").replaceAll("_", " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());

export function statusClasses(status) {
  switch (String(status || "").toUpperCase()) {
    case "DELIVERED":
    case "PAID":
    case "REFUNDED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "CONFIRMED":
    case "PACKED":
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
    case "REFUND_INITIATED":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
    case "AWAITING_PAYMENT":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

/** "Cash on delivery", "Paid online (UPI)", "Online payment". */
export function paymentMethodLabel(order) {
  if (order?.paymentMethod === "COD") return "Cash on delivery";
  if (order?.paymentMethod === "ONLINE") {
    const method = order.payment?.method ? String(order.payment.method).replace(/_/g, " ").replace(/\bupi\b/i, "UPI") : "";
    return ["PAID", "REFUND_INITIATED", "REFUNDED"].includes(order.paymentStatus) ? `Paid online${method ? ` (${method})` : ""}` : "Online payment";
  }
  return order?.paymentMethod || "Not specified";
}
