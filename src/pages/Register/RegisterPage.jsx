
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

import AuthLayout from "@/layouts/AuthLayout";
import { authService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/common";
import { COLORS } from "@/config/theme";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !form.firstName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      const result = response?.data?.data;
      const token = result?.token;
      const user = result?.user;

      if (!token || !user) {
        throw new Error(
          "The server returned an unexpected registration response."
        );
      }

      login(token, user);

      const requestedPath = location.state?.from;
      const destination =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldProps = {
    onChange: updateField,
    disabled: loading,
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Kreedum Sports and manage your shopping."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-2.5"
        noValidate
      >
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-2.5">
          <Input
            label="First name *"
            name="firstName"
            autoComplete="given-name"
            placeholder="First name"
            value={form.firstName}
            required
            {...fieldProps}
          />

          <Input
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            placeholder="Last name"
            value={form.lastName}
            {...fieldProps}
          />
        </div>

        <Input
          label="Email address *"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={form.email}
          required
          {...fieldProps}
        />

        <Input
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="Phone number"
          value={form.phone}
          {...fieldProps}
        />

        {/* Password */}
        <div className="relative">
          <Input
            label="Password *"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            required
            className="pr-11"
            {...fieldProps}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            disabled={loading}
            className="absolute right-1.5 top-[30px] flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#EAF0FF]"
            style={{ color: COLORS.slate }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm password *"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            required
            className="pr-11"
            {...fieldProps}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showConfirmPassword}
            disabled={loading}
            className="absolute right-1.5 top-[30px] flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#EAF0FF]"
            style={{ color: COLORS.slate }}
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs leading-4 text-red-700"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={loading}
          className="min-h-11 rounded-xl shadow-md shadow-[#2C62E0]/15 hover:brightness-105"
        >
          {loading ? "Creating account..." : "Create account"}
          {!loading && <ArrowRight size={17} />}
        </Button>

        <p className="pt-1 text-center text-[11px] leading-4" style={{ color: COLORS.slateLight }}>
          By creating an account, you agree to use your account responsibly.
        </p>
      </form>

      <div
        className="mt-3 text-center text-sm"
        style={{ color: COLORS.slate }}
      >
        Already registered?{" "}
        <Link
          to="/login"
          className="font-bold hover:underline"
          style={{ color: COLORS.blue }}
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
