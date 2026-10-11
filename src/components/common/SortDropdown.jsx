
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { COLORS } from "@/config/theme";

export default function SortDropdown({
  value,
  options,
  onChange,
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
        className="flex w-full min-w-0 items-center justify-between gap-3
          rounded-xl border border-[#E5E9F2] bg-white px-3 py-2.5
          text-sm font-medium shadow-sm transition-colors
          hover:border-[#2C62E0] focus:outline-none
          focus:ring-2 focus:ring-[#2C62E0]/20 sm:w-auto sm:min-w-[180px]"
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
          aria-label="Sort options"
          className="absolute right-0 top-full z-50 mt-2
            w-[230px] max-w-[calc(100vw-32px)]
            rounded-2xl border border-[#E5E9F2]
            bg-white p-2 shadow-xl"
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
                  rounded-xl px-3 py-2.5 text-left text-sm
                  transition-colors ${
                    selected
                      ? "bg-[#EAF0FF] font-semibold text-[#2C62E0]"
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
