import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, KeyRound, Mail } from "lucide-react";

import AuthLayout from "@/layouts/AuthLayout";
import { authService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/common";
import { COLORS } from "@/config/theme";
import EmailCodeForm from "@/components/auth/EmailCodeForm";
import GoogleButton from "@/components/auth/GoogleButton";
import { useAuthOptions } from "@/hooks/useAuthOptions";
import { afterLoginPath } from "@/utils/afterLogin";
import LoginForm from "./LoginForm";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const apiError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

/**
 * One page for signing in AND creating an account:
 *   - Continue with Google, or
 *   - enter an email → 6-digit code → signed in (account made the first time).
 * Accounts that have a password can still use it ("Sign in with password").
 * Name, phone and address are asked at checkout, not here.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { googleClientId } = useAuthOptions();

  // start: Google + email · code: enter the emailed code · password: old-style login
  const [step, setStep] = useState("start");
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
      <AuthLayout title="Check your email" subtitle="Enter the code to continue. New here? Your account is created automatically.">
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
      subtitle="Use Google or your email. No password needed."
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
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.slateLight }}>
              <span className="h-px flex-1 bg-[#E5E9F2]" />
              or
              <span className="h-px flex-1 bg-[#E5E9F2]" />
            </div>
          </>
        )}

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

        <p className="text-center text-xs leading-5" style={{ color: COLORS.slate }}>
          We'll email you a 6-digit code. Your name and address are asked only when you check out.
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
