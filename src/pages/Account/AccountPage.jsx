
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Heart,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { profileService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

function getDashboardData(response) {
  return response?.data?.data;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "We couldn't load your account. Please try again."
  );
}

function StatCard({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2C62E0]">
        <Icon size={23} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-[#0E1A3D]">
          {value ?? 0}
        </p>
      </div>

      <ArrowRight
        size={18}
        className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2C62E0]"
      />
    </Link>
  );
}

function QuickLink({ icon: Icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/40 sm:p-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2C62E0]">
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-[#0E1A3D]">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight size={18} className="shrink-0 text-slate-400" />
    </Link>
  );
}

export default function AccountPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const dashboardQuery = useQuery({
    queryKey: ["account-dashboard"],
    queryFn: () => profileService.getDashboard(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] px-4 pt-40">
        <p className="text-center text-sm text-slate-500">
          Checking your account...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const dashboard = getDashboardData(dashboardQuery.data);
  const user = dashboard?.user;
  const stats = dashboard?.stats;
  const address = dashboard?.defaultAddress;

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-16">
      <InnerPageHeader
        eyebrow="CUSTOMER ACCOUNT"
        title="My Account"
        description="Manage your personal information, orders and delivery details."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "My Account" },
        ]}
      />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {dashboardQuery.isPending ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[#2C62E0]" />
            <p className="mt-4 text-sm text-slate-500">
              Loading your account...
            </p>
          </div>
        ) : dashboardQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <h2 className="font-semibold text-[#0E1A3D]">
              Unable to load your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {getErrorMessage(dashboardQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => dashboardQuery.refetch()}
              className="mt-5 rounded-xl bg-[#2C62E0] px-5 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF0FF] text-[#2C62E0]">
                    <UserRound size={28} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">
                      Welcome back,
                    </p>
                    <h2 className="mt-1 truncate text-xl font-bold text-[#0E1A3D] sm:text-2xl">
                      {fullName || "Kreedum customer"}
                    </h2>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>

                <Link
                  to="/account/profile"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0E1A3D] transition hover:border-[#2C62E0] hover:text-[#2C62E0]"
                >
                  Edit profile
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0E1A3D]">
                  Your activity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quick access to your shopping activity.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  icon={Package}
                  label="Total orders"
                  value={stats?.totalOrders}
                  to="/account/orders"
                />
                <StatCard
                  icon={Heart}
                  label="Wishlist items"
                  value={stats?.wishlistItems}
                  to="/wishlist"
                />
                <StatCard
                  icon={ShoppingBag}
                  label="Items in cart"
                  value={stats?.cartItems}
                  to="/cart"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-bold text-[#0E1A3D]">
                Account settings
              </h2>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <QuickLink
                  icon={UserRound}
                  title="Personal information"
                  description="Update your name and phone number."
                  to="/account/profile"
                />
                <QuickLink
                  icon={Package}
                  title="My orders"
                  description="Review purchases and order status."
                  to="/account/orders"
                />
                <QuickLink
                  icon={MapPin}
                  title="Saved addresses"
                  description="Manage your delivery addresses."
                  to="/account/addresses"
                />
                <QuickLink
                  icon={Heart}
                  title="My wishlist"
                  description="View products you've saved."
                  to="/wishlist"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-[#0E1A3D]">
                    Default delivery address
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your preferred delivery location.
                  </p>
                </div>

                <MapPin className="shrink-0 text-[#2C62E0]" size={22} />
              </div>

              {address ? (
                <div className="mt-4 rounded-xl bg-[#F6F8FC] p-4">
                  <p className="font-semibold text-[#0E1A3D]">
                    {address.fullName || fullName || "Delivery address"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {[
                      address.addressLine1,
                      address.addressLine2,
                      address.locality,
                      address.city,
                      address.district,
                      address.state,
                      address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {address.phone && (
                    <p className="mt-2 text-sm text-slate-500">
                      Phone: {address.phone}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-[#F6F8FC] p-4">
                  <p className="text-sm text-slate-600">
                    You haven't set a default delivery address yet.
                  </p>
                </div>
              )}

              <Link
                to="/account/addresses"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2C62E0] hover:text-[#1F49B8]"
              >
                Manage addresses
                <ArrowRight size={16} />
              </Link>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
