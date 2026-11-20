import { useState } from "react";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";

import { enquiryService } from "@/api";
import Dropdown from "@/components/common/Dropdown";
import { useAuth } from "@/contexts/AuthContext";
import { POPUP_INPUT, POPUP_LABEL, PopupFieldError } from "@/components/common/FormPopup";

const WHATSAPP = "917570002458";

const ENQUIRY_TYPES = [
  "Sports equipment",
  "Fitness and gym equipment",
  "Institutional or bulk order",
  "Sports infrastructure",
  "Order support",
  "General enquiry",
];

const realName = (user) => [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || "";

/**
 * The Contact Us form, shown in a popup (EnquiryContext). Same fields as
 * before: name, phone, email (optional), enquiry type, message. Saved for
 * the team, then WhatsApp opens with the message typed in.
 */
export default function ContactForm({ onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => ({
    name: realName(user),
    phone: user?.phone || "",
    email: user?.email || "",
    category: ENQUIRY_TYPES[0],
    message: "",
  }));
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const text = () =>
    [
      "Hi Kreedum Sports, I have an enquiry.",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() && `Email: ${form.email.trim()}`,
      `Enquiry type: ${form.category}`,
      `Message: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

  const openWhatsApp = () => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text())}`, "_blank", "noopener,noreferrer");

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (form.phone.replace(/\D/g, "").length < 10) next.phone = "Please enter your phone number.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!form.message.trim()) next.message = "Please write your message.";
    setErrors(next);
    if (Object.keys(next).length) return;

    // Saved for the team in the background; WhatsApp opens straight away.
    enquiryService
      .contact({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), topic: form.category, message: form.message.trim(), page: window.location.pathname })
      .catch(() => {});
    openWhatsApp();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="py-4 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-3 text-lg font-extrabold text-[#0E1A3D]">Almost done</h3>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-slate-600">
          WhatsApp has opened with your message. Tap <strong className="text-[#0E1A3D]">Send</strong> there and our team will reply.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          <button type="button" onClick={openWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-[#08331C] hover:brightness-95">
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={POPUP_LABEL}>Name *</label>
          <input id="contact-name" name="name" maxLength={100} autoComplete="name" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} className={field("name")} />
          <PopupFieldError message={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={POPUP_LABEL}>Phone number *</label>
          <input id="contact-phone" name="phone" type="tel" maxLength={20} autoComplete="tel" placeholder="Your phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={field("phone")} />
          <PopupFieldError message={errors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={POPUP_LABEL}>Email address</label>
        <input id="contact-email" name="email" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={field("email")} />
        <PopupFieldError message={errors.email} />
      </div>

      <div>
        <label htmlFor="contact-category" className={POPUP_LABEL}>Enquiry type</label>
        <Dropdown
          id="contact-category"
          variant="field"
          label="Enquiry type"
          value={form.category}
          options={ENQUIRY_TYPES.map((type) => ({ label: type, value: type }))}
          onChange={(v) => set("category", v)}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={POPUP_LABEL}>Message *</label>
        <textarea id="contact-message" name="message" rows={4} maxLength={2000} placeholder="How can we help?" value={form.message} onChange={(e) => set("message", e.target.value)} className={`${field("message")} resize-y`} />
        <PopupFieldError message={errors.message} />
      </div>

      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C62E0] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#1F49B8]">
        Continue on WhatsApp <ArrowUpRight size={17} />
      </button>
    </form>
  );
}
