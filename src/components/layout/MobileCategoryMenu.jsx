import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home, Tags } from "lucide-react";

import { COLORS } from "@/config/theme";
import { brandUrl, categoryUrl, useCategoryTree } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";

const BRANDS = "__brands__";

/**
 * Full-screen mobile menu, laid out like Decathlon's:
 *   left  — a rail of departments (plus Brands) as image tiles
 *   right — the selected department's categories as sections of image tiles
 */
export default function MobileCategoryMenu({ open, onClose }) {
  const { tree } = useCategoryTree();
  const { brands } = useBrands();
  const [selected, setSelected] = useState(null);

  const selectedSlug = selected || tree[0]?.slug;
  const department = tree.find((d) => d.slug === selectedSlug);

  // Lock page scroll while the menu covers the screen.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Categories"
      aria-hidden={!open}
      onKeyDown={(event) => event.key === "Escape" && onClose()}
      className={`fixed inset-0 z-[90] flex flex-col bg-white transition-transform duration-300 ease-out md:hidden ${
        open ? "translate-x-0" : "pointer-events-none -translate-x-full"
      }`}
      style={{ fontFamily: '"Manrope", sans-serif' }}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-[#E5E9F2] px-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center text-[#0E1A3D]"
        >
          <ChevronLeft size={24} />
        </button>

        <h2 className="flex-1 text-center text-lg font-bold" style={{ color: COLORS.navy }}>
          Categories
        </h2>

        <Link
          to="/"
          onClick={onClose}
          aria-label="Home"
          className="flex h-10 w-10 items-center justify-center text-[#0E1A3D]"
        >
          <Home size={21} />
        </Link>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left rail */}
        <nav className="w-[92px] shrink-0 overflow-y-auto border-r border-[#E5E9F2] py-3" aria-label="Departments">
          {tree.map((item) => (
            <RailItem
              key={item.slug}
              label={item.name}
              image={item.image}
              active={item.slug === selectedSlug}
              onSelect={() => setSelected(item.slug)}
            />
          ))}

          {brands.length > 0 && (
            <RailItem
              label="Brands"
              icon={<Tags size={26} style={{ color: COLORS.blue }} />}
              active={selectedSlug === BRANDS}
              onSelect={() => setSelected(BRANDS)}
            />
          )}
        </nav>

        {/* Right pane */}
        <div key={selectedSlug} className="min-w-0 flex-1 overflow-y-auto px-3 pb-10 pt-4">
          {selectedSlug === BRANDS ? (
            <BrandsPane brands={brands} onNavigate={onClose} />
          ) : department ? (
            <DepartmentPane department={department} onNavigate={onClose} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LEFT RAIL
========================================================= */

function RailItem({ label, image, icon, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className="relative mb-4 flex w-full flex-col items-center px-2"
    >
      {/* selected marker on the left edge */}
      <span
        className={`absolute left-0 top-5 h-8 w-1 rounded-r-full transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundColor: COLORS.blue }}
      />

      <span
        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#F6F8FC] transition-all"
        style={{
          border: active ? `2px solid ${COLORS.blue}` : "1px solid #E5E9F2",
          boxShadow: active ? "0 0 0 3px rgba(44,98,224,0.12)" : "none",
        }}
      >
        {image ? (
          <img src={image} alt="" loading="lazy" className="h-full w-full object-contain p-1.5" />
        ) : (
          icon
        )}
      </span>

      <span
        className="mt-1.5 text-center text-[12px] leading-tight"
        style={{ color: active ? COLORS.blue : COLORS.slate, fontWeight: active ? 600 : 500 }}
      >
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   RIGHT PANE
========================================================= */

function SectionTitle({ children, large = false }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h3
        className={`shrink-0 ${large ? "text-xl" : "text-base"} font-semibold`}
        style={{ color: COLORS.navy }}
      >
        {children}
      </h3>
      <span className="h-px flex-1 bg-[#E5E9F2]" />
    </div>
  );
}

function Tile({ to, image, label, count, onNavigate }) {
  return (
    <Link to={to} onClick={onNavigate} className="group block min-w-0">
      <span className="block aspect-square overflow-hidden rounded-2xl border border-[#E5E9F2] bg-[#F6F8FC]">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-active:scale-95"
          />
        ) : null}
      </span>
      <span className="mt-1.5 line-clamp-2 block text-center text-[12px] font-medium leading-tight" style={{ color: COLORS.navy }}>
        {label}
      </span>
      {count != null && (
        <span className="block text-center text-[11px]" style={{ color: COLORS.slateLight }}>
          {count}
        </span>
      )}
    </Link>
  );
}

function DepartmentPane({ department, onNavigate }) {
  // Categories with sub-categories get their own section; the rest are grouped.
  const withChildren = department.children.filter((c) => c.children.length > 0);
  const leaves = department.children.filter((c) => c.children.length === 0);

  return (
    <>
      <SectionTitle large>{department.name}</SectionTitle>

      <Link
        to={categoryUrl(department.slug)}
        onClick={onNavigate}
        className="mb-5 inline-block text-sm font-semibold"
        style={{ color: COLORS.blue }}
      >
        View all {department.productCount} products →
      </Link>

      {withChildren.map((category) => (
        <section key={category.slug} className="mb-6">
          <SectionTitle>{category.name}</SectionTitle>
          <div className="grid grid-cols-3 gap-x-2.5 gap-y-4">
            <Tile
              to={categoryUrl(category.slug)}
              image={category.image}
              label={`All ${category.name}`}
              onNavigate={onNavigate}
            />
            {category.children.map((sub) => (
              <Tile key={sub.slug} to={categoryUrl(sub.slug)} image={sub.image} label={sub.name} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      ))}

      {leaves.length > 0 && (
        <section className="mb-6">
          <SectionTitle>{withChildren.length ? `More in ${department.name}` : "Shop by Category"}</SectionTitle>
          <div className="grid grid-cols-3 gap-x-2.5 gap-y-4">
            {leaves.map((category) => (
              <Tile
                key={category.slug}
                to={categoryUrl(category.slug)}
                image={category.image}
                label={category.name}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function BrandsPane({ brands, onNavigate }) {
  return (
    <>
      <SectionTitle large>Brands</SectionTitle>

      <Link to="/brands" onClick={onNavigate} className="mb-5 inline-block text-sm font-semibold" style={{ color: COLORS.blue }}>
        View all brands →
      </Link>

      <div className="grid grid-cols-3 gap-x-2.5 gap-y-4">
        {brands.map((brand) => (
          <Tile
            key={brand.slug}
            to={brandUrl(brand.slug)}
            image={brand.image}
            label={brand.name}
            count={`${brand.productCount} products`}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </>
  );
}
