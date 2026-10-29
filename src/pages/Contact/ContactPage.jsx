import { useState } from "react";

import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import Dropdown from "@/components/common/Dropdown";

const stores = [
  {
    name: "Kreedum International Pvt. Ltd.",
    category: "Fitness machines · Play courts · Sports infrastructure",
    address:
      "Upper ground floor, Krishna Plaza, Nazirabad Road, Aminabad, Lucknow - 226018",
    phone: "+91 75700 02458",
    telephone: "+917570002458",
    map: "https://www.google.com/maps/search/?api=1&query=Krishna%20Plaza%20Nazirabad%20Road%20Aminabad%20Lucknow%20226018",
  },
  {
    name: "Sports Line",
    category: "Sports goods · Clothing · Footwear",
    address:
      "Upper ground floor, Lucknow Plaza, Nazirabad Road, Aminabad, Lucknow - 226018",
    phone: "+91 80819 79754",
    telephone: "+918081979754",
    map: "https://www.google.com/maps/search/?api=1&query=Lucknow%20Plaza%20Nazirabad%20Road%20Aminabad%20Lucknow%20226018",
  },
];

const EMAIL = "info@kreedum.com";
const WHATSAPP = "917570002458";

function StoreCard({ store }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2C62E0]">
        <MapPin size={23} />
      </div>

      <h2 className="text-xl font-bold text-[#0E1A3D]">
        {store.name}
      </h2>

      <p className="mt-2 text-sm font-medium text-[#2C62E0]">
        {store.category}
      </p>

      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
        {store.address}
      </p>

      <a
        href={`tel:${store.telephone}`}
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0E1A3D] hover:text-[#2C62E0]"
      >
        <Phone size={17} />
        {store.phone}
      </a>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Monday–Sunday: 10:30 AM–9:00 PM
        <br />
        Thursday: till 7:00 PM
      </p>

      <a
        href={store.map}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2C62E0] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1F49B8]"
      >
        Get directions <ArrowUpRight size={17} />
      </a>
    </article>
  );
}

const ENQUIRY_TYPES = [
  "Sports equipment",
  "Fitness and gym equipment",
  "Institutional or bulk order",
  "Sports infrastructure",
  "Order support",
  "General enquiry",
];

export default function ContactPage() {
  const [enquiryType, setEnquiryType] = useState(ENQUIRY_TYPES[0]);

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const category = String(form.get("category") || "");
    const message = String(form.get("message") || "").trim();

    const text = [
      "Hi Kreedum Sports, I have an enquiry.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email && `Email: ${email}`,
      `Enquiry type: ${category}`,
      `Message: ${message}`,
    ].filter(Boolean).join("\n");

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-16">
      <InnerPageHeader
        eyebrow="WE'RE HERE TO HELP"
        title="Contact Us"
        description="Visit our stores or get in touch with our team about sports equipment, fitness products and sports infrastructure."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Contact Us" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2C62E0]">
            Visit us
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0E1A3D] sm:text-3xl">
            Two stores. One destination for sport.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Find us in Aminabad, Lucknow. Choose a store below to view
            its address, call the store or open directions.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {stores.map((store) => (
              <StoreCard key={store.name} store={store} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl bg-[#0E1A3D] p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FADFF]">
              Get in touch
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              How can we help?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Contact us for product enquiries, institutional orders,
              gym equipment or sports infrastructure projects.
            </p>

            <div className="mt-7 space-y-6">
              <a
                href="tel:+917570002458"
                className="flex items-start gap-3 text-sm hover:text-[#8FADFF]"
              >
                <Phone size={19} className="mt-0.5 shrink-0 text-[#8FADFF]" />
                <span>
                  <span className="block text-white/50">Call our main store</span>
                  <span className="mt-1 block font-semibold">+91 75700 02458</span>
                </span>
              </a>

              <a
                href={`mailto:${EMAIL}`}
                className="flex items-start gap-3 text-sm hover:text-[#8FADFF]"
              >
                <Mail size={19} className="mt-0.5 shrink-0 text-[#8FADFF]" />
                <span>
                  <span className="block text-white/50">Email us</span>
                  <span className="mt-1 block font-semibold">{EMAIL}</span>
                </span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm hover:text-[#8FADFF]"
              >
                <MessageCircle size={19} className="mt-0.5 shrink-0 text-[#8FADFF]" />
                <span>
                  <span className="block text-white/50">WhatsApp</span>
                  <span className="mt-1 block font-semibold">Message our team</span>
                </span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2C62E0]">
              Quick enquiry
            </p>

            <h2 className="mt-3 text-2xl font-bold text-[#0E1A3D]">
              Tell us what you're looking for.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Complete the details below to continue the conversation
              with our team on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-[#0E1A3D]">
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-[#0E1A3D]">
                    Phone number *
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={20}
                    autoComplete="tel"
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-[#0E1A3D]">
                  Email address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="contact-category" className="mb-2 block text-sm font-semibold text-[#0E1A3D]">
                  Enquiry type
                </label>
                <Dropdown
                  id="contact-category"
                  name="category"
                  variant="field"
                  label="Enquiry type"
                  value={enquiryType}
                  options={ENQUIRY_TYPES.map((type) => ({ label: type, value: type }))}
                  onChange={setEnquiryType}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-[#0E1A3D]">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  maxLength={2000}
                  placeholder="How can we help?"
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2C62E0] focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C62E0] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1F49B8] sm:w-auto"
              >
                Continue on WhatsApp <ArrowUpRight size={17} />
              </button>
            </form>
          </div>
        </section>

        <p className="text-center text-xs text-slate-500">
          Need order support? Visit{" "}
          <Link to="/account/orders" className="font-semibold text-[#2C62E0] hover:underline">
            My Orders
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
