
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  RefreshCw,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { profileService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

const emptyPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function responseData(response) {
  return response?.data?.data ?? response?.data?.user ?? response?.data ?? {};
}

function errorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly = false,
  error,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#0E1A3D]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100 ${
          readOnly
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
            : error
              ? "border-red-300"
              : "border-slate-200 bg-white"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

function PasswordField({ label, name, value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#0E1A3D]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={
            name === "currentPassword"
              ? "current-password"
              : "new-password"
          }
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-[#2C62E0]"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function Notice({ children, error = false }) {
  return (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${
        error
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      {children}
    </p>
  );
}

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading, setUser } = useAuth();
  const queryClient = useQueryClient();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [password, setPassword] = useState(emptyPassword);
  const [fieldErrors, setFieldErrors] = useState({});
  const [profileNotice, setProfileNotice] = useState(null);
  const [passwordNotice, setPasswordNotice] = useState(null);

  const profileQuery = useQuery({
    queryKey: ["account-profile"],
    queryFn: () => profileService.getProfile(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  useEffect(() => {
    if (!profileQuery.data) return;

    const user = responseData(profileQuery.data);

    setProfile({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      email: user.email ?? "",
    });
  }, [profileQuery.data]);

  const updateProfile = useMutation({
    mutationFn: (payload) => profileService.updateProfile(payload),

    onSuccess: (response) => {
      const updatedUser = responseData(response);

      setProfile((current) => ({
        ...current,
        firstName: updatedUser.firstName ?? current.firstName,
        lastName: updatedUser.lastName ?? current.lastName,
        phone: updatedUser.phone ?? current.phone,
      }));

      if (updatedUser.firstName || updatedUser.email) {
        setUser?.(updatedUser);
      }

      setFieldErrors({});
      setProfileNotice({
        error: false,
        text: "Your personal information has been updated.",
      });

      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
      queryClient.invalidateQueries({ queryKey: ["account-dashboard"] });
    },

    onError: (error) => {
      setProfileNotice({
        error: true,
        text: errorMessage(error),
      });
    },
  });

  const updatePassword = useMutation({
    mutationFn: (payload) => profileService.changePassword(payload),

    onSuccess: () => {
      setPassword(emptyPassword);
      setPasswordNotice({
        error: false,
        text: "Your password has been changed successfully.",
      });
    },

    onError: (error) => {
      setPasswordNotice({
        error: true,
        text: errorMessage(error),
      });
    },
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

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setProfileNotice(null);
  }

  function handleProfileSubmit(event) {
    event.preventDefault();

    const firstName = profile.firstName.trim();
    const lastName = profile.lastName.trim();
    const phone = profile.phone.trim();
    const errors = {};

    if (!firstName) errors.firstName = "First name is required.";
    if (!lastName) errors.lastName = "Last name is required.";

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      errors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    setFieldErrors(errors);
    setProfileNotice(null);

    if (Object.keys(errors).length) return;

    updateProfile.mutate({ firstName, lastName, phone });
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordNotice(null);

    const { currentPassword, newPassword, confirmPassword } = password;

    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[@$!%*?&]/.test(newPassword)
    ) {
      setPasswordNotice({
        error: true,
        text: "Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character (@$!%*?&).",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordNotice({
        error: true,
        text: "Your new password must differ from your current password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({
        error: true,
        text: "The new password and confirmation do not match.",
      });
      return;
    }

    updatePassword.mutate({
      currentPassword,
      newPassword,
      confirmPassword,
    });
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-16">
      <InnerPageHeader
        eyebrow="CUSTOMER ACCOUNT"
        title="Personal Information"
        description="Manage your personal details and account security."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "My Account", to: "/account" },
          { label: "Personal Information" },
        ]}
      />

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C62E0] hover:text-[#1F49B8]"
        >
          <ArrowLeft size={16} />
          Back to My Account
        </Link>

        {profileQuery.isPending ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[#2C62E0]" />
            <p className="mt-4 text-sm text-slate-500">
              Loading your profile...
            </p>
          </div>
        ) : profileQuery.isError ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-[#0E1A3D]">
              Unable to load your profile
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {errorMessage(profileQuery.error)}
            </p>
            <button
              onClick={() => profileQuery.refetch()}
              className="mt-5 rounded-xl bg-[#2C62E0] px-5 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <header className="flex items-center gap-4 border-b border-slate-100 p-5 sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2C62E0]">
                  <UserRound size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0E1A3D]">
                    Personal details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update your name and contact information.
                  </p>
                </div>
              </header>

              <form
                onSubmit={handleProfileSubmit}
                className="space-y-6 p-5 sm:p-7"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="First name"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    placeholder="Enter your first name"
                    error={fieldErrors.firstName}
                  />

                  <Field
                    label="Last name"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    placeholder="Enter your last name"
                    error={fieldErrors.lastName}
                  />

                  <Field
                    label="Mobile number"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="10-digit mobile number"
                    error={fieldErrors.phone}
                  />

                  <Field
                    label="Email address"
                    name="email"
                    value={profile.email}
                    readOnly
                  />
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  Your email is read-only because email changes are not
                  supported by the current profile API.
                </p>

                {profileNotice && (
                  <Notice error={profileNotice.error}>
                    {profileNotice.error ? null : (
                      <CheckCircle2 className="mr-2 inline" size={17} />
                    )}
                    {profileNotice.text}
                  </Notice>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const user = responseData(profileQuery.data);

                      setProfile({
                        firstName: user.firstName ?? "",
                        lastName: user.lastName ?? "",
                        phone: user.phone ?? "",
                        email: user.email ?? "",
                      });

                      setFieldErrors({});
                      setProfileNotice(null);
                    }}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-[#0E1A3D] hover:bg-slate-50"
                  >
                    Reset changes
                  </button>

                  <button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2C62E0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1F49B8] disabled:opacity-60"
                  >
                    {updateProfile.isPending ? (
                      <RefreshCw size={17} className="animate-spin" />
                    ) : (
                      <Save size={17} />
                    )}
                    {updateProfile.isPending ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <header className="flex items-center gap-4 border-b border-slate-100 p-5 sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2C62E0]">
                  <LockKeyhole size={23} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0E1A3D]">
                    Change password
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </header>

              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-5 p-5 sm:p-7"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <PasswordField
                    label="Current password"
                    name="currentPassword"
                    value={password.currentPassword}
                    onChange={(e) => {
                      setPassword((p) => ({ ...p, [e.target.name]: e.target.value }));
                      setPasswordNotice(null);
                    }}
                  />

                  <div className="hidden md:block" />

                  <PasswordField
                    label="New password"
                    name="newPassword"
                    value={password.newPassword}
                    onChange={(e) => {
                      setPassword((p) => ({ ...p, [e.target.name]: e.target.value }));
                      setPasswordNotice(null);
                    }}
                  />

                  <PasswordField
                    label="Confirm new password"
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={(e) => {
                      setPassword((p) => ({ ...p, [e.target.name]: e.target.value }));
                      setPasswordNotice(null);
                    }}
                  />
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-[#F6F8FC] p-4">
                  <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#2C62E0]" />
                  <p className="text-xs leading-5 text-slate-600">
                    Minimum 8 characters, including uppercase and lowercase
                    letters, a number, and a special character: @$!%*?&.
                  </p>
                </div>

                {passwordNotice && (
                  <Notice error={passwordNotice.error}>
                    {passwordNotice.error ? null : (
                      <CheckCircle2 className="mr-2 inline" size={17} />
                    )}
                    {passwordNotice.text}
                  </Notice>
                )}

                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    disabled={updatePassword.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E1A3D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16234A] disabled:opacity-60 sm:w-auto"
                  >
                    {updatePassword.isPending ? (
                      <RefreshCw size={17} className="animate-spin" />
                    ) : (
                      <LockKeyhole size={17} />
                    )}
                    {updatePassword.isPending
                      ? "Updating password..."
                      : "Update password"}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
