
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient} from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, ShoppingCart, User, X , LogOut,  ChevronDown,  Package,MapPin,UserRoundPen,} from "lucide-react";

import { COLORS } from "@/config/theme";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "@/components/search/SearchBar";
import { cartService,wishlistService} from "@/api";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
const queryClient = useQueryClient();
  const { user, isAuthenticated,logout } = useAuth();

  const userKey = user?.id || user?._id || "current";

const cartQuery = useQuery({
  queryKey: ["cart", userKey],
  queryFn: () => cartService.getCart(),
  enabled: isAuthenticated,
  retry: false,
});


const cartCount = Number(
  cartQuery.data?.data?.data?.totalItems ?? 0
);


const wishlistQuery = useQuery({
  queryKey: ["wishlist", userKey],
  queryFn: () => wishlistService.getWishlist(),
  enabled: isAuthenticated,
  retry: false,
});

const wishlistCount = Number(
  wishlistQuery.data?.data?.data?.totalItems ?? 0
);


  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
const accountMenuRef = useRef(null);
const accountButtonRef = useRef(null);
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
    setAccountOpen(false);
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

useEffect(() => {
  if (!accountOpen) return;

  const handleOutsideInteraction = (event) => {
    const menu = accountMenuRef.current;
    const button = accountButtonRef.current;

    if (
      menu &&
      !menu.contains(event.target) &&
      button &&
      !button.contains(event.target)
    ) {
      setAccountOpen(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideInteraction);
  document.addEventListener("touchstart", handleOutsideInteraction);

  return () => {
    document.removeEventListener("mousedown", handleOutsideInteraction);
    document.removeEventListener("touchstart", handleOutsideInteraction);
  };
}, [accountOpen]);


  function handleLogout() {
  // Clear private cached data for the logged-out user.
  queryClient.removeQueries({ queryKey: ["cart"] });
  queryClient.removeQueries({ queryKey: ["wishlist"] });

  // Clear authentication state and stored credentials.
  logout();

  // Return to Login and prevent navigating back to the prior page.
  setOpen(false);
  navigate("/login", { replace: true });
}

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
              
onClick={() => {
  setAccountOpen(false);
  setOpen((current) => !current);
}}

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

            
<button
  ref={accountButtonRef}
  type="button"
  onClick={() => {
    setOpen(false);
    setAccountOpen((current) => !current);
  }}
  aria-label={accountOpen ? "Close account menu" : "Open account menu"}
  aria-expanded={accountOpen}
  aria-haspopup="true"
  className="flex h-9 w-8 shrink-0 items-center justify-center text-[#0E1A3D]"
>
  <User size={22} />
</button>


            

            
<Link
  to="/wishlist"
  aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
  className="flex h-9 w-8 shrink-0 items-center justify-center text-[#0E1A3D]"
>
  <span className="relative inline-flex">
    <Heart size={22} />

    {wishlistCount > 0 && (
      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C62E0] px-1 text-[10px] font-bold leading-none text-white">
        {wishlistCount > 99 ? "99+" : wishlistCount}
      </span>
    )}
  </span>
</Link>


            
<Link
  to="/cart"
  aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
  className="flex h-9 w-8 shrink-0 items-center justify-center text-[#0E1A3D]"
>
  <span className="relative inline-flex">
    <ShoppingCart size={22} />

    {cartCount > 0 && (
      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C62E0] px-1 text-[10px] font-bold leading-none text-white">
        {cartCount > 99 ? "99+" : cartCount}
      </span>
    )}
  </span>
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

    {/* <div className="my-2 border-t border-[#E5E9F2]" /> */}
{/* 
    <Link
      to="/wishlist"
      onClick={() => setOpen(false)}
      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0E1A3D] hover:bg-[#EAF0FF]"
    >
      Wishlist
      <Heart size={17} />
    </Link> */}

    {/* <Link
      to={isAuthenticated ? "/account" : "/login"}
      onClick={() => setOpen(false)}
      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0E1A3D] hover:bg-[#EAF0FF]"
    >
      {isAuthenticated ? "My Account" : "Login"}
      <User size={17} />
    </Link> */}

    {/* {isAuthenticated && (
  <button
    type="button"
    onClick={handleLogout}
    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
  >
    <span>Logout</span>
    <LogOut size={17} />
  </button>
)} */}
  </div>
</div>


{/* Mobile account dropdown */}
<div
  className={`fixed inset-0 z-[60] bg-[#0E1A3D]/20 backdrop-blur-[1px] transition-opacity duration-200 md:hidden ${
    accountOpen
      ? "opacity-100"
      : "pointer-events-none opacity-0"
  }`}
  onClick={() => setAccountOpen(false)}
  aria-hidden="true"
/>

<div
  ref={accountMenuRef}
  aria-hidden={!accountOpen}
  className={`fixed right-3 top-[72px] z-[70] w-[min(280px,calc(100vw-24px))]
    rounded-2xl border border-[#E5E9F2] bg-white p-2 shadow-xl md:hidden
    transition-all duration-200 ${
      accountOpen
        ? "translate-y-0 scale-100 opacity-100"
        : "pointer-events-none -translate-y-2 scale-95 opacity-0"
    }`}
