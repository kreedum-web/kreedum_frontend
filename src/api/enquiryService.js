import api from "./axios";
import API_ENDPOINTS from "./endpoints";

/** Bulk enquiries (no sign-in needed). */
const enquiryService = {
  // → { id, emailSent }
  send: (enquiry) => api.post(API_ENDPOINTS.ENQUIRIES, enquiry),
};

export default enquiryService;
