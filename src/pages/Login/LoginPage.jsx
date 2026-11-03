import { useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, KeyRound } from "lucide-react";

import AuthLayout from "@/layouts/AuthLayout";
import { authService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/common";
import { COLORS } from "@/config/theme";
import EmailCodeForm from "@/components/auth/EmailCodeForm";
import GoogleButton from "@/components/auth/GoogleButton";
import PasswordInput from "@/components/auth/PasswordInput";
import CodeInput from "@/components/auth/CodeInput";
import { useAuthOptions } from "@/hooks/useAuthOptions";
import { afterLoginPath } from "@/utils/afterLogin";
import { confirmFirebaseOtp, sendFirebaseOtp } from "@/utils/firebasePhone";
import NameStep from "./NameStep";

const MIN_PASSWORD = 8;
const apiError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
const showId = (id) => (id?.type === "phone" ? `+91 ${id.value.slice(0, 5)} ${id.value.slice(5)}` : id?.value || "");

/**
 * One page to sign in or create an account (/login and /register).
 *
 *   1. Email or mobile number → we check whether it's already a customer.
 *   2a. Existing account → password → signed in. No code is sent.
 *   2b. New → choose a password → ONE code (email or SMS) proves it's theirs →
 *       account created → "What should we call you?" (can be skipped).
 *   2c. Existing account without a password (made with Google or an older
 *       code-only sign-in), or "Forgot password?" → code → new password.
 *
 * The email / number used here is the account's only way to sign in; phone
 * and email typed in delivery addresses are just for deliveries.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, setUser } = useAuth();
  const { googleClientId, phoneProvider, firebaseConfig } = useAuthOptions();

  // start · password · create · verify-email · phone-code · needs-password · reset · name
  const [step, setStep] = useState("start");
  const [identifier, setIdentifier] = useState(location.state?.identifier || location.state?.email || "");
  const [account, setAccount] = useState(null); // { type, value, exists, hasPassword }
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [googleFailed, setGoogleFailed] = useState(false);
  const confirmation = useRef(null); // Firebase: checks the SMS code

  // Already signed in (and not in the middle of the name step): nothing to do here.
  if (isAuthenticated && step !== "name") return <Navigate to={afterLoginPath(location)} replace />;

  const go = (next) => {
    setError("");
    setNotice("");
    setCode("");
    setStep(next);
  };

  async function run(action, fallback) {
    setError("");
    setNotice("");
    try {
      setLoading(true);
      await action();
    } catch (err) {
      setError(apiError(err, fallback));
    } finally {
      setLoading(false);
    }
  }

  /** Signed in: new accounts get the name step, everyone else goes back to where they were. */
  function finish(result) {
    if (!result?.token || !result?.user) throw new Error("Unexpected response. Please try again.");
    if (result.isNew) {
      setStep("name"); // before login(), so the page doesn't redirect away
      login(result.token, result.user);
      return;
    }
    login(result.token, result.user);
    navigate(afterLoginPath(location), { replace: true });
  }

  const dataOf = (response) => response?.data?.data;

  // ---------- step 1
  const submitIdentifier = (event) => {
    event.preventDefault();
    run(async () => {
      if (!identifier.trim()) throw new Error("Enter your email address or mobile number.");
      const found = dataOf(await authService.identify({ identifier }));
      setAccount(found);
      setPassword("");
      setConfirm("");
      if (found.exists) {
        go(found.hasPassword ? "password" : "needs-password");
      } else if (found.type === "phone" && !phoneProvider) {
        throw new Error("Creating an account with a mobile number isn't available yet. Please use your email.");
      } else {
        go("create");
      }
    }, "Something went wrong. Please try again.");
  };

  // ---------- SMS (Firebase now, our own SMS provider later)
  async function sendSms() {
    if (phoneProvider === "firebase") {
      confirmation.current = await sendFirebaseOtp(firebaseConfig, account.value);
    } else if (phoneProvider === "sms") {
      await authService.startPhoneCode({ phone: account.value });
    } else {
      throw new Error("SMS codes aren't available right now. Please contact us for help.");
    }
  }

  /** The SMS code → proof for the backend. */
  async function phoneProof() {
    if (phoneProvider === "firebase") return { idToken: await confirmFirebaseOtp(confirmation.current, code) };
    return { phone: account.value, code };
  }

  // ---------- password (existing account)
  const submitPassword = (event) => {
    event.preventDefault();
    run(async () => {
      if (!password) throw new Error("Enter your password.");
      try {
        finish(dataOf(await authService.login({ identifier: account.value, password })));
      } catch (err) {
        const reason = err?.response?.data?.code;
        if (reason === "NO_PASSWORD") return go("needs-password");
        if (reason === "EMAIL_NOT_VERIFIED") return go("verify-email");
        throw err;
      }
    }, "Couldn't sign in. Please try again.");
  };

  // ---------- create (new account)
  const submitCreate = (event) => {
    event.preventDefault();
    run(async () => {
      if (password.length < MIN_PASSWORD) throw new Error(`Your password needs at least ${MIN_PASSWORD} characters.`);
      if (password !== confirm) throw new Error("The two passwords don't match.");
      if (account.type === "email") {
        await authService.register({ email: account.value, password });
        go("verify-email");
      } else {
        await sendSms();
        go("phone-code");
      }
    }, "Couldn't send the code. Please try again.");
  };

  const submitPhoneCode = (event) => {
    event.preventDefault();
    run(async () => {
      if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code from the SMS.");
      finish(dataOf(await authService.registerPhone({ ...(await phoneProof()), password })));
    }, "That code didn't work. Please try again.");
  };

  // ---------- set / reset password
  const sendResetCode = () =>
    run(async () => {
      if (account.type === "email") await authService.forgotPassword({ email: account.value });
      else await sendSms();
      setPassword("");
      setConfirm("");
      go("reset");
      setNotice(account.type === "email" ? "We've emailed you a 6-digit code." : "We've sent you a 6-digit code by SMS.");
    }, "Couldn't send the code. Please try again.");

  const submitReset = (event) => {
    event.preventDefault();
    run(async () => {
      if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");
      if (password.length < MIN_PASSWORD) throw new Error(`Your password needs at least ${MIN_PASSWORD} characters.`);
      if (password !== confirm) throw new Error("The two passwords don't match.");
      const response =
        account.type === "email"
          ? await authService.resetPassword({ email: account.value, code, password })
          : await authService.resetPasswordWithPhone({ ...(await phoneProof()), password });
      finish(dataOf(response));
    }, "Couldn't save the password. Please try again.");
  };

  const handleGoogle = (credential) =>
    run(async () => finish(dataOf(await authService.googleLogin({ credential }))), "Google sign-in failed. Please try again.");

  // ---------- pieces
  const alerts = (
    <>
      {error && (
        <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: COLORS.tint, color: COLORS.blueDark }}>
          {notice}
        </div>
      )}
    </>
  );

  const submit = (label, busyLabel) => (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      fullWidth
      loading={loading}
      className="min-h-12 rounded-xl shadow-md shadow-[#2C62E0]/15 hover:brightness-105"
    >
      {loading ? busyLabel : label}
      {!loading && <ArrowRight size={18} />}
    </Button>
  );

  const changeIdentifier = (
    <button
      type="button"
      onClick={() => go("start")}
      className="flex w-full items-center justify-center gap-2 py-1 text-sm font-semibold hover:underline"
      style={{ color: COLORS.slate }}
    >
      <ArrowLeft size={15} />
      Use a different email or number
    </button>
  );

  const passwordPair = (labelFirst) => (
    <>
      <PasswordInput
        id="new-password"
        label={labelFirst}
        autoComplete="new-password"
        placeholder={`At least ${MIN_PASSWORD} characters`}
        value={password}
        onChange={setPassword}
        disabled={loading}
      />
      <PasswordInput
        id="confirm-password"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Type it again"
        value={confirm}
        onChange={setConfirm}
        disabled={loading}
      />
    </>
  );

  // ---------- steps
  if (step === "name") {
    return (
      <AuthLayout title="What should we call you?" subtitle="Add your name, or skip for now. You can change it later in your profile.">
        <NameStep
          onDone={(updated) => {
            if (updated) setUser((current) => ({ ...current, ...updated }));
            navigate(afterLoginPath(location), { replace: true });
          }}
        />
      </AuthLayout>
    );
  }

  if (step === "password") {
    return (
      <AuthLayout title="Welcome back" subtitle={`Enter the password for ${showId(account)}.`}>
        <form onSubmit={submitPassword} className="space-y-3" noValidate>
          {/* Lets password managers save the right username. */}
          <input type="text" name="username" autoComplete="username" value={account.value} readOnly hidden />
          <PasswordInput id="password" label="Password" value={password} onChange={setPassword} disabled={loading} autoFocus />
          {alerts}
          {submit("Sign in", "Signing in...")}
          <button
            type="button"
            onClick={sendResetCode}
            disabled={loading}
            className="block w-full py-1 text-center text-sm font-semibold hover:underline"
            style={{ color: COLORS.blue }}
          >
            Forgot password?
          </button>
          {changeIdentifier}
        </form>
      </AuthLayout>
    );
  }

  if (step === "create") {
    return (
      <AuthLayout
        title="Create your account"
        subtitle={`Choose a password for ${showId(account)}. We'll send one code to confirm it's yours.`}
      >
        <form onSubmit={submitCreate} className="space-y-3" noValidate>
          <input type="text" name="username" autoComplete="username" value={account.value} readOnly hidden />
          {passwordPair("Create password")}
          {alerts}
          {submit(account.type === "email" ? "Create account" : "Send code by SMS", "Sending code...")}
          {changeIdentifier}
        </form>
      </AuthLayout>
    );
  }

  if (step === "verify-email") {
    return (
      <AuthLayout title="Check your email" subtitle="Enter the code to finish creating your account.">
        <EmailCodeForm
          email={account.value}
          submitLabel="Create account"
          verify={(entered) => authService.verifyEmail({ email: account.value, code: entered })}
          resend={() => authService.resendCode({ email: account.value })}
          onVerified={finish}
          onChangeEmail={() => go("start")}
        />
      </AuthLayout>
    );
  }

  if (step === "phone-code") {
    return (
      <AuthLayout title="Check your SMS" subtitle={`We've sent a 6-digit code to ${showId(account)}.`}>
        <form onSubmit={submitPhoneCode} className="space-y-3" noValidate>
          <CodeInput value={code} onChange={setCode} disabled={loading} />
          {alerts}
          {submit("Create account", "Checking...")}
          <button
            type="button"
            onClick={() =>
              run(async () => {
                await sendSms();
                setNotice("A new code is on its way.");
              }, "Couldn't send a new code.")
            }
            disabled={loading}
            className="block w-full py-1 text-center text-sm font-semibold hover:underline"
            style={{ color: COLORS.blue }}
          >
            Send a new code
          </button>
          {changeIdentifier}
        </form>
      </AuthLayout>
    );
  }

  if (step === "needs-password") {
    return (
      <AuthLayout
        title="Set a password"
        subtitle={`Your account for ${showId(account)} doesn't have a password yet. We'll send a code to confirm it's you, then you choose one.`}
      >
        <div className="space-y-3">
          {alerts}
          <Button
            type="button"
            onClick={sendResetCode}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="min-h-12 rounded-xl"
          >
            {loading ? "Sending code..." : account.type === "email" ? "Email me a code" : "Send code by SMS"}
            {!loading && <ArrowRight size={18} />}
          </Button>
          {account.googleLinked && googleClientId && !googleFailed && (
            <>
              <p className="text-center text-xs" style={{ color: COLORS.slate }}>
                Or continue with Google, as you did before:
              </p>
              <GoogleButton clientId={googleClientId} onCredential={handleGoogle} onError={() => setGoogleFailed(true)} disabled={loading} />
            </>
          )}
          {changeIdentifier}
        </div>
      </AuthLayout>
    );
  }

  if (step === "reset") {
    return (
      <AuthLayout title="Set a new password" subtitle={`Enter the code we sent to ${showId(account)} and choose a password.`}>
        <form onSubmit={submitReset} className="space-y-3" noValidate>
          <input type="text" name="username" autoComplete="username" value={account.value} readOnly hidden />
          <CodeInput value={code} onChange={setCode} disabled={loading} />
          {passwordPair("New password")}
          {alerts}
          {submit("Save password and sign in", "Saving...")}
          <button
            type="button"
            onClick={sendResetCode}
            disabled={loading}
            className="block w-full py-1 text-center text-sm font-semibold hover:underline"
            style={{ color: COLORS.blue }}
          >
            Send a new code
          </button>
          {changeIdentifier}
        </form>
      </AuthLayout>
    );
  }

  // ---------- start
  return (
    <AuthLayout
      title="Sign in or create account"
      subtitle={phoneProvider ? "Enter your email or mobile number to continue." : "Enter your email to continue."}
    >
      <div className="space-y-4">
        {googleClientId && !googleFailed && (
          <>
            <GoogleButton clientId={googleClientId} onCredential={handleGoogle} onError={() => setGoogleFailed(true)} disabled={loading} />
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.slateLight }}>
              <span className="h-px flex-1 bg-[#E5E9F2]" />
              or
              <span className="h-px flex-1 bg-[#E5E9F2]" />
            </div>
          </>
        )}

        <form onSubmit={submitIdentifier} className="space-y-3" noValidate>
          <Input
            id="identifier"
            name="username"
            label={phoneProvider ? "Email or mobile number" : "Email address"}
            type="text"
            autoComplete="username"
            placeholder={phoneProvider ? "you@example.com or 98765 43210" : "you@example.com"}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            disabled={loading}
            autoFocus={!googleClientId || googleFailed}
          />
          {alerts}
          {submit("Continue", "Checking...")}
        </form>

        <p className="flex items-start justify-center gap-2 text-center text-xs leading-5" style={{ color: COLORS.slate }}>
          <KeyRound size={14} className="mt-0.5 shrink-0" />
          Returning customers sign in with their password. New here? We'll help you create an account.
        </p>
      </div>
    </AuthLayout>
  );
}
