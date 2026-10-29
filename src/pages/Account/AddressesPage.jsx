import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Edit3,
  Home,
  LoaderCircle,
  MapPin,
  MapPinned,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { addressService } from "@/api";
import { COLORS } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import { ADDRESS_TYPE_OPTIONS } from "@/constants/addressTypes";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import Dropdown from "@/components/common/Dropdown";

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

const REQUIRED_FIELDS = [
  "fullName",
  "phone",
  "addressLine1",
  "locality",
  "city",
  "district",
  "state",
  "pincode",
];

function getResponseData(response) {
  return response?.data?.data;
}

function normalizeAddresses(response) {
  const data = getResponseData(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.addresses)) return data.addresses;

  return [];
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export default function AddressesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAddresses(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  const addresses = normalizeAddresses(addressesQuery.data);

  async function refreshAddresses() {
    await queryClient.invalidateQueries({
      queryKey: ["addresses"],
    });
  }

  function resetForm() {
    setAddressForm(INITIAL_ADDRESS);
    setEditingAddressId(null);
    setFormOpen(false);
    setFormError("");
    setPincodeMessage("");
  }

  function startAddAddress() {
    setAddressForm(INITIAL_ADDRESS);
    setEditingAddressId(null);
    setFormError("");
    setPincodeMessage("");
    setActionError("");
    setSuccessMessage("");
    setFormOpen(true);
  }

  function startEditAddress(address) {
    setAddressForm({
      label: address.label || "Home",
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      locality: address.locality || "",
      city: address.city || "",
      district: address.district || "",
      state: address.state || "",
      country: address.country || "India",
      pincode: address.pincode || "",
    });

    setEditingAddressId(address._id);
    setFormError("");
    setPincodeMessage("");
    setActionError("");
    setSuccessMessage("");
    setFormOpen(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      id
        ? addressService.updateAddress(id, payload)
        : addressService.createAddress(payload),

    onSuccess: async (_response, variables) => {
      await refreshAddresses();

      setSuccessMessage(
        variables.id
          ? "Your address has been updated."
          : "Your address has been saved."
      );

      resetForm();
      setActionError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    onError: (error) => {
      setFormError(
        getErrorMessage(
          error,
          "We couldn't save this address. Please try again."
        )
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => addressService.deleteAddress(id),

    onSuccess: async () => {
      await refreshAddresses();
      setActionError("");
      setSuccessMessage("The address has been deleted.");
    },

    onError: (error) => {
      setActionError(
        getErrorMessage(
          error,
          "We couldn't delete this address. Please try again."
        )
      );
    },
  });

  const defaultMutation = useMutation({
    mutationFn: (id) => addressService.setDefaultAddress(id),

    onSuccess: async () => {
      await refreshAddresses();
      setActionError("");
      setSuccessMessage("Your default address has been updated.");
    },

    onError: (error) => {
      setActionError(
        getErrorMessage(
          error,
          "We couldn't update your default address. Please try again."
        )
      );
    },
  });

  const pincodeMutation = useMutation({
    mutationFn: (pincode) =>
      addressService.lookupPincode(pincode),

    onSuccess: (response) => {
      const data = getResponseData(response);

      if (!data) {
        setPincodeMessage(
          "No location details were returned. Enter them manually."
        );
        return;
      }

      setAddressForm((current) => ({
        ...current,
        city: data.city || current.city,
        district: data.district || current.district,
        state: data.state || current.state,
        country: data.country || current.country || "India",
        locality: data.locality || current.locality,
      }));

      setPincodeMessage(
        "Location details found. Please verify them before saving."
      );
    },

    onError: (error) => {
      setPincodeMessage(
        getErrorMessage(
          error,
          "PIN-code lookup failed. Enter your location manually."
        )
      );
    },
  });

  function updateField(event) {
    const { name, value } = event.target;

    setAddressForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");

    if (name === "pincode") {
      setPincodeMessage("");
    }
  }

  function lookupPincode() {
    const pincode = addressForm.pincode.trim();

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPincodeMessage("Enter a valid 6-digit Indian PIN code.");
      return;
    }

    setPincodeMessage("");
    pincodeMutation.mutate(pincode);
  }

  function saveAddress(event) {
    event.preventDefault();
    setFormError("");
    setActionError("");
    setSuccessMessage("");

    if (!/^[6-9][0-9]{9}$/.test(addressForm.phone.trim())) {
      setFormError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(addressForm.pincode.trim())) {
      setFormError("Enter a valid 6-digit Indian PIN code.");
      return;
    }

    const missingField = REQUIRED_FIELDS.find(
      (field) => !String(addressForm[field] || "").trim()
    );

    if (missingField) {
      setFormError("Please complete all required address fields.");
      return;
    }

    const payload = {
      ...addressForm,
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      addressLine1: addressForm.addressLine1.trim(),
      addressLine2: addressForm.addressLine2.trim(),
      locality: addressForm.locality.trim(),
      city: addressForm.city.trim(),
      district: addressForm.district.trim(),
      state: addressForm.state.trim(),
      country: addressForm.country.trim() || "India",
      pincode: addressForm.pincode.trim(),
    };

    saveMutation.mutate({
      id: editingAddressId,
      payload,
    });
  }

  function deleteAddress(address) {
    const description = [
      address.addressLine1,
      address.locality,
      address.city,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const confirmed = window.confirm(
      `Delete this ${address.label || ""} address?\n\n${description}\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setActionError("");
    setSuccessMessage("");
    deleteMutation.mutate(address._id);
  }

  function setDefaultAddress(id) {
    setActionError("");
    setSuccessMessage("");
    defaultMutation.mutate(id);
  }

  const isActionPending =
    deleteMutation.isPending ||
    defaultMutation.isPending;

  if (authLoading) {
    return <AddressesLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: "/account/addresses" }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-12">
      <InnerPageHeader
        eyebrow="Your Account"
        title="My Addresses"
        description="Manage your delivery addresses for a smoother checkout."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "My Account", to: "/account" },
          { label: "My Addresses" },
        ]}
        rightContent={
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
            <MapPin size={16} />
            {addresses.length}{" "}
            {addresses.length === 1 ? "address" : "addresses"}
          </span>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#2C62E0]"
          >
            <ArrowLeft size={16} />
            Back to My Account
          </Link>

          {!formOpen && (
            <button
              type="button"
              onClick={startAddAddress}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: COLORS.blue }}
            >
              <Plus size={17} />
              Add new address
            </button>
          )}
        </div>

        {successMessage && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p>{successMessage}</p>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="ml-auto"
              aria-label="Dismiss success message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError("")}
              className="ml-auto font-bold"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {formOpen && (
          <section className="mb-7 overflow-hidden rounded-3xl border border-[#E5EAF4] bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-[#EEF1F7] px-5 py-5 sm:px-7">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF0FF]">
                  <MapPinned size={21} color={COLORS.blue} />
                </div>
                <div>
                  <h2
                    className="text-lg font-extrabold"
                    style={{ color: COLORS.navy }}
                  >
                    {editingAddressId ? "Edit address" : "Add a new address"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Fields marked with * are required.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-[#F6F8FC] hover:text-[#0E1A3D]"
                aria-label="Close address form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveAddress} className="p-5 sm:p-7">
              {formError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {formError}
                </div>
              )}

              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <Field label="Address type" required>
                  <Dropdown
                    variant="field"
                    className="mt-1"
                    label="Address type"
                    value={addressForm.label}
                    options={ADDRESS_TYPE_OPTIONS}
                    onChange={(value) => updateField({ target: { name: "label", value } })}
                  />
                </Field>

                <Field label="Full name" required>
                  <input
                    name="fullName"
                    value={addressForm.fullName}
                    onChange={updateField}
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
                    onChange={updateField}
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
                      onChange={updateField}
                      autoComplete="postal-code"
                      placeholder="6-digit PIN"
                      className={inputClass}
                      required
                    />

                    <button
                      type="button"
                      onClick={lookupPincode}
                      disabled={pincodeMutation.isPending}
                      className="mt-1 shrink-0 rounded-xl border border-[#DDE4F2] px-3 text-xs font-bold transition hover:border-[#2C62E0] disabled:opacity-50"
                      style={{ color: COLORS.blue }}
                    >
                      {pincodeMutation.isPending
                        ? "Checking…"
                        : "Lookup"}
                    </button>
                  </div>

                  {pincodeMessage && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {pincodeMessage}
                    </p>
                  )}
                </Field>

                <Field label="Flat, house or building" required>
                  <input
                    name="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={updateField}
                    autoComplete="address-line1"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Landmark / address line 2">
                  <input
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={updateField}
                    autoComplete="address-line2"
                    className={inputClass}
                  />
                </Field>

                <Field label="Locality / area" required>
                  <input
                    name="locality"
                    value={addressForm.locality}
                    onChange={updateField}
                    autoComplete="address-level3"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="City" required>
                  <input
                    name="city"
                    value={addressForm.city}
                    onChange={updateField}
                    autoComplete="address-level2"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="District" required>
                  <input
                    name="district"
                    value={addressForm.district}
                    onChange={updateField}
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="State" required>
                  <input
                    name="state"
                    value={addressForm.state}
                    onChange={updateField}
                    autoComplete="address-level1"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Country" required>
                  <input
                    name="country"
                    value={addressForm.country}
                    onChange={updateField}
                    autoComplete="country-name"
                    className={inputClass}
                    required
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-[#EEF1F7] pt-5">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: COLORS.blue }}
                >
                  {saveMutation.isPending ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                  {saveMutation.isPending
                    ? "Saving…"
                    : editingAddressId
                    ? "Save changes"
                    : "Save address"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saveMutation.isPending}
                  className="min-h-11 rounded-xl border border-[#DDE4F2] px-5 py-3 text-sm font-bold text-[#0E1A3D] transition hover:bg-[#F6F8FC] disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {addressesQuery.isLoading ? (
          <AddressCardsLoading />
        ) : addressesQuery.isError ? (
          <section className="rounded-3xl border border-[#E5EAF4] bg-white px-6 py-14 text-center shadow-sm">
            <RefreshCw
              size={35}
              className="mx-auto"
              color={COLORS.blue}
            />
            <h2
              className="mt-5 text-xl font-extrabold"
              style={{ color: COLORS.navy }}
            >
              We couldn't load your addresses
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Check your connection and try again. Your saved addresses
              haven't been changed.
            </p>
            <button
              type="button"
              onClick={() => addressesQuery.refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: COLORS.blue }}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </section>
        ) : addresses.length === 0 ? (
          <section className="rounded-3xl border border-[#E5EAF4] bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF0FF]">
              <Home size={29} color={COLORS.blue} />
            </div>
            <h2
              className="mt-5 text-xl font-extrabold"
              style={{ color: COLORS.navy }}
            >
              No saved addresses yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your home, office or another delivery address to make
              your next checkout faster.
            </p>
            {!formOpen && (
              <button
                type="button"
                onClick={startAddAddress}
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: COLORS.blue }}
              >
                <Plus size={17} />
                Add your first address
              </button>
            )}
          </section>
        ) : (
          <div>
            <div className="mb-5">
              <h2
                className="text-lg font-extrabold md:text-xl"
                style={{ color: COLORS.navy }}
              >
                Your saved addresses
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a default address or update your saved details.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => {
                const isDefault = Boolean(address.isDefault);
                const deleting =
                  deleteMutation.isPending &&
                  deleteMutation.variables === address._id;

                const settingDefault =
                  defaultMutation.isPending &&
                  defaultMutation.variables === address._id;

                return (
                  <article
                    key={address._id}
                    className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
                      isDefault
                        ? "border-[#B9C9F3]"
                        : "border-[#E5EAF4]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-[#EEF1F7] px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isDefault ? "bg-[#EAF0FF]" : "bg-[#F6F8FC]"
                          }`}
                        >
                          {address.label === "Home" ? (
                            <Home
                              size={19}
                              color={isDefault ? COLORS.blue : COLORS.navy}
                            />
                          ) : (
                            <MapPin
                              size={19}
                              color={isDefault ? COLORS.blue : COLORS.navy}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="truncate text-sm font-extrabold"
                            style={{ color: COLORS.navy }}
                          >
                            {address.label || "Address"}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {address.fullName}
                          </p>
                        </div>
                      </div>

                      {isDefault && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EAF0FF] px-2.5 py-1 text-[10px] font-extrabold text-[#2C62E0]">
                          <Star size={12} fill="currentColor" />
                          Default
                        </span>
                      )}
                    </div>

                    <div className="px-5 py-5">
                      <p
                        className="text-sm font-bold"
                        style={{ color: COLORS.navy }}
                      >
                        {address.fullName}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {address.addressLine1}
                        {address.addressLine2
                          ? `, ${address.addressLine2}`
                          : ""}
                        {address.locality ? `, ${address.locality}` : ""}
                        {address.city ? `, ${address.city}` : ""}
                        {address.district &&
                        address.district !== address.city
                          ? `, ${address.district}`
                          : ""}
                        {address.state ? `, ${address.state}` : ""}
                        {address.pincode ? ` - ${address.pincode}` : ""}
                        {address.country ? `, ${address.country}` : ""}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        Phone:{" "}
                        <span className="font-semibold text-slate-700">
                          {address.phone}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-[#EEF1F7] bg-[#FCFDFF] px-4 py-4">
                      <button
                        type="button"
                        onClick={() => startEditAddress(address)}
                        disabled={isActionPending || saveMutation.isPending}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#DDE4F2] bg-white px-3 py-2 text-xs font-bold text-[#0E1A3D] transition hover:border-[#2C62E0] hover:bg-[#EAF0FF] disabled:opacity-50"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      {!isDefault && (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(address._id)}
                          disabled={isActionPending}
                          className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#DDE4F2] bg-white px-3 py-2 text-xs font-bold text-[#2C62E0] transition hover:bg-[#EAF0FF] disabled:opacity-50"
                        >
                          {settingDefault ? (
                            <LoaderCircle
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {settingDefault ? "Updating…" : "Set as default"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteAddress(address)}
                        disabled={isActionPending}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting ? (
                          <LoaderCircle
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        {deleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-4">
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: COLORS.navy }}
            >
              Ready to check out?
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Your saved addresses will be available at checkout.
            </p>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: COLORS.blue }}
          >
            Continue to cart
          </Link>
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "mt-1 w-full min-h-[46px] rounded-xl border border-[#DDE4F2] bg-white px-3 py-3 text-sm text-[#0E1A3D] outline-none transition placeholder:text-slate-400 focus:border-[#2C62E0] focus:ring-2 focus:ring-[#2C62E0]/10";

function Field({ label, required = false, children }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
      {children}
    </label>
  );
}

function AddressesLoading() {
  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <div className="h-56 animate-pulse bg-gradient-to-br from-[#0E1A3D] to-[#2C62E0]" />
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <AddressCardsLoading />
      </section>
    </main>
  );
}

function AddressCardsLoading() {
  return (
    <div className="grid animate-pulse gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-3xl border border-[#E5EAF4] bg-white p-5"
        >
          <div className="h-5 w-1/3 rounded bg-slate-100" />
          <div className="mt-5 h-3 w-2/3 rounded bg-slate-100" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
          <div className="mt-6 h-10 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
