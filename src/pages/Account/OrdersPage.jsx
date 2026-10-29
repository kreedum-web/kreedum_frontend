
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Package,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import { orderService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

function getResponseData(response) {
  return response?.data?.data;
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClasses(status) {
  switch (String(status || "").toUpperCase()) {
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
}

function StatusBadge({ status }) {
  const label = String(status || "UNKNOWN")
    .replaceAll("_", " ");

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
        status
      )}`}
    >
      {label}
    </span>
  );
}

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

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

  const cancelMutation = useMutation({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),

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
        getErrorMessage(
          error,
          "We couldn't cancel this order. Please try again."
        )
      );
    },
  });

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] px-4 pb-12 pt-40">
        <p className="text-center text-sm text-slate-500">
          Checking your account...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] px-4 pb-12 pt-40">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto mb-4 h-10 w-10 text-[#2C62E0]" />
          <h1 className="text-xl font-bold text-[#0E1A3D]">
            Sign in to view your orders
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Log in to see your purchases and order status.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-[#2C62E0] px-5 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-16">
      <InnerPageHeader
        eyebrow="YOUR ACCOUNT"
        title="My Orders"
        description="View your purchases and keep track of your orders."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "My Account", to: "/account" },
          { label: "My Orders" },
        ]}
        rightContent={
          <span className="inline-flex items-center gap-2">
            <Package size={18} />
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E1A3D] hover:text-[#2C62E0]"
          >
            <ArrowLeft size={17} />
            Continue shopping
          </Link>

          <button
            type="button"
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0E1A3D] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={ordersQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {actionMessage && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {actionMessage}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        {ordersQuery.isPending ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[#2C62E0]" />
            <p className="mt-4 text-sm text-slate-500">
              Loading your orders...
            </p>
          </div>
        ) : ordersQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <p className="font-semibold text-[#0E1A3D]">
              We couldn't load your orders.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {getErrorMessage(
                ordersQuery.error,
                "Please try again."
              )}
            </p>
            <button
              type="button"
              onClick={() => ordersQuery.refetch()}
              className="mt-5 rounded-xl bg-[#2C62E0] px-5 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <ShoppingBag className="h-8 w-8 text-[#2C62E0]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0E1A3D]">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When you place an order, its details and status will appear here.
            </p>

            <Link
              to="/categories"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2C62E0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F49B8]"
            >
              <ShoppingBag size={17} />
              Explore products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const orderId = order._id;
              const status = String(order.orderStatus || "").toUpperCase();

              const canCancel =
                status === "PENDING" || status === "CONFIRMED";

              const items = Array.isArray(order.items) ? order.items : [];

           return (
  <Link
    key={orderId}
    to={`/account/orders/${orderId}`}
    className="block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[#2C62E0] hover:shadow-sm"
  >
    <div className="flex min-h-[116px] items-stretch">
      {/* Product thumbnail */}
      <div className="flex w-28 shrink-0 items-center justify-center bg-slate-100 sm:w-36">
        {items[0]?.thumbnail ? (
          <img
            src={items[0].thumbnail}
            alt={items[0].name || "Product"}
            className="h-full max-h-32 w-full object-contain p-3"
            loading="lazy"
          />
        ) : (
          <Package className="h-9 w-9 text-slate-400" />
        )}
      </div>

      {/* Order summary */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusBadge status={order.orderStatus} />
          <span className="text-xs text-slate-500">
            {formatDate(order.createdAt)}
          </span>
        </div>

        <p className="line-clamp-2 text-sm font-semibold text-[#0E1A3D] sm:text-base">
          {items[0]?.name || "Order"}
          {items[0]?.variantLabel && ` (${items[0].variantLabel})`}
          {items.length > 1 && ` + ${items.length - 1} more`}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold text-[#0E1A3D]">
            {formatPrice(order.pricing?.total)}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C62E0]">
            View details
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
          </span>
        </div>
      </div>
    </div>
  </Link>
);
            })}
          </div>
        )}
      </section>
    </main>
  );
}
