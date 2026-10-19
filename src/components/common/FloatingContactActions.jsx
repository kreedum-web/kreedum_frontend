
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Phone } from "lucide-react";
import { useMatch } from "react-router-dom";

import { orderService, productService } from "@/api";
import { COLORS } from "@/config/theme";

const WHATSAPP_NUMBER = "917570002458";
const CALL_NUMBER = "+917570002458";

const getResponseData = (response) => response?.data?.data;

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function FloatingContactActions() {
  // Product page
  const productMatch = useMatch("/products/:slug");
  const slug = productMatch?.params?.slug;

  // Order details page
  const orderMatch = useMatch("/account/orders/:orderId");
  const orderId = orderMatch?.params?.orderId;

  // Existing product query
  const { data: productResponse } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: Boolean(slug) && !orderId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const product = productResponse?.data?.product;

  // Reuse the same orders query as OrderDetailsPage
  const { data: ordersResponse } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getOrders(),
    enabled: Boolean(orderId),
    retry: false,
  });

  const responseData = getResponseData(ordersResponse);

  const orders = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.orders)
      ? responseData.orders
      : [];

  const order = orders.find(
    (item) => String(item._id) === String(orderId)
  );

  const orderItems = Array.isArray(order?.items)
    ? order.items
    : [];

  const orderMessage = order
    ? [
        "Hi Kreedum Sports Support, I need help with my order.",
        "",
        `Customer: ${
          order.shippingAddress?.fullName || "Customer"
        }`,
        `Order number: ${
          order.orderNumber || order._id
        }`,
        `Item(s): ${
          orderItems.map((item) => item.name).filter(Boolean).join(", ") ||
          "Order details"
        }`,
        `Order date: ${formatDate(order.createdAt)}`,
        `Payment method: ${order.paymentMethod || "Not specified"}`,
        `Order total: ₹${(
          Number(order.pricing?.total) || 0
        ).toLocaleString("en-IN")}`,
        "",
        "Please assist me with this order. Thank you.",
      ].join("\n")
    : null;

  const productUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const productMessage = product
    ? [
        `Hi Kreedum Sports, I'm interested in ${product.name}.`,
        `Price: ₹${(
          Number(product.sellingPrice) || 0
        ).toLocaleString("en-IN")}`,
        `Product: ${productUrl}`,
        "Please share more details. Thanks!",
      ].join("\n")
    : "Hi Kreedum Sports, I'd like to know more about your sports and fitness products.";

  // Order-specific message takes priority on order details pages
  const message = orderId
    ? orderMessage ||
      `Hi Kreedum Sports Support, I need help with order ${orderId}.`
    : productMessage;

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-5 right-4 z-[45] flex flex-col items-center gap-3 sm:bottom-6 sm:right-6"
      aria-label="Contact Kreedum Sports"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Kreedum Sports on WhatsApp"
        title="Chat on WhatsApp"
        className="group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200 sm:h-14 sm:w-14"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={25} strokeWidth={2.2} />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#0E1A3D] opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:right-16">
          WhatsApp us
        </span>
      </a>

      <a
        href={`tel:${CALL_NUMBER}`}
        aria-label="Call Kreedum Sports"
        title="Call Kreedum Sports"
        className="group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:h-14 sm:w-14"
        style={{ backgroundColor: COLORS.blue }}
      >
        <Phone size={23} strokeWidth={2.2} />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#0E1A3D] opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:right-16">
          Call us
        </span>
      </a>
    </div>
  );
}
