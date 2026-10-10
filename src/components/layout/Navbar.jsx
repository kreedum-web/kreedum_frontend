
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, ShoppingCart, User, X } from "lucide-react";

import { COLORS } from "@/config/theme";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "@/components/search/SearchBar";

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hideMobileTopRow, setHideMobileTopRow] = useState(false);

  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuOriginRef = useRef(null);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/products" },
    { label: "Categories", to: "/categories" },
    { label: "Brands", to: "/brands" },
  ];

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (currentScrollY <= 20) {
        setHideMobileTopRow(false);
      } else if (currentScrollY > previousScrollY + 4) {
        setHideMobileTopRow(true);
      } else if (currentScrollY < previousScrollY - 4) {
        setHideMobileTopRow(false);
      }

      previousScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
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

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [open]);

  const desktopTransparent = location.pathname === "/" && !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Mobile header: exactly one controls row and one persistent search */}
      <div className="md:hidden">
        <div
className={`relative z-[80] overflow-hidden bg-white transition-[max-height,opacity] duration-200 ${            hideMobileTopRow && !open
              ? "max-h-0 opacity-0"
              : "max-h-20 opacity-100"
          }`}
        >
          <div className="flex h-16 items-center gap-2 px-3">
            <button
              ref={(node) => {
                  mobileMenuButtonRef.current = node;
                  mobileMenuOriginRef.current = node;
                 }}
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-10 w-8 shrink-0 items-center justify-center text-[#0E1A3D]"
            >
              {open ? <X size={25} /> : <Menu size={25} />}
            </button>

            <Link to="/" className="flex min-w-0 flex-1 items-center gap-1">
              <img
                src={logo}
                alt="Kreedum Sports"
                className="h-8 w-8 shrink-0 object-contain"
              />
              <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-[#0E1A3D]">
                Kreedum<span className="text-[#2C62E0]">Sports</span>
              </span>
            </Link>

            <Link
              to={isAuthenticated ? "/account" : "/login"}
              aria-label={isAuthenticated ? "My account" : "Login"}
              className="flex h-9 w-8 shrink-0 items-center justify-center text-[#0E1A3D]"
            >
              <User size={22} />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="flex h-9 w-8 shrink-0 items-center justify-center text-[#0E1A3D]"
            >
              <Heart size={22} />
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className="flex h-9 w-8 shrink-0 items-center justify-center text-[#0E1A3D]"
            >
              <ShoppingCart size={22} />
            </Link>
          </div>
        </div>

        {/* This row stays at the top when the controls row hides */}
        <div className="bg-white px-4 py-2 shadow-sm">
          <SearchBar />
        </div>

        {/* The same open state controls both the X and this menu */}
       
{/* Mobile floating dropdown */}

{/* Mobile floating dropdown backdrop */}
<div
  className={`fixed inset-0 z-[60] bg-[#0E1A3D]/20 backdrop-blur-[1px] transition-opacity duration-200 md:hidden ${
    open ? "opacity-100" : "pointer-events-none opacity-0"
  }`}
  onClick={() => setOpen(false)}
  aria-hidden="true"
/>

{/* Mobile floating dropdown menu */}
<div
  ref={mobileMenuRef}
  className={`fixed right-20 top-[76px] z-[70]
    w-[min(290px,calc(100vw-24px))]
    max-h-[calc(100dvh-92px)] overflow-y-auto
    rounded-2xl border border-[#E5E9F2]
    bg-white p-2 shadow-xl md:hidden
    origin-top-right transition-all duration-200 ease-out ${
      open
        ? "translate-y-0 scale-100 opacity-100"
        : "pointer-events-none -translate-y-2 scale-95 opacity-0"
    }`}
  aria-hidden={!open}
>
  <div className="px-1 py-1">
    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A93A6]">
      Navigation
    </p>

    {navLinks.map((link) => {
      const isActive = location.pathname === link.to;

      return (
        <Link
          key={link.to}
          to={link.to}
          onClick={() => setOpen(false)}
          className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-[#EAF0FF]"
          style={{ color: isActive ? COLORS.blue : COLORS.navy }}
        >
          <span>{link.label}</span>
          <span className="text-[#8A93A6]">→</span>
        </Link>
      );
    })}

    <div className="my-2 border-t border-[#E5E9F2]" />

    <Link
      to="/wishlist"
      onClick={() => setOpen(false)}
      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0E1A3D] hover:bg-[#EAF0FF]"
    >
      Wishlist
      <Heart size={17} />
    </Link>

    <Link
      to={isAuthenticated ? "/account" : "/login"}
      onClick={() => setOpen(false)}
      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0E1A3D] hover:bg-[#EAF0FF]"
    >
      {isAuthenticated ? "My Account" : "Login"}
      <User size={17} />
    </Link>
  </div>
</div>


      </div>

      {/* Desktop navbar: independent of the mobile rows and scroll behavior */}
      <div
        className="hidden transition-all duration-300 ease-out md:block"
        style={{
          marginTop: scrolled ? "12px" : "0px",
          marginLeft: scrolled ? "12px" : "0px",
          marginRight: scrolled ? "12px" : "0px",
          borderRadius: scrolled ? "20px" : "0px",
          backgroundColor: scrolled ? COLORS.white : "transparent",
          border: desktopTransparent
            ? "1px solid transparent"
            : "1px solid rgba(14,26,61,0.07)",
          boxShadow: desktopTransparent
            ? "none"
            : "0 10px 35px rgba(14,26,61,0.14), 0 2px 8px rgba(14,26,61,0.06)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
          <Link to="/" className="group flex items-center gap-2">
            <img
              src={logo}
              alt="Kreedum logo"
              className="h-8 w-8 transition-transform duration-300 group-hover:-translate-y-0.5 md:h-9 md:w-9"
            />
            <span
              className="text-lg font-bold tracking-tight transition-transform duration-300 group-hover:-translate-y-0.5 md:text-xl"
              style={{
                color: scrolled ? COLORS.navy : COLORS.white,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Kreedum<span style={{ color: COLORS.blue }}>Sports</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative py-2 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5"
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
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#2C62E0] transition-all duration-300 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="mx-3 hidden min-w-0 max-w-md flex-1 md:flex">
            <SearchBar />
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-out hover:-translate-y-1"
              style={{ color: scrolled ? COLORS.navy : COLORS.white }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = "rgba(44,98,224,0.10)";
                event.currentTarget.style.color = COLORS.blue;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
                event.currentTarget.style.color = scrolled ? COLORS.navy : COLORS.white;
              }}
            >
              <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-out hover:-translate-y-1"
              style={{ color: scrolled ? COLORS.navy : COLORS.white }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = "rgba(44,98,224,0.10)";
                event.currentTarget.style.color = COLORS.blue;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
                event.currentTarget.style.color = scrolled ? COLORS.navy : COLORS.white;
              }}
            >
              <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </Link>

            {isAuthenticated ? (
              <Link
                to="/account"
                className="group flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EAF0FF]"
                style={{ color: scrolled ? COLORS.navy : COLORS.white }}
              >
                <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span>{user?.name || "Account"}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#2C62E0] hover:bg-[#2C62E0] hover:text-white hover:shadow-md"
                style={{
                  borderColor: scrolled
                    ? "rgba(14,26,61,0.2)"
                    : "rgba(255,255,255,0.3)",
                  color: scrolled ? COLORS.navy : COLORS.white,
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
