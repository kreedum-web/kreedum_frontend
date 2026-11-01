import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, MailCheck } from "lucide-react";

import AuthLayout from "@/layouts/AuthLayout";
import { authService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/common";
import { COLORS } from "@/config/theme";
import { afterLoginPath } from "@/utils/afterLogin";

const RESEND_SECONDS = 60;
const apiError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

/**
 * Forgot password:
 *   1. email -> a 6-digit code is emailed
 *   2. code + new password -> password changed and signed in
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function sendCode() {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError("Enter the email address you use for Kreedum Sports.");
      return false;
    }
    try {
      setLoading(true);
      await authService.forgotPassword({ email: normalized });
      setEmail(normalized);
      setCooldown(RESEND_SECONDS);
      return true;
    } catch (err) {
      const retryAfter = err?.response?.data?.retryAfter;
      if (retryAfter) setCooldown(retryAfter);
      setError(apiError(err, "Couldn't send the code. Please try again."));
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setError("");
    if (await sendCode()) setStep("reset");
  }

  async function handleResend() {
    setError("");
    setNotice("");
    if (await sendCode()) setNotice("A new code is on its way.");
  }

  async function handleResetSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from the email.");
      return;
    }
    if (password.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword({ email, code, password });
      const result = response?.data?.data;
      if (!result?.token || !result?.user) throw new Error("Unexpected response. Please try again.");
      login(result.token, result.user);
      navigate(afterLoginPath(location), { replace: true });
    } catch (err) {
      setError(apiError(err, "Couldn't change your password. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  const errorBox = error && (
    <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </div>
  );

  return (
    <AuthLayout
      title={step === "email" ? "Forgot password?" : "Set a new password"}
      subtitle={
        step === "email"
          ? "Enter your email and we'll send you a 6-digit code to reset your password."
          : "Enter the code from the email and choose a new password."
      }
    >
      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-3" noValidate>
          <Input
            id="forgot-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            required
          />
          {errorBox}
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="min-h-12 rounded-xl">
            {loading ? "Sending..." : "Send code"}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="space-y-3" noValidate>
          <div className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: COLORS.tint, color: COLORS.navy }}>
            <MailCheck size={20} className="mt-0.5 shrink-0" style={{ color: COLORS.blue }} />
            <p>
              If an account exists for <strong className="break-all">{email}</strong>, we've sent it a 6-digit code. It
              expires in 10 minutes. Check the spam folder too.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reset-code" className="text-sm font-semibold" style={{ color: COLORS.navy }}>
              Code
            </label>
            <input
              id="reset-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
              placeholder="••••••"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={loading}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:border-[#2C62E0] focus:outline-none focus:ring-2 focus:ring-[#EAF0FF]"
              style={{ color: COLORS.navy }}
            />
          </div>

          <div className="relative">
            <Input
              id="reset-password"
              name="password"
              label="New password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-[38px] flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[#EAF0FF]"
              style={{ color: COLORS.slate }}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <Input
            id="reset-confirm"
            name="confirmPassword"
            label="Confirm new password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Type it again"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
          />

          {errorBox}
          {notice && (
            <div role="status" className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: COLORS.tint, color: COLORS.blueDark }}>
              {notice}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="min-h-12 rounded-xl">
            {loading ? "Saving..." : "Change password"}
            {!loading && <ArrowRight size={18} />}
          </Button>

          <div className="flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              className="font-semibold hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
              style={{ color: COLORS.blue }}
            >
              {cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
                setNotice("");
                setCode("");
              }}
              className="font-semibold hover:underline"
              style={{ color: COLORS.slate }}
            >
              Change email
            </button>
          </div>
        </form>
      )}

      <div className="mt-3 text-center text-sm" style={{ color: COLORS.slate }}>
        Remembered it?{" "}
        <Link to="/login" state={location.state} className="font-bold hover:underline" style={{ color: COLORS.blue }}>
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
