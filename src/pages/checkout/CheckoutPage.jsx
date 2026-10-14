import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  LoaderCircle,
  MapPin,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  addressService,
  cartService,
  orderService,
} from "@/api";
import { COLORS } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

const INITIAL_ADDRESS = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  locality: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  pincode: "",
};

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function getData(response) {
  return response?.data?.data;
}

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS);
  const [formError, setFormError] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);



  useEffect(() => {
  if (!placedOrder) return;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, [placedOrder]);

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAddresses(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  const cart = useMemo(() => {
    const data = getData(cartQuery.data);
    const products = Array.isArray(data?.products)
      ? data.products
      : [];

    return {
      products,
      totalItems:
        Number(data?.totalItems) ||
        products.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        ),
      subtotal: Number(data?.subtotal) || 0,
    };
  }, [cartQuery.data]);

  const addresses = useMemo(() => {
    const data = getData(addressesQuery.data);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.addresses)) return data.addresses;

    return [];
  }, [addressesQuery.data]);

  const selectedAddress = addresses.find(
    (address) => address._id === selectedAddressId
  );

  useEffect(() => {
    if (!addresses.length) return;

    setSelectedAddressId((current) => {
      if (current && addresses.some((a) => a._id === current)) {
        return current;
      }

      return (
        addresses.find((address) => address.isDefault)?._id ||
        addresses[0]._id
      );
    });
  }, [addresses]);

  const shippingCharge = cart.subtotal >= 999 ? 0 : 99;
  const grandTotal = cart.subtotal + shippingCharge;

  const saveAddressMutation = useMutation({
    mutationFn: (payload) => addressService.createAddress(payload),

    onSuccess: async (response) => {
      const savedAddress = getData(response);

      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      if (savedAddress?._id) {
        setSelectedAddressId(savedAddress._id);
      }

      setAddressForm(INITIAL_ADDRESS);
      setShowAddressForm(false);
      setFormError("");
      setPincodeMessage("");
    },

    onError: (error) => {
      setFormError(
        error?.response?.data?.message ||
          "Unable to save this address. Please try again."
      );
    },
  });

  const pincodeMutation = useMutation({
    mutationFn: (pincode) =>
      addressService.lookupPincode(pincode),

    onSuccess: (response) => {
      const data = getData(response);

      if (!data) {
        setPincodeMessage("No location details were returned.");
        return;
      }

      setAddressForm((current) => ({
        ...current,
        city: data.city || current.city,
        district: data.district || current.district,
        state: data.state || current.state,
        country: data.country || "India",
        locality: data.locality || current.locality,
      }));

      setPincodeMessage(
        "Location details found. Please verify the locality."
      );
    },

    onError: (error) => {
      setPincodeMessage(
        error?.response?.data?.message ||
          "PIN-code lookup failed. Enter the location manually."
      );
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: (payload) => orderService.placeOrder(payload),

    onSuccess: async (response) => {
      const order = getData(response);

      setPlacedOrder(order || {});

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["addresses"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]);
    },

    onError: (error) => {
      setFormError(
        error?.response?.data?.message ||
          "Your order could not be placed. Please try again."
      );
    },
  });

  function updateAddressField(event) {
    const { name, value } = event.target;

    setAddressForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "pincode") {
      setPincodeMessage("");
    }

    setFormError("");
  }

  function lookupPincode() {
    if (!/^[1-9][0-9]{5}$/.test(addressForm.pincode)) {
      setPincodeMessage("Enter a valid 6-digit Indian PIN code.");
      return;
    }

    pincodeMutation.mutate(addressForm.pincode);
  }

  function saveAddress(event) {
    event.preventDefault();
    setFormError("");

    if (!/^[6-9][0-9]{9}$/.test(addressForm.phone)) {
      setFormError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(addressForm.pincode)) {
      setFormError("Enter a valid 6-digit Indian PIN code.");
      return;
    }

    const requiredFields = [
      "fullName",
      "phone",
      "addressLine1",
      "locality",
      "city",
      "district",
      "state",
      "pincode",
    ];

    const missingField = requiredFields.some(
      (field) => !String(addressForm[field] || "").trim()
    );

    if (missingField) {
      setFormError("Complete all required address fields.");
      return;
    }

    saveAddressMutation.mutate(addressForm);
  }

  function placeOrder() {
    setFormError("");

    if (!cart.products.length) {
      setFormError("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      setFormError("Select or add a delivery address.");
      return;
    }

    // The backend expects the complete address object,
    // not only the saved address ID.
    const shippingAddress = {
      label: selectedAddress.label,
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      addressLine1: selectedAddress.addressLine1,
      addressLine2: selectedAddress.addressLine2 || "",
      locality: selectedAddress.locality,
      city: selectedAddress.city,
      district: selectedAddress.district,
      state: selectedAddress.state,
      country: selectedAddress.country || "India",
      pincode: selectedAddress.pincode,
    };

    placeOrderMutation.mutate({
      shippingAddress,
      paymentMethod: "COD",
      notes: orderNotes.trim(),
    });
  }

  if (authLoading) {
    return <CheckoutLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: "/checkout" }}
      />
    );
  }

  if (placedOrder) {
    return (
      <main className="min-h-[60vh] bg-[#F6F8FC] px-4 py-6 sm:py-10">
        <section className="mx-auto max-w-xl rounded-3xl border border-[#E5EAF4] bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">
            <CheckCircle2
              size={42}
              className="text-emerald-600"
            />
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
            Order confirmed
          </p>

          <h1
            className="mt-2 text-2xl font-extrabold sm:text-3xl"
            style={{ color: COLORS.navy }}
          >
            Thanks for shopping with Kreedum!
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your order has been submitted successfully.
            Keep your order details for reference.
          </p>

          {placedOrder.orderNumber && (
            <div className="mt-6 rounded-2xl bg-[#F6F8FC] p-4">
              <p className="text-xs text-slate-500">Order number</p>
              <p className="mt-1 font-extrabold" style={{ color: COLORS.navy }}>
                {placedOrder.orderNumber}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-[#E5EAF4] p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-500">Payment</span>
              <span className="text-sm font-bold" style={{ color: COLORS.navy }}>
                Cash on delivery
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-slate-500">Order total</span>
              <span className="text-lg font-extrabold" style={{ color: COLORS.navy }}>
                {formatINR(
                  placedOrder.pricing?.total ?? grandTotal
                )}
              </span>
            </div>
          </div>

          <Link
            to="/products"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white"
            style={{ backgroundColor: COLORS.blue }}
          >
            <ShoppingBag size={17} />
            Continue shopping
          </Link>
        </section>
      </main>
    );
  }

  if (cartQuery.isLoading || addressesQuery.isLoading) {
    return <CheckoutLoading />;
  }

  if (cartQuery.isError) {
    return (
      <CheckoutMessage
        title="Unable to load your cart"
        message="Check your connection and retry before placing your order."
        onRetry={() => cartQuery.refetch()}
      />
    );
  }

  if (cart.products.length === 0) {
    return (
      <CheckoutMessage
        title="Your cart is empty"
        message="Add some products before continuing to checkout."
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: COLORS.blue }}
          >
            Browse products <ArrowRight size={16} />
          </Link>
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-12">
      <InnerPageHeader
        eyebrow="Kreedum Sports"
        title="Secure Checkout"
        description="Confirm your delivery details and place your order."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-[#2C62E0]">1. Cart</span>
          <ChevronRight size={14} />
          <span className="font-extrabold" style={{ color: COLORS.navy }}>
            2. Delivery
          </span>
          <ChevronRight size={14} />
          <span>3. Confirmation</span>
        </div>

        {formError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-[#E5EAF4] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0FF]">
                    <MapPin size={21} color={COLORS.blue} />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold" style={{ color: COLORS.navy }}>
                      Delivery address
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => {
                      setAddressForm(INITIAL_ADDRESS);
                      setShowAddressForm(true);
                      setFormError("");
                    }}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-bold"
                    style={{ color: COLORS.blue }}
                  >
                    <Plus size={16} />
                    Add new
                  </button>
                )}
              </div>

              {addressesQuery.isError && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  Could not load saved addresses. Retry the page before placing your order.
                </p>
              )}

              {!addressesQuery.isError && addresses.length > 0 && (
                <div className="mt-5 space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                        selectedAddressId === address._id
                          ? "border-[#2C62E0] bg-[#F5F8FF]"
                          : "border-[#E5EAF4] hover:border-[#B9C9F3]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={selectedAddressId === address._id}
                        onChange={() => setSelectedAddressId(address._id)}
                        className="mt-1 accent-[#2C62E0]"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold" style={{ color: COLORS.navy }}>
                            {address.fullName}
                          </span>

                          <span className="rounded-md bg-[#EAF0FF] px-2 py-0.5 text-[10px] font-bold text-[#2C62E0]">
                            {address.label || "Address"}
                          </span>

                          {address.isDefault && (
                            <span className="text-[10px] font-semibold text-emerald-700">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                          {`, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Phone: {address.phone}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {!addressesQuery.isError && addresses.length === 0 && !showAddressForm && (
                <div className="mt-5 rounded-2xl border border-dashed border-[#CBD5E8] p-5 text-center">
                  <MapPin className="mx-auto text-slate-400" size={26} />
                  <p className="mt-3 text-sm font-bold" style={{ color: COLORS.navy }}>
                    No saved addresses yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Add a delivery address to continue.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="mt-4 rounded-xl px-4 py-2 text-sm font-bold text-white"
                    style={{ backgroundColor: COLORS.blue }}
                  >
                    Add delivery address
                  </button>
                </div>
              )}

              {showAddressForm && (
                <form onSubmit={saveAddress} className="mt-5 border-t border-[#EEF1F7] pt-5">
                  <h3 className="font-extrabold" style={{ color: COLORS.navy }}>
                    New delivery address
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Address type" required>
                      <select
                        name="label"
                        value={addressForm.label}
                        onChange={updateAddressField}
                        className={inputClass}
                      >
                        <option>Home</option>
                        <option>Office</option>
                        <option>Hostel</option>
                        <option>Other</option>
                      </select>
                    </Field>

                    <Field label="Full name" required>
                      <input
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={updateAddressField}
                        autoComplete="name"
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="Mobile number" required>
                      <input
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={addressForm.phone}
                        onChange={updateAddressField}
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="PIN code" required>
                      <div className="flex gap-2">
                        <input
                          name="pincode"
                          inputMode="numeric"
                          maxLength={6}
                          value={addressForm.pincode}
                          onChange={updateAddressField}
                          autoComplete="postal-code"
                          placeholder="6-digit PIN"
                          className={inputClass}
                          required
                        />

                        <button
                          type="button"
                          onClick={lookupPincode}
                          disabled={pincodeMutation.isPending}
                          className="shrink-0 rounded-xl border border-[#DDE4F2] px-3 text-xs font-bold disabled:opacity-50"
                          style={{ color: COLORS.blue }}
                        >
                          {pincodeMutation.isPending ? "Checking…" : "Lookup"}
                        </button>
                      </div>

                      {pincodeMessage && (
                        <p className="mt-1 text-xs text-slate-500">
                          {pincodeMessage}
                        </p>
                      )}
                    </Field>

                    <Field label="Flat, house or building" required>
                      <input
                        name="addressLine1"
                        value={addressForm.addressLine1}
                        onChange={updateAddressField}
                        autoComplete="address-line1"
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="Landmark / address line 2">
                      <input
                        name="addressLine2"
                        value={addressForm.addressLine2}
                        onChange={updateAddressField}
                        autoComplete="address-line2"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Locality / area" required>
                      <input
                        name="locality"
                        value={addressForm.locality}
                        onChange={updateAddressField}
                        autoComplete="address-level3"
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="City" required>
                      <input
                        name="city"
                        value={addressForm.city}
                        onChange={updateAddressField}
                        autoComplete="address-level2"
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="District" required>
                      <input
                        name="district"
                        value={addressForm.district}
                        onChange={updateAddressField}
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="State" required>
                      <input
                        name="state"
                        value={addressForm.state}
                        onChange={updateAddressField}
                        autoComplete="address-level1"
                        className={inputClass}
                        required
                      />
                    </Field>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saveAddressMutation.isPending}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                      style={{ backgroundColor: COLORS.blue }}
                    >
                      {saveAddressMutation.isPending && (
                        <LoaderCircle size={16} className="animate-spin" />
                      )}
                      Save address
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setFormError("");
                      }}
                      className="rounded-xl border border-[#DDE4F2] px-4 py-3 text-sm font-bold"
                      style={{ color: COLORS.navy }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            <section className="rounded-3xl border border-[#E5EAF4] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0FF]">
                  <PackageCheck size={21} color={COLORS.blue} />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: COLORS.navy }}>
                    Payment method
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose how you want to pay for your order.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#2C62E0] bg-[#F5F8FF] p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked
                  readOnly
                  className="mt-1 accent-[#2C62E0]"
                />

                <div className="flex-1">
                  <p className="text-sm font-extrabold" style={{ color: COLORS.navy }}>
                    Cash on Delivery (COD)
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pay when your order is delivered.
                  </p>
                </div>

                <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-[#2C62E0]">
                  Available
                </span>
              </div>

              <Field label="Order notes (optional)">
                <textarea
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Delivery instructions or additional information"
                  className={inputClass}
                />
              </Field>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28">
            <section className="overflow-hidden rounded-3xl border border-[#E5EAF4] bg-white shadow-sm">
              <div className="border-b border-[#EEF1F7] p-5">
                <h2 className="text-lg font-extrabold" style={{ color: COLORS.navy }}>
                  Order summary
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {cart.totalItems} items in your cart
                </p>
              </div>

              <div className="max-h-72 space-y-4 overflow-y-auto p-5">
                {cart.products.map((product) => (
                  <div
                    key={product._id || product.slug || product.name}
                    className="flex gap-3"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EEF1F7] bg-[#F6F8FC]">
                      {product.thumbnail || product.images?.[0] ? (
                        <img
                          src={product.thumbnail || product.images?.[0]}
                          alt={product.name || "Product"}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <ShoppingBag className="text-slate-300" size={22} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-bold" style={{ color: COLORS.navy }}>
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Qty: {product.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-extrabold" style={{ color: COLORS.navy }}>
                      {formatINR(product.total)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-[#EEF1F7] p-5">
                <PriceRow label="Subtotal" value={formatINR(cart.subtotal)} />
                <PriceRow
                  label="Shipping"
                  value={
                    shippingCharge === 0
                      ? "FREE"
                      : formatINR(shippingCharge)
                  }
                  highlight={shippingCharge === 0}
                />

                {shippingCharge > 0 && (
                  <p className="rounded-lg bg-[#F6F8FC] p-3 text-xs leading-5 text-slate-500">
                    Add {formatINR(999 - cart.subtotal)} more to qualify for free shipping.
                  </p>
                )}

                <div className="border-t border-dashed border-[#DDE4F2] pt-4">
                  <PriceRow
                    label="Total payable"
                    value={formatINR(grandTotal)}
                    strong
                  />
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">
                    Final prices are validated by the server when you place the order.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={
                    placeOrderMutation.isPending ||
                    !selectedAddress ||
                    addressesQuery.isError ||
                    cart.products.length === 0
                  }
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: COLORS.blue }}
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    <>
                      Place order <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={15} />
                  Your order is processed securely
                </div>

                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 text-xs font-bold"
                  style={{ color: COLORS.blue }}
                >
                  <ArrowLeft size={14} />
                  Return to cart
                </Link>
              </div>
            </section>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-4">
              <Truck size={19} className="mt-0.5 shrink-0" color={COLORS.blue} />
              <p className="text-xs leading-5 text-slate-500">
                Please check your delivery address and contact number before placing your order.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "mt-1 w-full rounded-xl border border-[#DDE4F2] bg-white px-3 py-3 text-sm text-[#0E1A3D] outline-none transition placeholder:text-slate-400 focus:border-[#2C62E0] focus:ring-2 focus:ring-[#2C62E0]/10";

function Field({ label, required = false, children }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
      {children}
    </label>
  );
}

function PriceRow({ label, value, strong = false, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`text-sm ${strong ? "font-extrabold" : "text-slate-500"}`} style={strong ? { color: COLORS.navy } : undefined}>
        {label}
      </span>
      <span
        className={`${strong ? "text-xl font-extrabold" : "text-sm font-bold"} ${highlight ? "text-emerald-600" : ""}`}
        style={!highlight ? { color: COLORS.navy } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <div className="h-56 animate-pulse bg-gradient-to-br from-[#0E1A3D] to-[#2C62E0]" />
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-96 rounded-3xl bg-white" />
          <div className="h-80 rounded-3xl bg-white" />
        </div>
      </div>
    </main>
  );
}

function CheckoutMessage({ title, message, onRetry, action }) {
  return (
    <main className="min-h-[60vh] bg-[#F6F8FC] px-4 py-16">
      <section className="mx-auto max-w-lg rounded-3xl border border-[#E5EAF4] bg-white p-8 text-center">
        <ShoppingBag className="mx-auto" size={38} color={COLORS.blue} />
        <h1 className="mt-5 text-2xl font-extrabold" style={{ color: COLORS.navy }}>
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-xl px-5 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: COLORS.blue }}
          >
            Try again
          </button>
        )}

        {action && <div className="mt-5">{action}</div>}

        <Link
          to="/cart"
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
          style={{ color: COLORS.blue }}
        >
          <ArrowLeft size={15} /> Return to cart
        </Link>
      </section>
    </main>
  );
}
