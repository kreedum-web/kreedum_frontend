
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { COLORS } from "@/config/theme";
import logo from "@/assets/logo.png";
import SocialLinks from "@/components/common/SocialLinks";

const COMPANY_LINKS = [
  { label: "About Us", to: "/about-us" },
  { label: "Contact Us", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Refund Polic & Shipping Policy", to: "/refund-policy" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kreedum_official/",
    // Icon: Instagram,
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: COLORS.navy,
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-10 pt-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <img
              src={logo}
              alt="Kreedum Sports logo"
              className="h-9 w-9 object-contain"
            />
            <span className="text-sm font-bold text-white">
              Kreedum<span className="text-[#8FADFF]">Sports</span>
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-6 text-white/55">
            Sports goods, fitness equipment, apparel, footwear and sports
            infrastructure — all under one trusted name.
          </p>

        
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#8FADFF]">
            Shop
          </h2>
          <ul className="space-y-3 text-sm text-white/65">
            <li><Link className="hover:text-white" to="/products">Shop All</Link></li>
            <li><Link className="hover:text-white" to="/products">Products</Link></li>
            <li><Link className="hover:text-white" to="/wishlist">Wishlist</Link></li>
            <li><Link className="hover:text-white" to="/cart">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#8FADFF]">
            Company
          </h2>
          <ul className="space-y-3 text-sm text-white/65">
            {COMPANY_LINKS.map((item) => (
              <li key={item.to}>
                <Link className="hover:text-white" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#8FADFF]">
            Get in touch
          </h2>

          <ul className="space-y-4 text-sm text-white/65">
            <li className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-[#8FADFF]" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Krishna%20Plaza%20Nazirabad%20Road%20Aminabad%20Lucknow%20226018"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Upper ground floor, Krishna Plaza, Nazirabad Road, Aminabad,
                Lucknow - 226018
              </a>
            </li>

            <li className="flex items-center gap-3">
              <Phone size={17} className="shrink-0 text-[#8FADFF]" />
              <a href="tel:+917570002458" className="hover:text-white">
                +91 75700 02458
              </a>
            </li>

            <li className="flex items-center gap-3">
              <Mail size={17} className="shrink-0 text-[#8FADFF]" />
              <a href="mailto:info@kreedum.com" className="break-all hover:text-white">
                info@kreedum.com
              </a>
            </li>
          </ul>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Krishna%20Plaza%20Nazirabad%20Road%20Aminabad%20Lucknow%20226018"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2C62E0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1F49B8]"
          >
            Get directions <ArrowUpRight size={16} />
          </a>
          <SocialLinks/>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-white/40 md:text-left">
            © {new Date().getFullYear()} Kreedum International Private Limited.
            All rights reserved.
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
