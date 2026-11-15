import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";

import { enquiryService } from "@/api";
import Dropdown from "@/components/common/Dropdown";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/config/contact";
import { useAuth } from "@/contexts/AuthContext";
import {
  BUDGET_BANDS,
  ENQUIRY_HIGHLIGHTS,
  EQUIPMENT_NEEDS,
  FACILITY_TYPES,
  TIMELINES,
} from "@/data/bulkEnquiryOptions";

const INPUT =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0E1A3D] outline-none transition focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100";
const LABEL = "mb-1.5 block text-sm font-semibold text-[#0E1A3D]";

function FieldError({ message }) {
  return message ? <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p> : null;
}

/** The customer's real name if we have one (not the email / number shown when there's none). */
const realName = (user) => [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.name || "";

const toOptions = (list) => list.map((item) => ({ label: item, value: item }));

/** The enquiry as the WhatsApp message the customer sends us. */
function whatsappText(form) {
  return [
    "Hi Kreedum Sports, I have a bulk enquiry.",
    "",
    `Name: ${form.name}`,
    `Mobile: ${form.phone}`,
    form.email && `Email: ${form.email}`,
    `City: ${form.city}`,
    form.organisation && `Organisation: ${form.organisation}`,
    form.facilityType && `Facility: ${form.facilityType}`,
    form.equipmentNeed && `Needs: ${form.equipmentNeed}`,
    form.budget && `Budget: ${form.budget}`,
    form.timeline && `Timeline: ${form.timeline}`,
    form.message && `\n${form.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * /bulk-enquiry — quote request for gyms, schools, offices and other bulk
 * buyers. No sign-in needed. "Send enquiry" saves it in our database
 * (marked signed-in or not) and opens WhatsApp with the details typed in,
 * like the Contact page.
 */
export default function BulkEnquiryPage() {
  const location = useLocation();
  const { user } = useAuth();

  const [form, setForm] = useState(() => ({
    name: realName(user),
    phone: (user?.phone || "").replace(/\D/g, "").slice(-10),
    email: user?.email || "",
    city: "",
    organisation: "",
    facilityType: "",
    equipmentNeed: "",
    budget: "",
    timeline: "",
    message: "",
    website: "", // hidden: only bots fill this in
  }));
  // Signed in: fill in their name / number / email once their details arrive
  // (only fields still empty, so nothing they typed is overwritten).
  const userKey = user?.id || user?._id || "";
  const [filledFor, setFilledFor] = useState(userKey);
  if (userKey && userKey !== filledFor) {
    setFilledFor(userKey);
    setForm((current) => ({
      ...current,
      name: current.name || realName(user),
      phone: current.phone || (user.phone || "").replace(/\D/g, "").slice(-10),
      email: current.email || user.email || "",
    }));
  }
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    set(name, name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value);
  };

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = "Please enter a valid 10-digit mobile number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!form.city.trim()) next.city = "Please enter your city.";
    if (!form.equipmentNeed) next.equipmentNeed = "Please choose what you need.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function openWhatsApp() {
    window.open(whatsappLink(whatsappText(form)), "_blank", "noopener,noreferrer");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    // Save it for our records (in the background: WhatsApp opens straight
    // away, and a problem saving never stops the customer).
    enquiryService.send({ ...form, page: location.state?.from || "" }).catch((error) => {
      console.warn("Couldn't save the enquiry:", error?.response?.data?.message || error?.message);
    });

    // Opened right away, in the click, so browsers don't block it.
    openWhatsApp();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const fieldClass = (name) => `${INPUT} ${errors[name] ? "border-red-400" : "border-slate-200"}`;

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        eyebrow="Bulk & institutional orders"
        title="Bulk Enquiry"
        description="Gyms, schools, offices and societies: tell us what you need and we'll call you with the best price."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Bulk Enquiry" }]}
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 md:py-10 lg:grid-cols-[1fr_330px]">
        {/* Form / thank-you */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
          {sent ? (
            <div className="py-6 text-center sm:py-10">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
              <h2 className="mt-4 text-2xl font-bold text-[#0E1A3D]">Almost done</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Thank you, {form.name.split(" ")[0]}. WhatsApp has opened with your enquiry typed in. Press{" "}
                <strong className="text-[#0E1A3D]">Send</strong> there and our team will call you on{" "}
                <strong className="text-[#0E1A3D]">+91 {form.phone}</strong>.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-[#08331C] hover:brightness-95"
                >
                  <MessageCircle size={16} /> Open WhatsApp again
                </button>
                <Link
                  to="/"
                  className="rounded-full bg-[#2C62E0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1F49B8]"
                >
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm((current) => ({ ...current, equipmentNeed: "", budget: "", timeline: "", message: "" }));
                  }}
                  className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-[#0E1A3D] hover:border-[#2C62E0]"
                >
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2C62E0]">Get a quote</p>
                <h2 className="mt-1.5 text-xl font-bold text-[#0E1A3D] sm:text-2xl">Tell us about your requirement</h2>
                <p className="mt-1 text-sm text-slate-500">No sign-in needed. Fields marked * are required.</p>
              </div>

              {/* Hidden from people; bots fill it in and are ignored. */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={onChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-name" className={LABEL}>Name *</label>
                  <input id="enq-name" name="name" value={form.name} onChange={onChange} autoComplete="name" maxLength={80} placeholder="Your name" className={fieldClass("name")} />
                  <FieldError message={errors.name} />
                </div>
                <div>
                  <label htmlFor="enq-phone" className={LABEL}>Mobile number *</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">+91</span>
                    <input id="enq-phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={onChange} autoComplete="tel-national" placeholder="10-digit mobile" className={`${fieldClass("phone")} pl-12`} />
                  </div>
                  <FieldError message={errors.phone} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-email" className={LABEL}>Email <span className="font-normal text-slate-400">(optional)</span></label>
                  <input id="enq-email" name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" maxLength={120} placeholder="you@example.com" className={fieldClass("email")} />
                  <FieldError message={errors.email} />
                </div>
                <div>
                  <label htmlFor="enq-city" className={LABEL}>City *</label>
                  <input id="enq-city" name="city" value={form.city} onChange={onChange} autoComplete="address-level2" maxLength={60} placeholder="Lucknow" className={fieldClass("city")} />
                  <FieldError message={errors.city} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-org" className={LABEL}>Organisation <span className="font-normal text-slate-400">(optional)</span></label>
                  <input id="enq-org" name="organisation" value={form.organisation} onChange={onChange} autoComplete="organization" maxLength={120} placeholder="School, gym or company name" className={fieldClass("organisation")} />
                </div>
                <div>
                  <label htmlFor="enq-facility" className={LABEL}>Facility type</label>
                  <Dropdown id="enq-facility" variant="field" label="Facility type" placeholder="Select facility type" value={form.facilityType} options={toOptions(FACILITY_TYPES)} onChange={(value) => set("facilityType", value)} />
                </div>
              </div>

              <div>
                <label htmlFor="enq-need" className={LABEL}>What do you need? *</label>
                <Dropdown id="enq-need" variant="field" label="What do you need" placeholder="Select what you need" value={form.equipmentNeed} options={toOptions(EQUIPMENT_NEEDS)} onChange={(value) => set("equipmentNeed", value)} />
                <FieldError message={errors.equipmentNeed} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-budget" className={LABEL}>Budget</label>
                  <Dropdown id="enq-budget" variant="field" label="Budget" placeholder="Select budget" value={form.budget} options={toOptions(BUDGET_BANDS)} onChange={(value) => set("budget", value)} />
                </div>
                <div>
                  <label htmlFor="enq-timeline" className={LABEL}>When do you need it?</label>
                  <Dropdown id="enq-timeline" variant="field" label="Timeline" placeholder="Select timeline" value={form.timeline} options={toOptions(TIMELINES)} onChange={(value) => set("timeline", value)} />
                </div>
              </div>

              <div>
                <label htmlFor="enq-message" className={LABEL}>Details <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea id="enq-message" name="message" rows={4} value={form.message} onChange={onChange} maxLength={2000} placeholder="Products, quantities, space size, delivery location…" className={`${fieldClass("message")} resize-y`} />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-[#08331C] transition hover:brightness-95 sm:w-auto"
              >
                <MessageCircle size={17} />
                Send enquiry on WhatsApp
              </button>
              <p className="text-xs text-slate-500">WhatsApp opens with your details typed in; just press Send. No spam.</p>
            </form>
          )}
        </div>

        {/* Why / call us */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-[#0E1A3D] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FADFF]">Why Kreedum</p>
            <ul className="mt-4 space-y-3">
              {ENQUIRY_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#8FADFF]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0E1A3D]">Prefer to talk?</p>
            <p className="mt-1 text-sm text-slate-500">Call or WhatsApp our team.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0E1A3D] hover:border-[#2C62E0] hover:text-[#2C62E0]">
                <Phone size={17} /> {PHONE_DISPLAY}
              </a>
              <a href={whatsappLink("Hi Kreedum, I have a bulk enquiry.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0E1A3D] hover:border-[#25D366] hover:text-[#128C4B]">
                <MessageCircle size={17} /> WhatsApp us
              </a>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
