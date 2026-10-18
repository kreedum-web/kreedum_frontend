import { useEffect, useState } from "react";
import {  X } from "lucide-react";

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

 
  if (!profileChecked || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E1A3D]/55 p-3 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="birthday-popup-title"
        className="relative w-full max-w-xs overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Remind me later"
          className="absolute right-2 top-2 rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <X size={17} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-3 p-4">
          <div className="pr-6">
            <h2
              id="birthday-popup-title"
              className="text-lg font-bold text-[#0E1A3D]"
            >
              When’s your birthday?
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Get a little something special from Kreedum.
            </p>
          </div>

          <div>
            <label
              htmlFor="customer-birthday"
              className="mb-1 block text-xs font-semibold text-[#0E1A3D]"
            >
              Birthday
            </label>

            <input
              id="customer-birthday"
              name="birthday"
              type="date"
              value={birthday}
              max={`${new Date().getFullYear()}-${String(
                new Date().getMonth() + 1
              ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`}
              onChange={(event) => {
                setBirthday(event.target.value);
                setError("");
              }}
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "birthday-error" : "birthday-help"}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0E1A3D] outline-none focus:border-[#2C62E0] focus:ring-2 focus:ring-blue-100"
            />

            {error && (
              <p id="birthday-error" role="alert" className="mt-1 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || !birthday}
            className="w-full rounded-lg bg-[#2C62E0] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#1F49B8] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save birthday"}
          </button>

          <button
            type="button"
            onClick={dismiss}
            className="w-full py-1 text-xs font-medium text-slate-500 hover:text-[#0E1A3D]"
          >
            Remind me in 7 days
          </button>
        </form>
      </section>
    </div>
  );
}

