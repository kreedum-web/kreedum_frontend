import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { COLORS } from "@/config/theme";
import { activeFilterCount } from "@/utils/listingFilters";
import PriceRangeSlider from "./PriceRangeSlider";

const BRANDS_SHOWN = 8;

/**
 * Filter panel for product lists (search and category pages): brand tick
 * boxes (several at once) and a price range.
 *
 *   facets    { brands: [{ slug, name, count }], price: { min, max } } from the API
 *   filters   { brands: [slug], minPrice, maxPrice }
 *   onChange(changes)  e.g. { brands: [...] } or { minPrice, maxPrice }
 *
 * Desktop: Brand and Price dropdowns in the toolbar (<ProductFilters.Bar>).
 * Phone: a "Filters" button that opens a panel from the bottom (<ProductFilters.MobileButton>).
 */
function FilterSections({ facets, filters, onChange }) {
  const brands = facets?.brands || [];
  const price = facets?.price;
  const count = activeFilterCount(filters);

  return (
    <div className="space-y-6">
      {count > 0 && (
        <button
          type="button"
          onClick={() => onChange({ brands: [], minPrice: null, maxPrice: null })}
          className="text-[13px] font-semibold hover:underline"
          style={{ color: COLORS.blue }}
        >
          Clear all filters ({count})
        </button>
      )}

      {price && price.max > price.min && (
        <section>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.navy }}>
            Price
          </h3>
          <PriceRangeSlider
            bounds={price}
            min={filters.minPrice}
            max={filters.maxPrice}
            onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
          />
        </section>
      )}

      {brands.length > 0 && (
        <BrandChecklist brands={brands} chosen={filters.brands} onChange={(next) => onChange({ brands: next })} />
      )}
    </div>
  );
}

