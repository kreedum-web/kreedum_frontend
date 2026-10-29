import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { COLORS } from "@/config/theme";
import { categoryUrl, useCategoryTree } from "@/hooks/useCategories";

/**
 * "Shop by Category" section for the mobile menu dropdown.
 * Departments expand to show their categories; sub-categories are listed under each.
 */
export default function MobileCategoryMenu({ onNavigate }) {
  const { tree } = useCategoryTree();
  const [expanded, setExpanded] = useState(null);

  if (!tree.length) return null;

  return (
    <div className="mt-1 border-t border-[#E5E9F2] pt-1">
      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A93A6]">
        Shop by Category
      </p>

      {tree.map((department) => {
        const isOpen = expanded === department.slug;
        const hasChildren = department.children.length > 0;

        return (
          <div key={department.slug}>
            {hasChildren ? (
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : department.slug)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors hover:bg-[#EAF0FF]"
                style={{ color: isOpen ? COLORS.blue : COLORS.navy }}
              >
                <span>{department.name}</span>
                <ChevronDown
                  size={17}
                  className={`text-[#8A93A6] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <Link
                to={categoryUrl(department.slug)}
                onClick={onNavigate}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-[#EAF0FF]"
                style={{ color: COLORS.navy }}
              >
                <span>{department.name}</span>
                <span className="text-[#8A93A6]">→</span>
              </Link>
            )}

            {isOpen && (
              <div className="mb-1 ml-3 border-l border-[#E5E9F2] pl-2">
                <Link
                  to={categoryUrl(department.slug)}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{ color: COLORS.blue }}
                >
                  All {department.name} ({department.productCount})
                </Link>

                {department.children.map((category) => (
                  <div key={category.slug}>
                    <Link
                      to={categoryUrl(category.slug)}
                      onClick={onNavigate}
                      className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#EAF0FF]"
                      style={{ color: COLORS.navy }}
                    >
                      {category.name}
                    </Link>

                    {category.children.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={categoryUrl(sub.slug)}
                        onClick={onNavigate}
                        className="block rounded-lg py-1.5 pl-6 pr-3 text-[13px] transition-colors hover:bg-[#EAF0FF]"
                        style={{ color: COLORS.slate }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