>
  <div className="border-b border-[#E5E9F2] px-3 py-3">
    <p className="text-xs text-[#8A93A6]">
      {isAuthenticated ? "Signed in as" : "Welcome to Kreedum"}
    </p>
    <p className="mt-1 truncate text-sm font-bold text-[#0E1A3D]">
      {isAuthenticated
        ? user?.name || user?.firstName || "Account"
        : "Sign in to your account"}
    </p>
  </div>

  {isAuthenticated ? (
    <>
      

      <Link
        to="/account/orders"
        onClick={() => setAccountOpen(false)}
        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#0E1A3D] hover:bg-[#EAF0FF]"
      >
        My Orders
        <Package size={17} />
      </Link>

      <Link
        to="/account/addresses"
        onClick={() => setAccountOpen(false)}
        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#0E1A3D] hover:bg-[#EAF0FF]"
      >
        My Addresses
        <MapPin size={17} />
      </Link>

      <Link
        to="/account"
        onClick={() => setAccountOpen(false)}
        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#0E1A3D] hover:bg-[#EAF0FF]"
      >
        Edit Profile
        <User size={17} />
      </Link>


      <div className="my-2 border-t border-[#E5E9F2]" />

      <button
        type="button"
        onClick={() => {
          setAccountOpen(false);
          handleLogout();
        }}
        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        Logout
        <LogOut size={17} />
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={() => setAccountOpen(false)}
        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0E1A3D] hover:bg-[#EAF0FF]"
      >
        Login
        <User size={17} />
      </Link>

      <Link
        to="/register"
        onClick={() => setAccountOpen(false)}
        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0E1A3D] hover:bg-[#EAF0FF]"
      >
        Create Account
        <UserRoundPen size={17} />
      </Link>
    </>
  )}
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
<span className="relative inline-flex">
  <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

  {wishlistCount > 0 && (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C62E0] px-1 text-[10px] font-bold leading-none text-white">
      {wishlistCount > 99 ? "99+" : wishlistCount}
    </span>
  )}
</span>            </Link>

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

              <span className="relative inline-flex">
  <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

  {cartCount > 0 && (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C62E0] px-1 text-[10px] font-bold leading-none text-white">
      {cartCount > 99 ? "99+" : cartCount}
    </span>
  )}
</span>
            </Link>


{isAuthenticated ? (
  <div className="relative group">
    <button
      type="button"
      aria-haspopup="true"
      className="flex items-center gap-2 rounded-full px-3 py-2
        text-sm font-semibold transition-colors
        hover:bg-[#EAF0FF] focus:outline-none
        focus-visible:ring-2 focus-visible:ring-[#2C62E0]"
      style={{ color: scrolled ? COLORS.navy : COLORS.white }}
    >
      <User className="h-5 w-5 shrink-0" />

      <span className="max-w-28 truncate">
        {user?.firstName ||
          user?.name?.trim().split(/\s+/)[0] ||
          "Account"}
      </span>

      <ChevronDown
        size={15}
        className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
      />
    </button>

    <div
      className="absolute right-0 top-full z-50 hidden w-56 pt-2
        group-hover:block group-focus-within:block"
    >
      <div className="overflow-hidden rounded-2xl border border-[#E5E9F2]
        bg-white p-2 shadow-xl">

        <div className="border-b border-[#E5E9F2] px-3 py-3">
          <p className="text-xs text-[#8A93A6]">Signed in as</p>
          <p className="mt-1 truncate text-sm font-bold text-[#0E1A3D]">
            {user?.name || user?.firstName || "Account"}
          </p>
        </div>

  
{/* My Orders */}
<Link
  to="/account/orders"
  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#0E1A3D] transition-colors hover:bg-[#EAF0FF]"
>
  My Orders
  <Package size={17} />
</Link>

{/* My Addresses */}
<Link
  to="/account/addresses"
  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#0E1A3D] transition-colors hover:bg-[#EAF0FF]"
>
  My Addresses
  <MapPin size={17} />
</Link>

{/* Edit Profile */}
<Link
  to="/account/profile"
  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#0E1A3D] transition-colors hover:bg-[#EAF0FF]"
>
  Edit Profile
  <UserRoundPen size={17} />
</Link>


        {/* <Link
          to="/wishlist"
          className="mt-2 flex items-center justify-between
            rounded-xl px-3 py-2.5 text-sm font-medium
            text-[#0E1A3D] transition-colors hover:bg-[#EAF0FF]
            hover:text-[#2C62E0]"
        >
          Wishlist
          <Heart size={16} />
        </Link> */}

        {/* <Link
          to="/cart"
          className="flex items-center justify-between rounded-xl
            px-3 py-2.5 text-sm font-medium text-[#0E1A3D]
            transition-colors hover:bg-[#EAF0FF]
            hover:text-[#2C62E0]"
        >
          My Cart
          <ShoppingCart size={16} />
        </Link> */}

        <div className="my-2 border-t border-[#E5E9F2]" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-between
            rounded-xl px-3 py-2.5 text-left text-sm font-semibold
            text-red-600 transition-colors hover:bg-red-50"
        >
          Logout
          <LogOut size={16} />
        </button>
      </div>
    </div>
  </div>
) : (
  <Link
    to="/login"
    className="rounded-full border px-5 py-2.5 text-sm
      font-semibold transition-all duration-300 ease-out
      hover:-translate-y-1 hover:border-[#2C62E0]
      hover:bg-[#2C62E0] hover:text-white hover:shadow-md"
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
