import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { authService } from "@/api";
import { Button, Input } from "@/components/common";
import { COLORS } from "@/config/theme";

/**
 * Shown once, right after creating an account. Skipping is fine: the site then
 * shows the email / number, and the name on the first delivery address is used.
 * onDone(updatedUser | null)
 */
export default function NameStep({ onDone }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(event) {
    event.preventDefault();
    setError("");
    if (!firstName.trim()) {
      setError("Enter your first name, or skip for now.");
      return;
    }
    try {
      setSaving(true);
      const response = await authService.updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
      onDone(response?.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save your name. You can add it later in your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-3" noValidate>
      <div className="grid grid-cols-2 gap-2.5">
        <Input
          id="first-name"
          label="First name"
          autoComplete="given-name"
          placeholder="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          disabled={saving}
          autoFocus
        />
        <Input
          id="last-name"
          label="Last name"
          autoComplete="family-name"
          placeholder="Optional"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          disabled={saving}
        />
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" fullWidth loading={saving} className="min-h-12 rounded-xl">
        {saving ? "Saving..." : "Save and continue"}
        {!saving && <ArrowRight size={18} />}
      </Button>
      <button
        type="button"
        onClick={() => onDone(null)}
        disabled={saving}
        className="block w-full py-1 text-center text-sm font-semibold hover:underline"
        style={{ color: COLORS.slate }}
      >
        Skip for now
      </button>
    </form>
  );
}
