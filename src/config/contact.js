/**
 * Contact details used across the site (navbar, footer, forms).
 * Change them here once.
 */
export const PHONE_DISPLAY = "+91 75700 02458";
export const PHONE_TEL = "+917570002458";
export const WHATSAPP_NUMBER = "917570002458";
export const EMAIL = "kreedumsports.official@gmail.com";
export const ADDRESS = "Upper ground floor, Krishna Plaza, Nazirabad Road, Aminabad, Lucknow - 226018";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Krishna%20Plaza%20Nazirabad%20Road%20Aminabad%20Lucknow%20226018";

/** WhatsApp chat link with an optional message typed in. */
export const whatsappLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Shown in the homepage numbers. Update as the business grows. */
export const HAPPY_CUSTOMERS = 5000;
