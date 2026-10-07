import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
} from "lucide-react";

import { COLORS } from "@/config/theme";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

const mobileMenuRef = useRef(null);
const mobileMenuButtonRef = useRef(null);

  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage && !scrolled;

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


  useEffect(() => {
  if (!open) return;

  const handleOutsideInteraction = (event) => {
    const menu = mobileMenuRef.current;
    const button = mobileMenuButtonRef.current;

    if (
      menu &&
      !menu.contains(event.target) &&
      button &&
      !button.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleOutsideInteraction
  );

  document.addEventListener(
    "touchstart",
    handleOutsideInteraction
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideInteraction
    );

    document.removeEventListener(
      "touchstart",
      handleOutsideInteraction
    );
  };
}, [open]);

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
          backgroundColor: scrolled ? COLORS.white : "transparent",
          border: isTransparent
            ? "1px solid transparent"
            : "1px solid rgba(14,26,61,0.07)",
          boxShadow: isTransparent
            ? "none"
            : "0 10px 35px rgba(14,26,61,0.14), 0 2px 8px rgba(14,26,61,0.06)",
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
            className="flex items-center gap-2 group"
          >
            <img
              src={logo}
              alt="Kreedum logo"
              className="
                w-8 h-8 md:w-9 md:h-9
                transition-transform duration-300 ease-out
                group-hover:-translate-y-0.5
              "
            />

            <span
              className="
                font-bold
                text-lg
                md:text-xl
                tracking-tight
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
              "
              style={{
                color: scrolled ? COLORS.navy : COLORS.white,
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
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="
                    relative
                    text-sm
                    font-medium
                    py-2
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-0.5
                    group
                  "
                  style={{
                    color: scrolled
                      ? isActive
                        ? COLORS.blue
                        : COLORS.slate
                      : isActive
                      ? COLORS.white
                      : "rgba(255,255,255,0.9)",
                    fontFamily: '"Manrope", sans-serif',
                  }}
                >
                  {link.label}

                  {/* Animated underline */}
                  <span
                    className={`
                      absolute
                      left-0
                      bottom-0
                      h-[2px]
                      rounded-full
                      bg-[#2C62E0]
                      transition-all
                      duration-300
                      ease-out
                      ${
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <Link
              to="/search"
              aria-label="Search"
              className="
                group
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-full
                transition-all
                duration-300
                ease-out
                hover:-translate-y-1
              "
              style={{
                color: scrolled ? COLORS.navy : COLORS.white,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(44,98,224,0.10)";
                e.currentTarget.style.color = COLORS.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "transparent";
                e.currentTarget.style.color = scrolled
                  ? COLORS.navy
                  : COLORS.white;
              }}
            >
              <Search
                className="
                  w-5 h-5
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="
                group
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-full
                transition-all
                duration-300
                ease-out
                hover:-translate-y-1
              "
              style={{
                color: scrolled ? COLORS.navy : COLORS.white,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(44,98,224,0.10)";
                e.currentTarget.style.color = COLORS.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "transparent";
                e.currentTarget.style.color = scrolled
                  ? COLORS.navy
                  : COLORS.white;
              }}
            >
              <Heart
                className="
                  w-5 h-5
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="
                group
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-full
                transition-all
                duration-300
                ease-out
                hover:-translate-y-1
              "
              style={{
                color: scrolled ? COLORS.navy : COLORS.white,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(44,98,224,0.10)";
                e.currentTarget.style.color = COLORS.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "transparent";
                e.currentTarget.style.color = scrolled
                  ? COLORS.navy
                  : COLORS.white;
              }}
            >
              <ShoppingCart
                className="
                  w-5 h-5
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </Link>

            {/* Account / Login */}
            {isAuthenticated ? (
              <Link
                to="/account"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  px-3
                  py-2
                  rounded-full
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#EAF0FF]
                "
                style={{
                  color: scrolled
                    ? COLORS.navy
                    : COLORS.white,
                }}
              >
                <User
                  className="
                    w-5 h-5
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                <span>
                  {user?.name || "Account"}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="
                  px-5
                  py-2.5
                  rounded-full
                  border
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  ease-out
                  hover:-translate-y-1
                  hover:shadow-md
                  hover:bg-[#2C62E0]
                  hover:border-[#2C62E0]
                  hover:text-white
                "
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
              className="
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-full
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#EAF0FF]
              "
              style={{
                color: scrolled ? COLORS.navy : COLORS.white,
              }}
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

           <button
               ref={mobileMenuButtonRef}
               type="button"
               onClick={() => setOpen(!open)}
              aria-label={
                open ? "Close menu" : "Open menu"
              }
              aria-expanded={open}
              className="
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-full
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#EAF0FF]
              "
              style={{
                color: scrolled ? COLORS.navy : COLORS.white,
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
        <div
  ref={mobileMenuRef}
  className="md:hidden px-4 pb-4"
>
          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ${
                open
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
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3.5
                      rounded-2xl
                      transition-all
                      duration-300
                      hover:bg-[#EAF0FF]
                      hover:translate-x-1
                    "
                    style={{
                      color: isActive
                        ? COLORS.blue
                        : COLORS.navy,
                    }}
                  >
                    <span className="text-sm font-medium">
                      {link.label}
                    </span>

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>
                  </Link>
                );
              })}

              <Link
                to="/search"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3.5
                  rounded-2xl
                  transition-all
                  duration-300
                  hover:bg-[#EAF0FF]
                  hover:translate-x-1
                "
                style={{ color: COLORS.navy }}
              >
                <span className="text-sm font-medium">
                  Search
                </span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/wishlist"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3.5
                  rounded-2xl
                  transition-all
                  duration-300
                  hover:bg-[#EAF0FF]
                  hover:translate-x-1
                "
                style={{ color: COLORS.navy }}
              >
                <span className="text-sm font-medium">
                  Wishlist
                </span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to={
                  isAuthenticated
                    ? "/account"
                    : "/login"
                }
                className="
                  group
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3.5
                  rounded-2xl
                  transition-all
                  duration-300
                  hover:bg-[#EAF0FF]
                  hover:translate-x-1
                "
                style={{ color: COLORS.navy }}
              >
                <span className="text-sm font-medium">
                  {isAuthenticated
                    ? "My Account"
                    : "Login"}
                </span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}