import { useState } from "react";
import { COLORS } from "@/config/theme";
import { rupees } from "@/utils/listingFilters";

/** Slider steps that suit the range: ₹10 for small amounts, ₹500 for machines. */
function stepFor(span) {
  if (span > 200000) return 1000;
  if (span > 50000) return 500;
  if (span > 10000) return 100;
  if (span > 1000) return 50;
  return 10;
}

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

/**
 * Price range: two handles on one track, plus Min / Max boxes for typing.
 *
 *   bounds    { min, max } of the products in view
 *   min, max  the chosen range (null = no limit on that side)
 *   onChange(min, max)  when a handle is let go or a box is done; null where
 *             the range reaches the end of the bounds
 */
export default function PriceRangeSlider({ bounds, min, max, onChange }) {
  const lowest = bounds.min;
  const highest = Math.max(bounds.max, bounds.min + 1);
  const step = stepFor(highest - lowest);
  const fromProps = () => [clamp(min ?? lowest, lowest, highest), clamp(max ?? highest, lowest, highest)];

  const [range, setRange] = useState(fromProps);
  const [typed, setTyped] = useState(null); // { min, max } strings while typing
  // New bounds or a filter changed elsewhere (e.g. "Clear all"): follow it.
  const key = `${lowest}:${highest}:${min}:${max}`;
  const [seenKey, setSeenKey] = useState(key);
  if (seenKey !== key) {
    setSeenKey(key);
    setRange(fromProps());
    setTyped(null);
  }

  const [low, high] = range;
  const commit = (nextLow = low, nextHigh = high) => {
    const a = clamp(Math.min(nextLow, nextHigh), lowest, highest);
    const b = clamp(Math.max(nextLow, nextHigh), lowest, highest);
    setRange([a, b]);
    const newMin = a <= lowest ? null : a;
    const newMax = b >= highest ? null : b;
    if (newMin !== (min ?? null) || newMax !== (max ?? null)) onChange(newMin, newMax);
  };

  const percent = (n) => ((n - lowest) / (highest - lowest)) * 100;
  const sliderProps = {
    type: "range",
    min: lowest,
    max: highest,
    step,
    className: "price-range",
    onPointerUp: () => commit(),
    onKeyUp: () => commit(),
    onTouchEnd: () => commit(),
  };

  const box = (side) => {
    const value = typed ? typed[side] : String(side === "min" ? low : high);
    const done = () => {
      if (!typed) return;
      const n = Number(String(typed[side]).replace(/[^\d]/g, ""));
      setTyped(null);
      if (!Number.isFinite(n) || typed[side] === "") return commit();
      return side === "min" ? commit(n, high) : commit(low, n);
    };
    return (
      <label className="flex-1">
        <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">{side === "min" ? "Min" : "Max"}</span>
        <span className="flex items-center rounded-xl border border-gray-200 bg-white px-2.5 focus-within:border-[#2C62E0]">
          <span className="text-[13px] text-gray-400">₹</span>
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => setTyped({ min: String(low), max: String(high), ...typed, [side]: e.target.value })}
            onBlur={done}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="w-full min-w-0 bg-transparent px-1 py-2 text-[13px] font-semibold outline-none"
            style={{ color: COLORS.navy }}
            aria-label={side === "min" ? "Minimum price" : "Maximum price"}
          />
        </span>
      </label>
    );
  };

  return (
    <div>
      <p className="mb-4 text-[15px] font-bold" style={{ color: COLORS.navy }}>
        {rupees(low)} – {rupees(high)}
        {high >= highest && "+"}
      </p>

      <div className="relative h-5 px-0">
        {/* track and the chosen part of it */}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#E3E8F4]" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{ left: `${percent(low)}%`, right: `${100 - percent(high)}%`, backgroundColor: COLORS.blue }}
        />
        <input
          {...sliderProps}
          value={low}
          aria-label="Minimum price"
          // the low handle sits on top when both are at the right end
          style={{ zIndex: low > highest - step ? 5 : 3 }}
          onChange={(e) => setRange([Math.min(Number(e.target.value), high), high])}
        />
        <input
          {...sliderProps}
          value={high}
          aria-label="Maximum price"
          style={{ zIndex: 4 }}
          onChange={(e) => setRange([low, Math.max(Number(e.target.value), low)])}
        />
      </div>

      <div className="mt-4 flex items-end gap-2">
        {box("min")}
        <span className="pb-2.5 text-gray-300">–</span>
        {box("max")}
      </div>
    </div>
  );
}
