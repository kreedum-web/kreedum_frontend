import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { orderService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

const getResponseData = (response) => response?.data?.data;

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusClasses = (status) => {
  switch ( String(status || "").toUpperCase()) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "CONFIRMED":
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses(
      status
    )}`}
  >
    {String(status || "UNKNOWN").replaceAll("_", " ")}
  </span>
);

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Reuse the existing orders API.
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getOrders(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  const responseData = getResponseData(ordersQuery.data);

  const orders = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.orders)
      ? responseData.orders
      : [];

  const order = orders.find(
    (item) => String(item._id) === String(orderId)
  );

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(orderId),

    onSuccess: async () => {
      setActionError("");
      setActionMessage("Your order has been cancelled.");

      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: (error) => {
      setActionMessage("");
      setActionError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to cancel your order. Please try again."
      );
    },
  });

  if (authLoading || ordersQuery.isPending) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] px-4 pt-28">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 py-16 text-sm text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin text-[#2C62E0]" />
          Loading order details...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] px-4 pt-28">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#0E1A3D]">
            Sign in to view this order
          </h1>

          <Link
            to="/login"
            className="mt-5 inline-flex rounded-xl bg-[#2C62E0] px-5 py-3 font-semibold text-white"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  if (ordersQuery.isError) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] px-4 pt-28">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center">
          <p className="font-semibold text-red-600">
            Unable to load order details.
          </p>

          <button
            onClick={() => ordersQuery.refetch()}
            className="mt-5 rounded-xl bg-[#2C62E0] px-5 py-3 font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] px-4 pt-28">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-slate-400" />

          <h1 className="mt-4 text-xl font-bold text-[#0E1A3D]">
            Order not found
          </h1>

          <Link
            to="/account/orders"
            className="mt-5 inline-flex rounded-xl bg-[#2C62E0] px-5 py-3 font-semibold text-white"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  const status = String(order.orderStatus || "").toUpperCase();
  const canCancel = ["PENDING", "CONFIRMED"].includes(status);
  const items = Array.isArray(order.items) ? order.items : [];
  const address = order.shippingAddress || {};
  const history = Array.isArray(order.statusHistory)
    ? order.statusHistory
    : [];

  return (
      <main className="min-h-screen bg-[#F6F8FC] pb-16">
    <InnerPageHeader
      eyebrow="YOUR ACCOUNT"
      title="Order Details"
      description="Track your order and manage your purchase."
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "My Account", to: "/account" },
        { label: "My Orders", to: "/account/orders" },
        { label: "Order Details" },
      ]}
    />

    <section className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          to="/account/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2C62E0]"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>



        {/* Feedback */}
        {actionMessage && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {actionMessage}
          </div>
        )}

        {actionError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {/* Products */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-[#0E1A3D] sm:text-xl">
            Ordered items ({items.length})
          </h2>

          <div className="mt-4 divide-y divide-slate-100">
            {items.map((item, index) => (
              <div
                key={item._id || `${item.product}-${item.variantId || ""}` || index}
                className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-5"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name || "Product"}
                    className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-contain p-2 sm:h-24 sm:w-24"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 sm:h-24 sm:w-24">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold text-[#0E1A3D]">
                    {item.name || "Product"}
                  </p>

                  {item.variantLabel && (
                    <p className="mt-1 text-sm text-slate-600">{item.variantLabel}</p>
                  )}

                  {item.sku && (
                    <p className="mt-1 text-xs text-slate-500">
                      SKU: {item.sku}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-slate-500">
                    Quantity: {item.quantity || 0}
                  </p>

                  <p className="mt-2 font-bold text-[#0E1A3D]">
                    {formatPrice(
                      item.total ??
                        Number(item.price || 0) *
                          Number(item.quantity || 0)
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery address */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#0E1A3D]">
            <MapPin size={19} />
            Delivery address
          </h2>

          <div className="mt-3 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-[#0E1A3D]">
              {address.fullName || address.name || "Customer"}
            </p>

            {address.phone && <p>{address.phone}</p>}
            {address.addressLine1 && <p>{address.addressLine1}</p>}
            {address.addressLine2 && <p>{address.addressLine2}</p>}

            <p>
              {[address.city, address.state, address.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>

            {address.country && <p>{address.country}</p>}
          </div>
        </section>

        {/* Payment and total */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-bold text-[#0E1A3D]">
            Payment & order total
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Payment method</span>
              <span className="text-right font-medium text-[#0E1A3D]">
                {order.paymentMethod || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Payment status</span>
              <StatusBadge status={order.paymentStatus} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
  <span className="font-semibold text-[#0E1A3D]">Order total</span>
  <span className="text-xl font-bold text-[#2C62E0]">
    {formatPrice(order.pricing?.total)}
  </span>
</div>
            </div>
          </div>
        </section>

        {/* Status history */}
        {history.length > 0 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <h2 className="text-lg font-bold text-[#0E1A3D]">
              Order updates
            </h2>

            <div className="mt-4 space-y-4">
              {history.map((entry, index) => (
                <div
                  key={entry._id || index}
                  className="flex gap-3"
                >
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2C62E0]" />

                  <div>
                    <p className="text-sm font-semibold text-[#0E1A3D]">
                      {String(entry.status || "").replaceAll("_", " ")}
                    </p>

                    {entry.note && (
                      <p className="mt-1 text-sm text-slate-500">
                        {entry.note}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(entry.timestamp || entry.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cancel order */}
        {canCancel && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-white p-4 sm:p-6">
            <h2 className="font-bold text-[#0E1A3D]">
              Need to cancel this order?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              You can cancel this order while it is pending or confirmed.
            </p>

            <button
              type="button"
              disabled={cancelMutation.isPending}
              onClick={() => {
                const confirmed = window.confirm(
                  `Cancel order ${order.orderNumber || orderId}?`
                );

                if (confirmed) {
                  setActionMessage("");
                  setActionError("");
                  cancelMutation.mutate();
                }
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 sm:w-auto"
            >
              <XCircle size={17} />
              {cancelMutation.isPending
                ? "Cancelling..."
                : "Cancel order"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}