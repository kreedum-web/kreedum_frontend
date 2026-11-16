import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

import { COLORS } from "@/config/theme";
import { categoryUrl, useCategoryTree } from "@/hooks/useCategories";

/**
 * Desktop "Categories" item with a mega menu: departments (with a small
 * picture) on the left, the hovered department's categories and
 * sub-categories as picture tiles on the right, like the mobile menu.
 *
 * The panel is positioned against the nearest `relative` ancestor
 * (the desktop navbar bar), so it spans the bar's full width.
 */
/** One category: picture with its name underneath (like the mobile menu). */
function MenuTile({ to, image, label, count }) {
  return (
    <Link to={to} title={label} className="group block min-w-0">
      <span className="block aspect-square overflow-hidden rounded-xl border border-[#E5E9F2] bg-[#F6F8FC] transition-all duration-200 group-hover:border-[#2C62E0] group-hover:shadow-md">
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </span>
      <span className="mt-1.5 line-clamp-2 block text-center text-[12px] font-semibold leading-tight text-[#0E1A3D] transition-colors group-hover:text-[#2C62E0]">
        {label}
      </span>
      {count != null && <span className="block text-center text-[11px] text-[#8A93A6]">{count} products</span>}
    </Link>
  );
}

function SectionHeading({ to, children }) {
  return (
    <div className="mb-2.5 flex items-center gap-3">
      <Link to={to} className="shrink-0 text-sm font-bold text-[#0E1A3D] hover:text-[#2C62E0]">
        {children}
      </Link>
      <span className="h-px flex-1 bg-[#E5E9F2]" />
    </div>
  );
}

/** Categories with sub-categories get their own row of pictures; the rest share one. */
function DepartmentTiles({ department }) {
  const withChildren = department.children.filter((c) => c.children.length > 0);
  const leaves = department.children.filter((c) => c.children.length === 0);
  const grid = "grid grid-cols-6 gap-x-3 gap-y-4 xl:grid-cols-8";

  return (
    <div className="space-y-6">
      {withChildren.map((category) => (
        <section key={category.slug}>
          <SectionHeading to={categoryUrl(category.slug)}>{category.name}</SectionHeading>
          <div className={grid}>
            {category.children.map((sub) => (
              <MenuTile key={sub.slug} to={categoryUrl(sub.slug)} image={sub.image} label={sub.name} count={sub.productCount} />
            ))}
          </div>
        </section>
      ))}

      {leaves.length > 0 && (
        <section>
          {withChildren.length > 0 && (
            <SectionHeading to={categoryUrl(department.slug)}>More in {department.name}</SectionHeading>
          )}
          <div className={grid}>
            {leaves.map((category) => (
              <MenuTile key={category.slug} to={categoryUrl(category.slug)} image={category.image} label={category.name} count={category.productCount} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function CategoryMegaMenu({ linkColor, activeColor }) {
  const location = useLocation();
  const { tree } = useCategoryTree();

  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(null);
  const closeTimer = useRef(null);

  const isActive = location.pathname.startsWith("/categories");
  const department = tree.find((d) => d.slug === activeSlug) || tree[0];

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Close after a link inside the menu is clicked.
  const closeOnNavigate = (event) => {
    if (event.target.closest("a")) {
      clearTimeout(closeTimer.current);
      setOpen(false);
    }
  };

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  // Small delay so moving the pointer from the link to the panel doesn't close it.
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
      onClick={closeOnNavigate}
    >
      <Link
        to="/categories"
        aria-haspopup="true"
        aria-expanded={open}
        className="group relative flex items-center gap-1 py-2 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5"
        style={{
          color: isActive ? activeColor : linkColor,
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        Categories
        <ChevronDown
          size={15}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <span
          className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#2C62E0] transition-all duration-300 ease-out ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>

      {open && tree.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 px-6 pt-2">
          <div
            className="mx-auto flex max-w-7xl overflow-hidden rounded-2xl border border-[#E5E9F2] bg-white shadow-xl"
            style={{ fontFamily: '"Manrope", sans-serif' }}
          >
            {/* Departments */}
            <ul className="max-h-[70vh] w-64 shrink-0 overflow-y-auto border-r border-[#E5E9F2] bg-[#F6F8FC] p-2">
              {tree.map((item) => {
                const selected = item.slug === department?.slug;

                return (
                  <li key={item.slug}>
                    <Link
                      to={categoryUrl(item.slug)}
                      onMouseEnter={() => setActiveSlug(item.slug)}
                      onFocus={() => setActiveSlug(item.slug)}
                      className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors"
                      style={{
                        color: selected ? COLORS.blue : COLORS.navy,
                        backgroundColor: selected ? COLORS.white : "transparent",
                      }}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E5E9F2] bg-white">
                          {item.image && <img src={item.image} alt="" loading="lazy" className="h-full w-full object-contain p-0.5" />}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </span>
                      <ChevronRight size={16} className={`shrink-0 ${selected ? "" : "opacity-40"}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Categories of the selected department */}
            {department && (
              <div className="max-h-[70vh] min-w-0 flex-1 overflow-y-auto p-5">
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A93A6]">
                    {department.name}
                  </p>

                  <Link
                    to={categoryUrl(department.slug)}
                    className="text-sm font-semibold"
                    style={{ color: COLORS.blue }}
                  >
                    View all {department.productCount} →
                  </Link>
                </div>

               {department.children.length > 0 && (
  <DepartmentTiles department={department} />
)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
