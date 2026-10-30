import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { COLORS } from "@/config/theme";

/**
 * The site's one dropdown — used for sorting, filters and form fields.
 *
 *   options     [{ label, value }]
 *   variant     "compact" (sort / filter bars) | "field" (forms: same height
 *               and border as the text inputs next to it)
 *   align       "right" | "left" — which edge the list opens from
 *               ("field" always opens full width from the left)
 *   fullWidth   compact button stretches to its container at every size
 *   name        also renders a hidden input, so the value is sent with a
 *               plain <form> / FormData just like a <select>
 *   id          put on the button, so a <label htmlFor> points at it
 *   label       accessible name of the list
 *   className   extra classes for the wrapper (e.g. spacing)
 *   maxVisible  rows shown before the list scrolls (default: up to 60% of the screen)
 *   placeholder text on the button while nothing is chosen (not listed as an option)
 */
export default function Dropdown({
  value,
  options,
  onChange,
  variant = "compact",
  align = "right",
  fullWidth = false,
  name,
  id,
  label = "Options",
  className = "",
  maxVisible,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const isField = variant === "field";

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
    options.find((option) => option.value === value) || (placeholder ? null : options[0]);

  const buttonSize = isField
    ? "min-h-[46px] border-[#DDE4F2] px-3 py-3 text-sm focus:border-[#2C62E0] focus:ring-[#2C62E0]/10"
    : `border-[#E5E9F2] px-3 py-2 text-[13px] shadow-sm focus:ring-[#2C62E0]/20 ${
        fullWidth ? "" : "sm:w-auto sm:min-w-[180px]"
      }`;

  const listPosition =
    isField || align === "left" ? "left-0 w-full min-w-[220px]" : "right-0 w-[230px]";

  return (
    <div ref={menuRef} className={`relative ${isField ? "w-full" : ""} ${className}`}>
      {name && <input type="hidden" name={name} value={selectedOption?.value ?? ""} />}

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex w-full min-w-0 items-center justify-between gap-3
          rounded-xl border bg-white font-normal transition-colors
          hover:border-[#2C62E0] focus:outline-none focus:ring-2 ${buttonSize}`}
        style={{ color: COLORS.navy }}
      >
                <span className={`truncate ${selectedOption ? "" : "text-gray-500"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
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
          // each row is 2.25rem tall, plus the list's 0.5rem padding top and bottom
          style={maxVisible ? { maxHeight: `calc(${maxVisible} * 2.25rem + 1rem)` } : undefined}
          className={`absolute top-full z-50 mt-2
            max-h-[60vh] overflow-y-auto
            max-w-[calc(100vw-32px)]
            rounded-2xl border border-[#E5E9F2]
            bg-white p-2 shadow-xl ${listPosition}`}
        >
          {options.map((option) => {
            const selected = selectedOption?.value === option.value;

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
                  rounded-xl px-3 py-2 text-left text-[13px] font-normal
                  transition-colors ${
                    selected
                      ? "bg-[#EAF0FF] font-medium text-[#2C62E0]"
                      : "text-[#0E1A3D] hover:bg-[#F6F8FC]"
                  }`}
              >
                <span>{option.label}</span>
                {selected && <Check size={16} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
