import { createContext, useCallback, useContext, useMemo, useState } from "react";

import FormPopup from "@/components/common/FormPopup";
import BulkEnquiryForm from "@/components/enquiry/BulkEnquiryForm";
import ContactForm from "@/components/enquiry/ContactForm";

const EnquiryContext = createContext({ openEnquiry: () => {}, closeEnquiry: () => {} });

const POPUPS = {
  bulk: {
    eyebrow: "Get a quote",
    title: "Get a price for your gym",
    subtitle: "Share a few details and our team will call or WhatsApp you with a quote.",
    Form: BulkEnquiryForm,
  },
  contact: {
    eyebrow: "Quick enquiry",
    title: "Tell us what you're looking for",
    subtitle: "Fill in the details to continue the conversation with our team on WhatsApp.",
    Form: ContactForm,
  },
};

/**
 * The enquiry popups (like the sign-in popup), opened from anywhere:
 *
 *   const { openEnquiry } = useEnquiry();
 *   openEnquiry("bulk");      // Bulk order / quote form
 *   openEnquiry("contact");   // Contact Us form
 */
export function EnquiryProvider({ children }) {
  const [open, setOpen] = useState(null); // { kind, from, key }

  const openEnquiry = useCallback((kind = "bulk", options = {}) => {
    setOpen({ kind: POPUPS[kind] ? kind : "bulk", from: options.from || window.location.pathname, key: Date.now() });
  }, []);
  const closeEnquiry = useCallback(() => setOpen(null), []);

  const value = useMemo(() => ({ openEnquiry, closeEnquiry, isOpen: Boolean(open) }), [openEnquiry, closeEnquiry, open]);
  const popup = open && POPUPS[open.kind];

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      {popup && (
        <FormPopup key={open.key} eyebrow={popup.eyebrow} title={popup.title} subtitle={popup.subtitle} onClose={closeEnquiry}>
          <popup.Form from={open.from} onClose={closeEnquiry} />
        </FormPopup>
      )}
    </EnquiryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEnquiry = () => useContext(EnquiryContext);
