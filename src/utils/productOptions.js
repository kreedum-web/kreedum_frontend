/**
 * Products sold in several weights / sizes. `options` = [{ name, values }],
 * `variants` = [{ variantId, options: { Weight: "5 kg" }, sellingPrice, mrp, inStock, image, sku }].
 */

/** The variant matching every chosen option, or null. */
export function findVariant(options, variants, selection) {
  if (!options.length) return null;
  return (
    variants.find((variant) =>
      options.every((option) => variant.options?.[option.name] === selection[option.name])
    ) || null
  );
}

/** Option chosen automatically: the only value, when there is just one. */
export function defaultSelection(options) {
  return Object.fromEntries(
    options.filter((option) => option.values.length === 1).map((option) => [option.name, option.values[0]])
  );
}

/** "weight", "size and colour" — for "Choose weight" messages. */
export function optionNames(options = []) {
  return options.map((option) => option.name.toLowerCase()).join(" and ") || "an option";
}
