import { useEffect, useState } from "react";
import { ArrowRight, MailCheck } from "lucide-react";

import { authService } from "@/api";
import { Button } from "@/components/common";
import { COLORS } from "@/config/theme";

const RESEND_SECONDS = 60;

const apiError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

/**
 * "Enter the 6-digit code we emailed you". The code has just been sent when
 * this shows.
 *
 * verify(code) and resend() call the backend; by default they finish an
 * old-style sign-up (verify-email / resend-code). The sign-in page passes
 * the email-code sign-in calls instead.
 * onVerified({ token, user, isNew }) is called once the code is accepted.
 */
export default function EmailCodeForm({
  email,
  onVerified,
  onChangeEmail,
  verify = (code) => authService.verifyEmail({ email, code }),
  resend = () => authService.resendCode({ email }),
  submitLabel = "Verify email",
  // Replaces the "We've sent a code to <email>" text (e.g. for an SMS code).
  message,
  changeLabel = "Change email",
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from the email.");
      return;
    }

    try {
      setLoading(true);
      const response = await verify(code);
      const result = response?.data?.data;
      if (!result?.token || !result?.user) throw new Error("Unexpected response. Please try again.");
      onVerified(result);
    } catch (err) {
      setError(apiError(err, "That code didn't work. Please try again."));
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    try {
      await resend();
      setNotice(message ? "A new code is on its way." : "A new code is on its way. Check your inbox (and the spam folder).");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      const retryAfter = err?.response?.data?.retryAfter;
      if (retryAfter) setCooldown(retryAfter);
      setError(apiError(err, "Couldn't send a new code. Please try again."));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: COLORS.tint, color: COLORS.navy }}>
        <MailCheck size={20} className="mt-0.5 shrink-0" style={{ color: COLORS.blue }} />
        {message || (
          <p>
            We've sent a 6-digit code to <strong className="break-all">{email}</strong>. It expires in 10 minutes.
            Can't find it? Check the spam folder.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email-code" className="text-sm font-semibold" style={{ color: COLORS.navy }}>
          6-digit code
        </label>
        <input
          id="email-code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
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

      <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="min-h-12 rounded-xl">
        {loading ? "Checking..." : submitLabel}
        {!loading && <ArrowRight size={18} />}
      </Button>

      <div className="flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="font-semibold hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
          style={{ color: COLORS.blue }}
        >
          {cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
        </button>
        {onChangeEmail && (
          <button type="button" onClick={onChangeEmail} className="font-semibold hover:underline" style={{ color: COLORS.slate }}>
            {changeLabel}
          </button>
        )}
      </div>
    </form>
  );
}
