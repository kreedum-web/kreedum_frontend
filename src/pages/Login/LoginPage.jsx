import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, KeyRound, Mail, Smartphone } from "lucide-react";

import AuthLayout from "@/layouts/AuthLayout";
import { authService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/common";
import { COLORS } from "@/config/theme";
import EmailCodeForm from "@/components/auth/EmailCodeForm";
import GoogleButton from "@/components/auth/GoogleButton";
import { useAuthOptions } from "@/hooks/useAuthOptions";
import { afterLoginPath } from "@/utils/afterLogin";
import { confirmFirebaseOtp, sendFirebaseOtp } from "@/utils/firebasePhone";
import LoginForm from "./LoginForm";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
/** Typed or pasted "+91 98765 43210", "098765…" → "9876543210". */
function cleanPhoneInput(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

const apiError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

/**
 * One page for signing in AND creating an account:
 *   - Continue with Google, or
 *   - enter an email → 6-digit code → signed in (account made the first time), or
 *   - enter a mobile number → SMS code (Firebase, or our own SMS provider later).
 * Accounts that have a password can still use it ("Sign in with password").
 * Name, phone and address are asked at checkout, not here.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { googleClientId, phoneProvider, firebaseConfig } = useAuthOptions();

  // start: Google + email/phone · code: emailed code · phone-code: SMS code · password: old-style login
  const [step, setStep] = useState("start");
  const [method, setMethod] = useState("email"); // email | phone
  const [phone, setPhone] = useState("");
  // Firebase's confirmation for the SMS just sent (checks the code).
  const confirmation = useRef(null);
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Google's script couldn't load (blocked, offline): show only the email option.
  const [googleFailed, setGoogleFailed] = useState(false);

  function finish({ token, user }) {
    login(token, user);
    navigate(afterLoginPath(location), { replace: true });
  }

  async function sendCode(event) {
    event?.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      await authService.startEmailLogin({ email: normalized });
      setEmail(normalized);
      setStep("code");
    } catch (err) {
      // A code was sent less than a minute ago: it still works.
      if (err?.response?.data?.code === "CODE_COOLDOWN") {
        setEmail(normalized);
        setStep("code");
        return;
      }
      setError(apiError(err, "Couldn't send the code. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  // ---------- phone
  async function sendPhoneSms() {
    if (phoneProvider === "firebase") {
      confirmation.current = await sendFirebaseOtp(firebaseConfig, phone);
    } else {
      await authService.startPhoneLogin({ phone });
    }
  }

  async function sendPhoneCode(event) {
    event?.preventDefault();
    setError("");
    if (!PHONE_PATTERN.test(phone)) {
      setError("Enter your 10-digit mobile number.");
      return;
    }
    try {
      setLoading(true);
      await sendPhoneSms();
      setStep("phone-code");
    } catch (err) {
      if (err?.response?.data?.code === "CODE_COOLDOWN") {
        setStep("phone-code");
        return;
      }
      setError(apiError(err, "Couldn't send the SMS. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function verifyPhoneCode(code) {
    if (phoneProvider === "firebase") {
      const idToken = await confirmFirebaseOtp(confirmation.current, code);
      return authService.firebasePhoneLogin({ idToken });
    }
    return authService.verifyPhoneLogin({ phone, code });
  }

  async function handleGoogle(credential) {
    setError("");
    try {
      setLoading(true);
      const response = await authService.googleLogin({ credential });
      const result = response?.data?.data;
      if (!result?.token || !result?.user) throw new Error("Unexpected response. Please try again.");
      finish(result);
    } catch (err) {
      setError(apiError(err, "Google sign-in failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (step === "code") {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="Enter the code to continue. New here? Your account is created automatically."
      >
        <EmailCodeForm
          email={email}
          submitLabel="Continue"
          verify={(code) => authService.verifyEmailLogin({ email, code })}
          resend={() => authService.startEmailLogin({ email })}
          onVerified={finish}
          onChangeEmail={() => setStep("start")}
        />
      </AuthLayout>
    );
  }

  if (step === "phone-code") {
    return (
      <AuthLayout
        title="Check your SMS"
        subtitle="Enter the code to continue. New here? Your account is created automatically."
      >
        <EmailCodeForm
          email={phone}
          submitLabel="Continue"
          message={
            <p>
              We've sent a 6-digit code by SMS to{" "}
              <strong>
                +91 {phone.slice(0, 5)} {phone.slice(5)}
              </strong>
              . It may take a few seconds to arrive.
            </p>
          }
          changeLabel="Change number"
          verify={verifyPhoneCode}
          resend={sendPhoneSms}
          onVerified={finish}
          onChangeEmail={() => setStep("start")}
        />
      </AuthLayout>
    );
  }

  if (step === "password") {
    return (
      <AuthLayout title="Sign in with password" subtitle="For accounts that were created with a password.">
        <LoginForm
          initialEmail={email}
          onUseCode={(address) => {
            setEmail(address || email);
            setStep("start");
          }}
        />
        <button
          type="button"
          onClick={() => setStep("start")}
          className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: COLORS.blue }}
        >
          <Mail size={16} />
          Use an email code instead
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Sign in or create account"
      subtitle={`Use Google, your email${phoneProvider ? " or your mobile number" : ""}. No password needed.`}
    >
      <div className="space-y-4">
        {googleClientId && !googleFailed && (
          <>
            <GoogleButton
              clientId={googleClientId}
              onCredential={handleGoogle}
              onError={() => setGoogleFailed(true)}
              disabled={loading}
            />
            <div
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: COLORS.slateLight }}
            >
              <span className="h-px flex-1 bg-[#E5E9F2]" />
              or
              <span className="h-px flex-1 bg-[#E5E9F2]" />
            </div>
          </>
        )}

        {phoneProvider && (
          <div role="tablist" aria-label="Sign in with" className="grid grid-cols-2 gap-1 rounded-xl bg-[#F1F4FA] p-1">
            {[
              { id: "email", label: "Email", Icon: Mail },
              { id: "phone", label: "Mobile number", Icon: Smartphone },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={method === id}
                onClick={() => {
                  setError("");
                  setMethod(id);
                }}
                className={`flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
                  method === id ? "bg-white shadow-sm" : "hover:bg-white/60"
                }`}
                style={{ color: method === id ? COLORS.navy : COLORS.slate }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        )}

        {method === "phone" && phoneProvider ? (
          <form onSubmit={sendPhoneCode} className="space-y-3" noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="signin-phone" className="text-sm font-semibold" style={{ color: COLORS.navy }}>
                Mobile number
              </label>
              <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-[#2C62E0] focus-within:ring-2 focus-within:ring-[#EAF0FF]">
                <span
                  className="flex items-center border-r border-gray-200 bg-[#F6F8FC] px-3 text-sm font-semibold sm:text-base"
                  style={{ color: COLORS.navy }}
                >
                  +91
                </span>
                <input
                  id="signin-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(event) => setPhone(cleanPhoneInput(event.target.value))}
                  disabled={loading}
                  className="w-full px-3 py-2.5 text-sm outline-none sm:px-4 sm:py-3 sm:text-base"
                  style={{ fontFamily: '"Manrope", sans-serif', color: COLORS.navy }}
                />
              </div>
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="min-h-12 rounded-xl shadow-md shadow-[#2C62E0]/15 hover:brightness-105"
            >
              {loading ? "Sending SMS..." : "Send code by SMS"}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>
        ) : (
          <form onSubmit={sendCode} className="space-y-3" noValidate>
            <Input
              id="signin-email"
              name="email"
              label="Email address"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              autoFocus={!googleClientId || googleFailed}
            />

            {error && (
              <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="min-h-12 rounded-xl shadow-md shadow-[#2C62E0]/15 hover:brightness-105"
            >
              {loading ? "Sending code..." : "Continue with email"}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>
        )}

        <p className="text-center text-xs leading-5" style={{ color: COLORS.slate }}>
          {method === "phone" && phoneProvider
            ? "We'll send you a 6-digit code by SMS."
            : "We'll email you a 6-digit code."}{" "}
          Your name and address are asked only when you check out.
        </p>

        <button
          type="button"
          onClick={() => {
            setError("");
            setStep("password");
          }}
          className="flex w-full items-center justify-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: COLORS.slate }}
        >
          <KeyRound size={16} />
          Sign in with password
        </button>
      </div>
    </AuthLayout>
  );
}
