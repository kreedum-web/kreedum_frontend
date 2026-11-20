import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, FileText, MessageCircle, Phone } from "lucide-react";

import InnerPageHeader from "@/components/layout/InnerPageHeader";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/config/contact";
import { useEnquiry } from "@/contexts/EnquiryContext";
import { logWhatsapp } from "@/utils/enquiryLog";
import { ENQUIRY_HIGHLIGHTS } from "@/data/bulkEnquiryOptions";

/**
 * /bulk-enquiry — for anyone arriving by link (Google, ads, an old bookmark).
 * The form itself is the popup (EnquiryContext), opened straight away; the
 * page behind explains the offer and has a button to open it again.
 * The site's own "Bulk Enquiry" buttons open the popup on the page you're on.
 */
export default function BulkEnquiryPage() {
  const location = useLocation();
  const { openEnquiry } = useEnquiry();
  const from = location.state?.from || "/bulk-enquiry";

  useEffect(() => {
    openEnquiry("bulk", { from });
    // Only once, when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        eyebrow="Bulk & institutional orders"
        title="Bulk Order Enquiry"
        description="Gyms, schools, offices and societies: tell us what you need and we'll call you with the best price."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Bulk Order Enquiry" }]}
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 md:py-10 lg:grid-cols-[1fr_330px]">
        <div className="flex flex-col items-start justify-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2C62E0]">Get a quote</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0E1A3D] sm:text-3xl">Get a price for your gym in 30 seconds.</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
            Your name, WhatsApp number, city and what you need. That's all. Our team calls or WhatsApps you with the best price.
          </p>
          <button
            type="button"
            onClick={() => openEnquiry("bulk", { from })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#880808] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#EE4B2B]"
          >
            <FileText size={17} /> Get a quote
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-[#0E1A3D] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FADFF]">Why Kreedum</p>
            <ul className="mt-4 space-y-3">
              {ENQUIRY_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#8FADFF]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0E1A3D]">Prefer to talk?</p>
            <p className="mt-1 text-sm text-slate-500">Call or WhatsApp our team.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0E1A3D] hover:border-[#2C62E0] hover:text-[#2C62E0]">
                <Phone size={17} /> {PHONE_DISPLAY}
              </a>
              <a
                href={whatsappLink("Hi Kreedum, I have a Bulk Order Enquiry.")}
                onClick={() => logWhatsapp("bulk-page")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0E1A3D] hover:border-[#25D366] hover:text-[#128C4B]"
              >
                <MessageCircle size={17} /> WhatsApp us
              </a>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