function BrandChecklist({ brands, chosen, onChange, title = true }) {
  const [find, setFind] = useState("");
  const [all, setAll] = useState(false);
  const text = find.trim().toLowerCase();
  const matching = text ? brands.filter((b) => b.name.toLowerCase().includes(text)) : brands;
  // Ticked brands first, so they're never hidden behind "Show all".
  const ordered = [...matching.filter((b) => chosen.includes(b.slug)), ...matching.filter((b) => !chosen.includes(b.slug))];
  const shown = all || text ? ordered : ordered.slice(0, Math.max(BRANDS_SHOWN, chosen.length));

  const toggle = (slug) => onChange(chosen.includes(slug) ? chosen.filter((s) => s !== slug) : [...chosen, slug]);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.navy }}>
          {title ? "Brand" : `${chosen.length || "No"} selected`}
        </h3>
        {chosen.length > 0 && (
          <button type="button" onClick={() => onChange([])} className="text-[12px] font-medium text-gray-400 hover:text-gray-600">
            Clear
          </button>
        )}
      </div>

      {brands.length > BRANDS_SHOWN && (
        <label className="mb-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-[#2C62E0]">
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <input
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Find a brand"
            className="w-full bg-transparent py-2 text-[13px] outline-none"
            aria-label="Find a brand"
          />
        </label>
      )}

      <ul className="space-y-0.5">
        {shown.map((b) => {
          const on = chosen.includes(b.slug);
          const empty = !on && b.count === 0;
          return (
            <li key={b.slug}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-[#EAF0FF] ${empty ? "opacity-45" : ""}`}
              >
                <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggle(b.slug)} />
                <span
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#2C62E0]/40"
                  style={{ borderColor: on ? COLORS.blue : "#C9D1E3", backgroundColor: on ? COLORS.blue : COLORS.white }}
                  aria-hidden="true"
                >
                  {on && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13.5px]" style={{ color: COLORS.navy, fontWeight: on ? 650 : 500 }}>
                  {b.name}
                </span>
                <span className="text-[12px] tabular-nums text-gray-400">{b.count}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {text && matching.length === 0 && <p className="px-1.5 py-2 text-[13px] text-gray-400">No brand called “{find}”.</p>}
      {!text && brands.length > shown.length && (
        <button type="button" onClick={() => setAll(true)} className="mt-1 px-1.5 text-[13px] font-semibold" style={{ color: COLORS.blue }}>
          Show all {brands.length} brands
        </button>
      )}
      {!text && all && brands.length > BRANDS_SHOWN && (
        <button type="button" onClick={() => setAll(false)} className="mt-1 px-1.5 text-[13px] font-semibold" style={{ color: COLORS.blue }}>
          Show fewer
        </button>
      )}
    </section>
  );
}

/** A toolbar button that opens a panel under it (closes on a click outside or Esc). */
function Popover({ label, active, width = "w-72", align = "left", children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-w-[150px] items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2 text-[13px] shadow-sm transition-colors hover:border-[#2C62E0] focus:outline-none focus:ring-2 focus:ring-[#2C62E0]/20"
        style={{
          color: active ? COLORS.blueDark : COLORS.navy,
          borderColor: active ? "#C9D6F7" : "#E5E9F2",
          backgroundColor: active ? COLORS.tint : COLORS.white,
          fontWeight: active ? 600 : 400,
        }}
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className={`absolute top-full z-50 mt-2 max-w-[calc(100vw-32px)] rounded-2xl border border-[#E5E9F2] bg-white p-4 shadow-xl ${width} ${align === "right" ? "right-0" : "left-0"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

const shortRupees = (n) =>
  n >= 100000 ? `₹${+(n / 100000).toFixed(2)}L` : n >= 1000 ? `₹${+(n / 1000).toFixed(1)}k` : `₹${n}`;

/** Desktop toolbar (hidden on phones): Brand and Price dropdowns. */
function Bar({ facets, filters, onChange }) {
  const brands = facets?.brands || [];
  const price = facets?.price;
  const chosen = filters.brands;
  const priced = filters.minPrice != null || filters.maxPrice != null;
  const nameOf = (slug) => brands.find((b) => b.slug === slug)?.name || slug;

  const brandLabel = !chosen.length ? "All Brands" : chosen.length === 1 ? nameOf(chosen[0]) : `${nameOf(chosen[0])} +${chosen.length - 1}`;
  const priceLabel = !priced
    ? "Any Price"
    : filters.minPrice != null && filters.maxPrice != null
      ? `${shortRupees(filters.minPrice)} – ${shortRupees(filters.maxPrice)}`
      : filters.maxPrice != null
        ? `Under ${shortRupees(filters.maxPrice)}`
        : `Above ${shortRupees(filters.minPrice)}`;

  return (
    <div className="hidden items-center gap-2 md:flex">
      {brands.length > 0 && (
        <>
          <span className="whitespace-nowrap text-[13px] text-gray-500">Brand</span>
          <Popover label={brandLabel} active={chosen.length > 0}>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <BrandChecklist brands={brands} chosen={chosen} onChange={(next) => onChange({ brands: next })} title={false} />
            </div>
          </Popover>
        </>
      )}
      {price && price.max > price.min && (
        <>
          <span className="ml-2 whitespace-nowrap text-[13px] text-gray-500">Price</span>
          <Popover label={priceLabel} active={priced} width="w-80">
            <PriceRangeSlider
              bounds={price}
              min={filters.minPrice}
              max={filters.maxPrice}
              onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
            />
            {priced && (
              <button
                type="button"
                onClick={() => onChange({ minPrice: null, maxPrice: null })}
                className="mt-3 text-[13px] font-semibold hover:underline"
                style={{ color: COLORS.blue }}
              >
                Any price
              </button>
            )}
          </Popover>
        </>
      )}
    </div>
  );
}

/** Phone: "Filters (2)" button and a panel that slides up. */
function MobileButton({ total, ...props }) {
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(props.filters);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[13px] font-semibold md:hidden"
        style={{ color: COLORS.navy }}
      >
        <SlidersHorizontal className="h-4 w-4" style={{ color: COLORS.blue }} />
        Filters
        {count > 0 && (
          <span className="rounded-full px-1.5 text-[11px] text-white" style={{ backgroundColor: COLORS.blue }}>
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" className="absolute inset-0 bg-[#0E1A3D]/50" onClick={() => setOpen(false)} aria-label="Close filters" />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-[16px] font-bold" style={{ color: COLORS.navy }}>
                Filters
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-gray-100" aria-label="Close">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterSections {...props} />
            </div>
            <div className="border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-xl py-3 text-[14px] font-semibold text-white"
                style={{ backgroundColor: COLORS.blue }}
              >
                Show {total ?? ""} product{total === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Chips above the products for the filters in use, each with an ×. */
function ActiveChips({ facets, filters, onChange }) {
  const nameOf = (slug) => facets?.brands?.find((b) => b.slug === slug)?.name || slug;
  const priced = filters.minPrice != null || filters.maxPrice != null;
  if (!filters.brands.length && !priced) return null;
  const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const priceLabel =
    filters.minPrice != null && filters.maxPrice != null
      ? `${rupee(filters.minPrice)} – ${rupee(filters.maxPrice)}`
      : filters.maxPrice != null
        ? `Under ${rupee(filters.maxPrice)}`
        : `Above ${rupee(filters.minPrice)}`;

  const chip = (key, label, remove) => (
    <button
      key={key}
      type="button"
      onClick={remove}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#C9D6F7] bg-[#EAF0FF] px-3 py-1 text-[12.5px] font-medium transition-colors hover:border-[#2C62E0]"
      style={{ color: COLORS.blueDark }}
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {filters.brands.map((slug) => chip(slug, nameOf(slug), () => onChange({ brands: filters.brands.filter((s) => s !== slug) })))}
      {priced && chip("price", priceLabel, () => onChange({ minPrice: null, maxPrice: null }))}
    </div>
  );
}

const ProductFilters = { Bar, MobileButton, ActiveChips };
export default ProductFilters;
