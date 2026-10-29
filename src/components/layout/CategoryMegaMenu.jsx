import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

import { COLORS } from "@/config/theme";
import { categoryUrl, useCategoryTree } from "@/hooks/useCategories";

/**
 * Desktop "Categories" item with a Metro Sports style mega menu:
 * departments on the left, the hovered department's categories and
 * sub-categories on the right.
 *
 * The panel is positioned against the nearest `relative` ancestor
 * (the desktop navbar bar), so it spans the bar's full width.
 */
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
            <ul className="w-60 shrink-0 border-r border-[#E5E9F2] bg-[#F6F8FC] p-2">
              {tree.map((item) => {
                const selected = item.slug === department?.slug;

                return (
                  <li key={item.slug}>
                    <Link
                      to={categoryUrl(item.slug)}
                      onMouseEnter={() => setActiveSlug(item.slug)}
                      onFocus={() => setActiveSlug(item.slug)}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors"
                      style={{
                        color: selected ? COLORS.blue : COLORS.navy,
                        backgroundColor: selected ? COLORS.white : "transparent",
                      }}
                    >
                      <span>{item.name}</span>
                      <ChevronRight size={16} className={selected ? "" : "opacity-40"} />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Categories of the selected department */}
            {department && (
              <div className="max-h-[70vh] min-w-0 flex-1 overflow-y-auto p-6">
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

                {department.children.length === 0 ? (
                  <Link
                    to={categoryUrl(department.slug)}
                    className="text-sm font-medium text-[#0E1A3D] hover:text-[#2C62E0]"
                  >
                    Browse all {department.name}
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 lg:grid-cols-3">
                    {department.children.map((category) => (
                      <div key={category.slug} className="min-w-0">
                        <Link
                          to={categoryUrl(category.slug)}
                          className="block text-sm font-bold transition-colors hover:text-[#2C62E0]"
                          style={{ color: COLORS.navy }}
                        >
                          {category.name}
                          <span className="ml-1 text-xs font-medium text-[#8A93A6]">
                            ({category.productCount})
                          </span>
                        </Link>

                        {category.children.length > 0 && (
                          <ul className="mt-2 space-y-1.5">
                            {category.children.map((sub) => (
                              <li key={sub.slug}>
                                <Link
                                  to={categoryUrl(sub.slug)}
                                  className="text-sm transition-colors hover:text-[#2C62E0]"
                                  style={{ color: COLORS.slate }}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
