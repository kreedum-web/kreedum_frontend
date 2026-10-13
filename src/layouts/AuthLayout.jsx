
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Award,
  ArrowLeft,
} from "lucide-react";

import logo from "@/assets/logo.png";
import { COLORS } from "@/config/theme";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure account",
    description: "Your account and shopping details stay protected.",
  },
  {
    icon: Truck,
    title: "Sports essentials",
    description: "Explore equipment for training and performance.",
  },
  {
    icon: Award,
    title: "Kreedum Sports",
    description: "Your destination for sports and fitness equipment.",
  },
];

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <main
className="min-h-screen bg-gradient-to-br from-[#0E1A3D] via-[#1F49B8] to-[#2C62E0] px-3 py-5 sm:px-6 sm:py-8 lg:bg-none lg:p-0"  style={{ fontFamily: '"Manrope", sans-serif' }}
>
  <div className="mx-auto grid min-h-[calc(100dvh-40px)] max-w-6xl overflow-hidden bg-transparent lg:min-h-screen lg:max-w-none lg:grid-cols-2 lg:bg-white">
        {/* Brand panel */}
        <section
          className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-20"
          style={{
            background: `linear-gradient(145deg, ${COLORS.navy} 0%, ${COLORS.navySoft} 48%, ${COLORS.blueDark} 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/10"
            aria-hidden="true"
          />

          <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-3">
            <img
              src={logo}
              alt="Kreedum Sports logo"
              className="h-12 w-12 rounded-xl bg-white p-1 object-contain"
            />
            <span className="text-xl font-extrabold tracking-tight">
              Kreedum<span style={{ color: "#91B2FF" }}>Sports</span>
            </span>
          </Link>

          <div className="relative z-10 my-12 max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
              Built for every game
            </p>

            <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">
              Gear up.
              <br />
              Train harder.
              <br />
              <span className="text-blue-200">Go further.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/70">
              Discover sports equipment, fitness essentials, and
              training gear for your next performance goal.
            </p>
          </div>

          <div className="relative z-10 space-y-5">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-white/60">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="relative z-10 mt-10 text-xs text-white/45">
            © {new Date().getFullYear()} Kreedum Sports
          </p>
        </section>

        {/* Form panel */}
        <section className="flex min-w-0 items-center justify-center px-1 py-2 sm:px-8 sm:py-6 lg:bg-white lg:px-12 lg:py-10 xl:px-20">
          <div className="w-full max-w-md rounded-3xl border border-[#E5E9F2] bg-white p-3.5 shadow-2xl shadow-[#0E1A3D]/20 sm:p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#2C62E0] lg:mb-12"
              style={{ color: COLORS.slate }}
            >
              <ArrowLeft size={17} />
              Back to store
            </Link>

            {/* Mobile brand */}
            <Link
              to="/"
              className="mb-6 flex items-center gap-3 lg:hidden"
            >
              <img
                src={logo}
                alt="Kreedum Sports logo"
                className="h-11 w-11 rounded-xl border border-[#E5E9F2] bg-white p-1 object-contain"
              />
              <span className="text-lg font-extrabold tracking-tight" style={{ color: COLORS.navy }}>
                Kreedum<span style={{ color: COLORS.blue }}>Sports</span>
              </span>
            </Link>

            <div className="mb-5">
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: COLORS.blue }}
              >
                Your sports journey starts here
              </p>

              <h2
                className="text-1xl font-extrabold tracking-tight sm:text-2xl"
                style={{ color: COLORS.navy }}
              >
                {title}
              </h2>

              <p className="mt-2 text-sm leading-5 sm:text-base" style={{ color: COLORS.slate }}>
                {subtitle}
              </p>
            </div>

            {children}

            <p className="mt-4 text-center text-xs leading-5" style={{ color: COLORS.slateLight }}>
              By continuing, you agree to use your account responsibly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
