import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Phone } from "lucide-react";
import { useMatch } from "react-router-dom";

import { productService } from "@/api";
import { COLORS } from "@/config/theme";

const WHATSAPP_NUMBER = "917570002458";
const CALL_NUMBER = "+917570002458";

export default function FloatingContactActions() {
  const productMatch = useMatch("/products/:slug");
  const slug = productMatch?.params?.slug;

  const { data: response } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const product = response?.data?.product;

  const productUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const message = product
    ? [
        `Hi Kreedum Sports, I'm interested in ${product.name}.`,
        `Price: ₹${(
          Number(product.sellingPrice) || 0
        ).toLocaleString("en-IN")}`,
        `Product: ${productUrl}`,
        "Please share more details. Thanks!",
      ].join("\n")
    : "Hi Kreedum Sports, I'd like to know more about your sports and fitness products.";

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-5 right-4 z-[45] flex flex-col items-center gap-3 sm:bottom-6 sm:right-6"
      aria-label="Contact Kreedum Sports"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Kreedum Sports on WhatsApp"
        title="Chat on WhatsApp"
        className="group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200 sm:h-14 sm:w-14"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={25} strokeWidth={2.2} />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#0E1A3D] opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:right-16">
          WhatsApp us
        </span>
      </a>

      <a
        href={`tel:${CALL_NUMBER}`}
        aria-label="Call Kreedum Sports"
        title="Call Kreedum Sports"
        className="group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:h-14 sm:w-14"
        style={{ backgroundColor: COLORS.blue }}
      >
        <Phone size={23} strokeWidth={2.2} />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#0E1A3D] opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:right-16">
          Call us
        </span>
      </a>
    </div>
  );
}