
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { COLORS } from "@/config/theme";

/**
 * Compact dropdown used for sorting and filters.
 *   align="left"  opens the list from the left edge (for full-width filters)
 *   fullWidth     button stretches to its container at every screen size
 *   label         accessible name of the list
 */
export default function SortDropdown({
  value,
  options,
  onChange,
  align = "right",
  fullWidth = false,
  label = "Sort options",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex w-full min-w-0 items-center justify-between gap-3
          rounded-xl border border-[#E5E9F2] bg-white px-3 py-2
          text-[13px] font-normal shadow-sm transition-colors
          hover:border-[#2C62E0] focus:outline-none
          focus:ring-2 focus:ring-[#2C62E0]/20 ${fullWidth ? "" : "sm:w-auto sm:min-w-[180px]"}`}
        style={{ color: COLORS.navy }}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute top-full z-50 mt-2
            max-h-[60vh] overflow-y-auto
            max-w-[calc(100vw-32px)]
            rounded-2xl border border-[#E5E9F2]
            bg-white p-2 shadow-xl ${
              align === "left" ? "left-0 w-full min-w-[220px]" : "right-0 w-[230px]"
            }`}
        >
          {options.map((option) => {
            const selected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3
                  rounded-xl px-3 py-2 text-left text-[13px]
                  transition-colors ${
                    selected
                      ? "bg-[#EAF0FF] font-medium text-[#2C62E0]"
                      : "text-[#0E1A3D] hover:bg-[#F6F8FC]"
                  }`}
              >
                <span>{option.label}</span>
                {selected && (
                  <Check size={16} className="shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
