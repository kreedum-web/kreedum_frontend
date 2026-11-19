import { enquiryService } from "@/api";
import { visitorId } from "./visitor";

/**
 * Tell the admin dashboard a WhatsApp button was pressed (the chat itself
 * happens in WhatsApp). Call it in the button's onClick; it never waits,
 * never shows errors and never stops WhatsApp from opening.
 *
 *   logWhatsapp("product-page", { productSlug, sku, quantity })
 *
 * source: floating | product-page | footer | contact-page | bulk-page | order-help
 */
export function logWhatsapp(source, details = {}) {
  try {
    enquiryService
      .whatsapp({
        visitorId: visitorId(),
        source,
        page: window.location.pathname,
        ...details,
      })
      .catch(() => {});
  } catch {
    /* never block the button */
  }
}
