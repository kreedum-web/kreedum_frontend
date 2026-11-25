import { statusLabel, paymentMethodLabel } from "./orderStatus";

const longDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

/**
 * The WhatsApp message for help with an order (floating button and the
 * order page's "Need help with this order?"), so the team sees which order.
 */
export function orderSupportMessage(order) {
  if (!order) return null;
  const items = Array.isArray(order.items) ? order.items : [];
  return [
    "Hi Kreedum Sports Support, I need help with my order.",
    "",
    `Customer: ${order.shippingAddress?.fullName || "Customer"}`,
    `Order number: ${order.orderNumber || order._id}`,
    `Status: ${statusLabel(order.orderStatus)}`,
    `Item(s): ${items.map((item) => (item.quantity > 1 ? `${item.name} x ${item.quantity}` : item.name)).filter(Boolean).join(", ") || "Order details"}`,
    `Order date: ${longDate(order.createdAt)}`,
    `Payment: ${paymentMethodLabel(order) || order.paymentMethod || "Not specified"}`,
    `Order total: ₹${(Number(order.pricing?.total) || 0).toLocaleString("en-IN")}`,
    "",
    "Please assist me with this order. Thank you.",
  ].join("\n");
}
