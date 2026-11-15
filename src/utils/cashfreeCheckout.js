/**
 * Opens Cashfree's payment page (UPI, cards, netbanking, wallets) for a
 * payment session from our backend. The customer comes back to
 * /payment/return?order=<id> afterwards.
 *
 * The Cashfree package starts loading Cashfree's script as soon as it is
 * imported, so it's only imported here, when someone actually pays.
 */
export async function openCashfreeCheckout({ paymentSessionId, mode }) {
  let cashfree;
  try {
    const { load } = await import("@cashfreepayments/cashfree-js");
    cashfree = await load({ mode: mode === "production" ? "production" : "sandbox" });
  } catch (error) {
    console.error("Cashfree didn't load:", error);
  }
  if (!cashfree) throw new Error("Couldn't open the payment page. Check your internet connection and try again.");

  // Same tab: the customer returns to our site when done.
  const result = await cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
  if (result?.error) throw new Error(result.error.message || "Couldn't open the payment page. Please try again.");
}

/** Start (or continue) paying for an order: asks our backend for a session, then opens Cashfree. */
export async function payForOrder(paymentService, orderId) {
  const response = await paymentService.start(orderId);
  const session = response?.data?.data;
  if (!session?.paymentSessionId) throw new Error("Couldn't start the payment. Please try again.");
  await openCashfreeCheckout(session);
}
