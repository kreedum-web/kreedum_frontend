import { Link } from "react-router-dom";
import { COLORS } from "@/config/theme";
import logo from "@/assets/logo.png";

const SHOP_LINKS = [
  { label: "Shop All", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Brands", to: "/brands" },
  { label: "Deals", to: "/deals" },
];

const ACCOUNT_LINKS = [
  { label: "My Account", to: "/account" },
  { label: "My Orders", to: "/orders" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Cart", to: "/cart" },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: COLORS.navy,
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        {/* Brand */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-4"
          >
            <img
              src={logo}
              alt="Kreedum logo"
              className="w-8 h-8 object-contain"
            />

            <span
              className="font-semibold text-sm"
              style={{ color: COLORS.white }}
            >
              Kreedum
              <span style={{ color: "#8FADFF" }}>
                Sports
              </span>
            </span>
          </Link>

          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Sports goods, fitness equipment, and
            sports infrastructure — all under one
            trusted name.
          </p>
        </div>

        {/* Shop */}
        <div>
          <div
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "#8FADFF" }}
          >
            Shop
          </div>

          <ul className="space-y-2.5">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm transition-opacity hover:opacity-80"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <div
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "#8FADFF" }}
          >
            Account
          </div>

          <ul className="space-y-2.5">
            {ACCOUNT_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm transition-opacity hover:opacity-80"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "#8FADFF" }}
          >
            Contact
          </div>

          <ul className="space-y-2.5">
            <li>
              <a
                href="mailto:info@kreedum.com"
                className="text-sm transition-opacity hover:opacity-80"
                style={{
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                info@kreedum.com
              </a>
            </li>

            <li>
              <Link
                to="/contact"
                className="text-sm transition-opacity hover:opacity-80"
                style={{
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-xs tracking-widest uppercase text-center md:text-left"
            style={{
              color: "rgba(255,255,255,0.35)",
            }}
          >
            © {new Date().getFullYear()} Kreedum International
            Private Limited
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/privacy-policy"
              className="text-xs tracking-widest uppercase transition-colors hover:text-white"
              style={{
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-and-conditions"
              className="text-xs tracking-widest uppercase transition-colors hover:text-white"
              style={{
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}