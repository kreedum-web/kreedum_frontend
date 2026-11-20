import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { enquiryService } from "@/api";
import { whatsappLink } from "@/config/contact";
import { useAuth } from "@/contexts/AuthContext";
import { ChoiceChips, PhoneField, POPUP_INPUT, POPUP_LABEL, PopupFieldError } from "@/components/common/FormPopup";
import { tenDigits } from "@/utils/phone";

// The few types shown as buttons (short words); the full option is what's saved and sent.
const SPACES = [
  { value: "Home Gym", label: "Home gym" },
  { value: "Commercial Gym", label: "Commercial gym" },
  { value: "Apartment / Society", label: "Hotel / society" },
  { value: "School / College", label: "School / college" },
  { value: "Corporate / Office", label: "Office" },
  { value: "Other", label: "Other" },
];

const realName = (user) => [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || "";

function whatsappText(form) {
  return [
    "Hi Kreedum Sports, I'd like a quote (bulk order).",
    "",
    `Name: ${form.name}`,
    `Mobile: +91 ${form.phone}`,
    `City: ${form.city}`,
    form.facilityType && `Type of space: ${form.facilityType}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Bulk order / quote request, shown in a popup (EnquiryContext). Short on
 * purpose: name, WhatsApp number, city and type of space; the rest is
 * talked through on the call.
 * Saved for the team, then WhatsApp opens with the details typed in.
 */
export default function BulkEnquiryForm({ from = "", onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => ({
    name: realName(user),
    phone: tenDigits(user?.phone || ""),
    city: "",
    facilityType: "",
    website: "", // hidden: only bots fill this in
  }));
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = "Please enter a valid 10-digit mobile number.";
    if (!form.city.trim()) next.city = "Please enter your city.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const openWhatsApp = () => window.open(whatsappLink(whatsappText(form)), "_blank", "noopener,noreferrer");

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    // Saved in the background: WhatsApp opens straight away (in the click,
    // so browsers don't block it) and a failed save never stops the customer.
    enquiryService.send({ ...form, page: from }).catch(() => {});
    openWhatsApp();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="py-4 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-3 text-lg font-extrabold text-[#0E1A3D]">Almost done</h3>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-slate-600">
          WhatsApp has opened with your details. Tap <strong className="text-[#0E1A3D]">Send</strong> there and our team will call you on{" "}
          <strong className="text-[#0E1A3D]">+91 {form.phone}</strong>.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-[#08331C] hover:brightness-95"
          >
            <MessageCircle size={17} /> Open WhatsApp again
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#0E1A3D] hover:border-[#2C62E0]">
            Done
          </button>
        </div>
      </div>
    );
  }

  const field = (name) => `${POPUP_INPUT} ${errors[name] ? "border-red-400" : "border-slate-200"}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {/* Hidden from people; bots fill it in and are ignored. */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="bulk-name" className={POPUP_LABEL}>Your name</label>
        <input id="bulk-name" name="name" autoComplete="name" placeholder="Full name" maxLength={80} value={form.name} onChange={(e) => set("name", e.target.value)} className={field("name")} />
        <PopupFieldError message={errors.name} />
      </div>

      <div>
        <label htmlFor="bulk-phone" className={POPUP_LABEL}>Phone (WhatsApp)</label>
        <PhoneField id="bulk-phone" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
        <PopupFieldError message={errors.phone} />
      </div>

      <div>
        <label htmlFor="bulk-city" className={POPUP_LABEL}>City</label>
        <input id="bulk-city" name="city" autoComplete="address-level2" placeholder="e.g. Lucknow" maxLength={60} value={form.city} onChange={(e) => set("city", e.target.value)} className={field("city")} />
        <PopupFieldError message={errors.city} />
      </div>

      <div>
        <p className={POPUP_LABEL}>Type of space</p>
        <ChoiceChips label="Type of space" options={SPACES} value={form.facilityType} onChange={(v) => set("facilityType", v)} />
      </div>

      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#880808] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#EE4B2B]">
        <MessageCircle size={17} /> Send on WhatsApp
      </button>
      <p className="text-center text-xs text-slate-500">This opens WhatsApp with your details filled in. Just tap send.</p>
    </form>
  );
}
