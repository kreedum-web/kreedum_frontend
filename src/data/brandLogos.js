/**
 * Brand logos for the Brands page and the mobile menu.
 *
 * To add one: put the logo file in public/images/brand-logos/ (PNG with a
 * transparent or white background, or SVG; about 600 × 300 px is plenty)
 * and add a line below:  "brand-slug": "/images/brand-logos/file-name.png",
 * The slug is the brand's name in lowercase with spaces as "-"
 * (it's also the end of the brand's page address, e.g. /brands/aerofit).
 *
 * Brands without a logo here (or in the database's brand "logo" field)
 * show their name in bold instead.
 */
const brandLogos = {
  kreedum: "/images/brand-logos/kreedum.png",
};

/** The brand's logo URL, if we have one (this list first, then the database). */
export function brandLogoUrl(brand) {
  return brandLogos[brand?.slug] || brand?.logo || "";
}

export default brandLogos;
