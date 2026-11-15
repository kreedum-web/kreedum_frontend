import { useEffect, useRef, useState } from "react";
import { LayoutGrid, Package, Smile } from "lucide-react";

import { HAPPY_CUSTOMERS } from "@/config/contact";

// The word that changes in the heading.
const AUDIENCES = ["home gyms", "schools", "fitness centres", "sports academies", "offices"];

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Round down to a tidy number for "1,800+" style figures. */
function tidy(value) {
  const n = Math.max(0, Math.floor(Number(value) || 0));
  if (n >= 1000) return Math.floor(n / 100) * 100;
  if (n >= 100) return Math.floor(n / 10) * 10;
  return n;
}

/** True once the element has scrolled into view (stays true). */
function useSeen(ref) {
  // Very old browsers: show the numbers straight away.
  const [seen, setSeen] = useState(() => typeof window === "undefined" || !("IntersectionObserver" in window));
  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, seen]);
  return seen;
}

/** Counts from 0 up to `to` once `start` is true. */
function CountUp({ to, start, duration = 1600, delay = 0 }) {
  const [value, setValue] = useState(0);
  const still = reduceMotion(); // no animation: show the number as it is

  useEffect(() => {
    if (!start || still) return undefined;
    let frame;
    let begin = null;
    const tick = (time) => {
      if (begin === null) begin = time + delay;
      const progress = Math.min(1, Math.max(0, (time - begin) / duration));
      const eased = 1 - (1 - progress) ** 3; // fast, then settles
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, start, duration, delay, still]);

  return (still && start ? to : value).toLocaleString("en-IN");
}

/** "Trusted by home gyms / schools / …" — the last word changes every few seconds. */
function RotatingWord({ words, active }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || reduceMotion()) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % words.length), 2400);
    return () => clearInterval(timer);
  }, [active, words.length]);

  return (
    <span className="block h-[1.35em] overflow-hidden text-[#8FADFF]">
      <span key={index} className="kr-word-in inline-block whitespace-nowrap">
        {words[index]}
      </span>
    </span>
  );
}

/**
 * Homepage numbers: products and categories come live from the store;
 * happy customers from src/config/contact.js. Numbers count up when the
 * section scrolls into view.
 */
export default function StatsSection({ stats }) {
  const ref = useRef(null);
  const seen = useSeen(ref);

  const items = [
    { icon: Package, value: tidy(stats?.totalProducts), label: "Products" },
    { icon: LayoutGrid, value: tidy(stats?.totalCategories), label: "Categories" },
    { icon: Smile, value: HAPPY_CUSTOMERS, label: "Happy customers" },
  ].filter((item) => item.value > 0);

  if (!items.length) return null;

  return (
    <section ref={ref} aria-label="Kreedum in numbers" className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:py-4">
      <div className="relative overflow-hidden rounded-2xl bg-[#0E1A3D] px-4 py-6 md:px-10 md:py-9">
        {/* soft glow */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#2C62E0] opacity-30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#1F49B8] opacity-25 blur-3xl" />

        <div className="relative md:flex md:items-center md:gap-10">
          <div className="mb-5 text-center md:mb-0 md:w-[290px] md:shrink-0 md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 md:text-xs">Kreedum in numbers</p>
            <h2 className="mt-1.5 text-lg font-bold leading-snug text-white md:text-[26px]">
              Trusted by
              <RotatingWord words={AUDIENCES} active={seen} />
              across India
            </h2>
          </div>

          <div className={`grid flex-1 gap-2 md:gap-4 ${items.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {items.map(({ icon: Icon, value, label }, index) => (
              <div
                key={label}
                className={`rounded-xl bg-white/[0.06] px-2 py-3 text-center ring-1 ring-white/10 transition-all duration-700 ease-out md:px-4 md:py-5 ${
                  seen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#2C62E0]/25 text-[#8FADFF] md:h-11 md:w-11">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </span>
                <p className="mt-2 text-xl font-extrabold tabular-nums tracking-tight text-white md:text-4xl">
                  <CountUp to={value} start={seen} delay={index * 120} />
                  <span className="text-[#8FADFF]">+</span>
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-white/60 md:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
