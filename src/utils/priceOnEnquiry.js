import { whatsappLink } from "@/config/contact";

/**
 * Products without a price (e.g. Aerofit's commercial machines) are sold on
 * enquiry: the site shows "Price on enquiry" and an Enquire button instead of
 * ₹0 and Add to cart. The backend marks them stockStatus "enquiry_only" with
 * price 0; either one is enough.
 */
export function isPriceOnEnquiry(product) {
  if (!product) return false;
  if (product.stockStatus === "enquiry_only") return true;
  const price = Number(product.price ?? product.sellingPrice);
  return !(price > 0);
}

/** WhatsApp link with the product filled in (no price for enquiry products). */
export function productEnquiryLink(product, { sku, quantity, url, withPrice } = {}) {
  const lines = [
    "Hi Kreedum Sports, I would like to enquire about this product.",
    "",
    `Product: ${product?.name || ""}`,
    `SKU: ${sku || product?.sku || "Not available"}`,
  ];
  if (quantity) lines.push(`Quantity: ${quantity}`);
  if (withPrice) lines.push(`Price: ₹${Number(withPrice).toLocaleString("en-IN")}`);
  lines.push(`Product link: ${url || (product?.slug ? `${window.location.origin}/products/${product.slug}` : window.location.href)}`);
  lines.push("", "Please share the price and more details. Thank you!");
  return whatsappLink(lines.join("\n"));
}
