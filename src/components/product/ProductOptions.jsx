import { COLORS } from "@/config/theme";
import { findVariant } from "@/utils/productOptions";

const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

/**
 * Weight / size buttons for a product sold in several versions.
 * A value is crossed out when no version with it (and the other chosen
 * options) is in stock. With a single option, each button shows its price.
 */
export default function ProductOptions({ options, variants, selection, onChange, highlight = false }) {
  const singleOption = options.length === 1;

  const variantFor = (name, value) =>
    findVariant(options, variants, { ...selection, [name]: value }) ||
    // other options not chosen yet: any version with this value
    variants.find((variant) => variant.options?.[name] === value);

  const available = (name, value) =>
    variants.some(
      (variant) =>
        variant.inStock !== false &&
        variant.options?.[name] === value &&
        options.every(
          (option) =>
            option.name === name ||
            !selection[option.name] ||
            variant.options?.[option.name] === selection[option.name]
        )
    );

  return (
    <div className="mt-6 space-y-5">
      {options.map((option) => {
        const chosen = selection[option.name];

        return (
          <fieldset key={option.name}>
            <legend className="mb-2 text-sm" style={{ color: COLORS.navy }}>
              <span className="font-semibold">{option.name}</span>
              {chosen ? (
                <span className="text-gray-500">: {chosen}</span>
              ) : (
                <span className={highlight ? "font-medium text-red-600" : "text-gray-500"}>
                  {" "}
                  — choose one
                </span>
              )}
            </legend>

            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const selected = chosen === value;
                const inStock = available(option.name, value);
                const price = singleOption ? variantFor(option.name, value)?.sellingPrice : null;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChange(option.name, value)}
                    aria-pressed={selected}
                    title={inStock ? undefined : "Out of stock"}
                    className={`min-w-[64px] rounded-xl border px-3 py-2 text-center text-[13px] transition-colors ${
                      selected
                        ? "border-[#2C62E0] bg-[#EAF0FF] font-medium text-[#2C62E0] ring-1 ring-[#2C62E0]"
                        : highlight && !chosen
                        ? "border-red-300 bg-white text-[#0E1A3D] hover:border-[#2C62E0]"
                        : "border-gray-200 bg-white text-[#0E1A3D] hover:border-[#2C62E0]"
                    } ${inStock ? "" : "text-gray-400 line-through decoration-gray-400"}`}
                  >
                    <span className="block leading-tight">{value}</span>
                    {price ? (
                      <span
                        className={`mt-0.5 block text-[11px] leading-tight no-underline ${
                          selected ? "text-[#2C62E0]" : "text-gray-500"
                        }`}
                      >
                        {formatINR(price)}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
