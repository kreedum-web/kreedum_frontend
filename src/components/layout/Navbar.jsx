import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";

import { COLORS } from "@/config/theme";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/products" },
    { label: "Categories", to: "/categories" },
    { label: "Brands", to: "/brands" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Navbar wrapper */}
      <div
        className="transition-all duration-300 ease-out"
        style={{
          marginTop: scrolled ? "12px" : "0px",
          marginLeft: scrolled ? "12px" : "0px",
          marginRight: scrolled ? "12px" : "0px",
          borderRadius: scrolled ? "20px" : "0px",
          backgroundColor: scrolled
            ? COLORS.white
            : "transparent",
          border: scrolled
            ? "1px solid rgba(14,26,61,0.07)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 10px 35px rgba(14,26,61,0.14), 0 2px 8px rgba(14,26,61,0.06)"
            : "none",
        }}
      >
        {/* Main navbar */}
        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            flex
            items-center
            justify-between
            h-16
            md:h-20
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <img
              src={logo}
              alt="Kreedum logo"
              className="w-8 h-8 md:w-9 md:h-9"
            />

            <span
              className="font-bold text-lg md:text-xl tracking-tight"
              style={{
                color: scrolled
                  ? COLORS.navy
                  : COLORS.white,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Kreedum
              <span style={{ color: COLORS.blue }}>
                Sports
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors"
                style={{
                  color: scrolled
                    ? COLORS.slate
                    : "rgba(255,255,255,0.9)",
                  fontFamily: '"Manrope", sans-serif',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <Link
              to="/search"
              aria-label="Search"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
              style={{
                color: scrolled
                  ? COLORS.navy
                  : COLORS.white,
              }}
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{
                color: scrolled
                  ? COLORS.navy
                  : COLORS.white,
              }}
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{
                color: scrolled
                  ? COLORS.navy
                  : COLORS.white,
              }}
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <Link
                to="/account"
                className="flex items-center gap-2 text-sm font-semibold"
                style={{
                  color: scrolled
                    ? COLORS.navy
                    : COLORS.white,
                }}
              >
                <User className="w-5 h-5" />

                <span>
                  {user?.name || "Account"}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full border text-sm font-semibold transition-transform hover:scale-105"
                style={{
                  borderColor: scrolled
                    ? "rgba(14,26,61,0.2)"
                    : "rgba(255,255,255,0.3)",
                  color: scrolled
                    ? COLORS.navy
                    : COLORS.white,
                }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/cart"
              aria-label="Cart"
              className="w-10 h-10 flex items-center justify-center"
              style={{
                color: scrolled
                  ? COLORS.navy
                  : COLORS.white,
              }}
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={
                open ? "Close menu" : "Open menu"
              }
              aria-expanded={open}
              className="w-10 h-10 flex items-center justify-center"
              style={{
                color: scrolled
                  ? COLORS.navy
                  : COLORS.white,
              }}
            >
              {open ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden px-4 pb-4">
          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ${open
                ? "max-h-[600px] opacity-100"
                : "max-h-0 opacity-0"
              }
            `}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "20px",
            }}
          >
            <div className="px-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                  style={{
                    color: COLORS.navy,
                  }}
                >
                  <span className="text-sm font-medium">
                    {link.label}
                  </span>

                  <span>→</span>
                </Link>
              ))}

              <Link
                to="/search"
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                style={{ color: COLORS.navy }}
              >
                <span className="text-sm font-medium">
                  Search
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                style={{ color: COLORS.navy }}
              >
                <span className="text-sm font-medium">
                  Wishlist
                </span>

                <span>→</span>
              </Link>

              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                style={{ color: COLORS.navy }}
              >
                <span className="text-sm font-medium">
                  {isAuthenticated
                    ? "My Account"
                    : "Login"}
                </span>

                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}