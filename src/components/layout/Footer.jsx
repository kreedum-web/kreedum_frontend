import { Link } from "react-router-dom";
import { ArrowUpRight, Headset, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { COLORS } from "@/config/theme";
import { ADDRESS, EMAIL, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/config/contact";
import logo from "@/assets/logo.png";
import SocialLinks from "@/components/common/SocialLinks";
import { logWhatsapp } from "@/utils/enquiryLog";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop by Category", to: "/categories" },
  { label: "Brands", to: "/brands" },
  { label: "Bulk Order Enquiry", to: "/bulk-enquiry" },
  { label: "About Us", to: "/about-us" },
  { label: "Contact Us", to: "/contact" },
];

const CARE_LINKS = [
  { label: "My Account", to: "/account" },
  { label: "My Orders", to: "/account/orders" },
  { label: "Refund & Shipping Policy", to: "/refund-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

function Heading({ children }) {
  return <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#8FADFF]">{children}</h2>;
}

function LinkList({ links }) {
  return (
    <ul className="space-y-3 text-sm text-white/65">
      {links.map((item) => (
        <li key={item.to}>
          <Link className="transition-colors hover:text-white" to={item.to}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: COLORS.navy, fontFamily: '"Manrope", sans-serif' }}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-6 pb-10 pt-14 md:grid-cols-4">
        {/* About */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <img src={logo} alt="Kreedum Sports logo" className="h-9 w-9 object-contain" />
            <span className="text-sm font-bold text-white">
              Kreedum<span className="text-[#8FADFF]">Sports</span>
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-6 text-white/55">
            Sports goods, fitness equipment, apparel, footwear and sports infrastructure — all under one trusted
            name.
          </p>
          <SocialLinks />
        </div>

        {/* Quick links */}
        <div>
          <Heading>Quick links</Heading>
          <LinkList links={QUICK_LINKS} />
        </div>

        {/* Customer care */}
        <div>
          <Heading>Customer care</Heading>
          <a
            href={`tel:${PHONE_TEL}`}
            className="mb-4 flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            <Headset size={20} className="shrink-0 text-[#8FADFF]" />
            <span className="min-w-0">
              <span className="block text-[11px] text-white/50">Call us</span>
              <span className="block whitespace-nowrap text-sm font-bold text-white">{PHONE_DISPLAY}</span>
            </span>
          </a>
          <LinkList links={CARE_LINKS} />
        </div>

        {/* Get in touch */}
        <div className="col-span-2 md:col-span-1">
          <Heading>Get in touch</Heading>
          <ul className="space-y-4 text-sm text-white/65">
            <li className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-[#8FADFF]" />
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {ADDRESS}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={17} className="shrink-0 text-[#8FADFF]" />
              <a href={`tel:${PHONE_TEL}`} className="hover:text-white">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={17} className="shrink-0 text-[#8FADFF]" />
              <a href={whatsappLink()} onClick={() => logWhatsapp("footer")} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp us
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={17} className="shrink-0 text-[#8FADFF]" />
              <a href={`mailto:${EMAIL}`} className="break-all hover:text-white">
                {EMAIL}
              </a>
            </li>
          </ul>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2C62E0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1F49B8]"
          >
            Get directions <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-white/40 md:text-left">
            © {new Date().getFullYear()} Kreedum International Private Limited. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-white/55 md:justify-end">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
