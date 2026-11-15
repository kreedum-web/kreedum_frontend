import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const P = API_ENDPOINTS.PAYMENTS;

/** Online payment through Cashfree. */
const paymentService = {
  // { online, mode: "sandbox" | "production" | null, payWithinMinutes }
  getOptions: () => api.get(P.OPTIONS),
  // { paymentSessionId, mode, orderNumber, amount, … } for an order waiting for payment
  start: (orderId) => api.post(P.START(orderId)),
  // { paymentStatus, orderStatus, lastFailure, … } after checking with Cashfree
  status: (orderId) => api.get(P.STATUS(orderId)),
};

export default paymentService;
