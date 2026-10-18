import { useEffect, useState } from "react";
import { Cake, CalendarDays, X } from "lucide-react";

import { authService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";

const SNOOZE_DAYS = 7;
const SNOOZE_MS = SNOOZE_DAYS * 24 * 60 * 60 * 1000;

function responseData(response) {
  return response?.data?.data ?? response?.data?.user ?? response?.data ?? {};
}

function getSnoozeKey(user) {
  const id = user?.id ?? user?._id ?? user?.email;
  return id ? `kreedum_birthday_dismissed_until:${id}` : null;
}

function isValidPastOrTodayDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return false;

  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() <= today;
}

export default function BirthdayPopup() {
  const { user, token, isAuthenticated, loading: authLoading, setUser } = useAuth();
  const [profileChecked, setProfileChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    let timer;

    async function checkBirthday() {
      setProfileChecked(false);
      setOpen(false);
      setError("");

      if (authLoading || !isAuthenticated || !token || user?.role === "admin") {
        if (active) setProfileChecked(true);
        return;
      }

      const snoozeKey = getSnoozeKey(user);
      const dismissedUntil = snoozeKey
        ? Number(localStorage.getItem(snoozeKey) || 0)
        : 0;

      try {
        const response = await authService.getCurrentUser();
        const profile = responseData(response);
        if (!active) return;

        setUser?.({ ...user, ...profile });

        if (profile.birthday || dismissedUntil > Date.now()) return;

// Wait 5 seconds before showing the popup
timer = setTimeout(() => {
  if (active) {
    setOpen(true);
  }
}, 5000);
      } catch (requestError) {
        // Do not show the prompt unless the authenticated profile was checked.
        console.error("Could not check customer birthday.", requestError);
      } finally {
        if (active) setProfileChecked(true);
      }
    }

    checkBirthday();
    return () => {
  active = false;
  clearTimeout(timer);
};
  }, [authLoading, isAuthenticated, token, user?.id, user?._id, user?.email, user?.role, setUser]);

  function dismiss() {
    const key = getSnoozeKey(user);
    if (key) localStorage.setItem(key, String(Date.now() + SNOOZE_MS));
    setOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isValidPastOrTodayDate(birthday)) {
      setError("Enter a valid birthday that is not in the future.");
      return;
    }

    try {
      setSaving(true);
      const response = await authService.updateProfile({ birthday });
      const updatedProfile = responseData(response);
      setUser?.((current) => ({ ...(current || {}), ...updatedProfile, birthday }));
      setOpen(false);
      const key = getSnoozeKey(user);
      if (key) localStorage.removeItem(key);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "We couldn't save your birthday. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!profileChecked || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E1A3D]/55 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="birthday-popup-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#EAF0FF] via-white to-[#F6F8FC] px-6 pb-5 pt-7 sm:px-8">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Remind me later"
            className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-[#0E1A3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C62E0]"
          >
            <X size={19} />
          </button>
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2C62E0] text-white shadow-lg shadow-blue-200">
            <Cake size={27} strokeWidth={1.8} />
          </div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#2C62E0]">
            A LITTLE SOMETHING FOR YOU
          </p>
          <h2 id="birthday-popup-title" className="mt-2 text-2xl font-extrabold tracking-tight text-[#0E1A3D] sm:text-3xl">
            When’s your birthday?
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#4B5568]">
            Share your special day with us. We’d love to make your birthday a little more memorable.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-7 pt-5 sm:px-8">
          <label htmlFor="customer-birthday" className="block text-sm font-bold text-[#0E1A3D]">
            Birthday
          </label>
          <div className="relative">
            <CalendarDays size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A93A6]" />
            <input
              id="customer-birthday"
              name="birthday"
              type="date"
              value={birthday}
              max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`}
              onChange={(event) => {
                setBirthday(event.target.value);
                setError("");
              }}
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "birthday-error" : "birthday-help"}
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-[#0E1A3D] outline-none transition focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {error ? (
            <p id="birthday-error" role="alert" className="text-sm text-red-600">{error}</p>
          ) : (
            <p id="birthday-help" className="text-xs leading-5 text-slate-500">
              Your birthday is saved securely to your Kreedum account.
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !birthday}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C62E0] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200/60 transition hover:bg-[#1F49B8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving birthday..." : "Save my birthday"}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="w-full rounded-xl px-5 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-[#0E1A3D]"
          >
            Remind me in 7 days
          </button>
        </form>
      </section>
    </div>
  );
}
