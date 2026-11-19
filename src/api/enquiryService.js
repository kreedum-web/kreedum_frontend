import api from "./axios";
import API_ENDPOINTS from "./endpoints";

/** Bulk enquiries (no sign-in needed). */
const enquiryService = {
  // → { id, emailSent }
  send: (enquiry) => api.post(API_ENDPOINTS.ENQUIRIES, enquiry),
  // Contact Us form → { id }
  contact: (message) => api.post(`${API_ENDPOINTS.ENQUIRIES}/contact`, message),
  // A WhatsApp button was pressed (see utils/enquiryLog.js)
  whatsapp: (details) => api.post(`${API_ENDPOINTS.ENQUIRIES}/whatsapp`, details),
};

export default enquiryService;
