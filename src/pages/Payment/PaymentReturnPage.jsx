import { useCallback, useEffect, useRef, useState } from "react";
import SignInRequired from "@/components/auth/SignInRequired";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CircleAlert, LoaderCircle, RotateCcw } from "lucide-react";

import { paymentService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { COLORS } from "@/config/theme";
import { payForOrder } from "@/utils/cashfreeCheckout";

const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
// The bank sometimes takes a few seconds to confirm: check up to 6 times, 2.5 s apart.
const CHECKS = 6;
const GAP_MS = 2500;

/**
 * Cashfree sends the customer here after paying (/payment/return?order=<id>).
 * We ask our backend, which asks Cashfree, and show the result.
 */
export default function PaymentReturnPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [state, setState] = useState({ phase: "checking", data: null }); // checking · paid · waiting · failed · closed · error
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState("");
  const cancelled = useRef(false);

  const check = useCallback(async () => {
    for (let attempt = 1; attempt <= CHECKS && !cancelled.current; attempt++) {
      try {
        const data = (await paymentService.status(orderId))?.data?.data;
        if (data?.paymentStatus === "PAID") {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          setState({ phase: "paid", data });
          return;
        }
        if (data?.orderStatus === "CANCELLED") return setState({ phase: "closed", data });
        if (data?.lastFailure && attempt >= 2) return setState({ phase: "failed", data });
        if (attempt === CHECKS) return setState({ phase: data?.lastFailure ? "failed" : "waiting", data });
      } catch (error) {
        if (attempt === CHECKS) return setState({ phase: "error", data: { message: error?.response?.data?.message } });
      }
      await new Promise((resolve) => setTimeout(resolve, GAP_MS));
    }
  }, [orderId, queryClient]);

  useEffect(() => {
    if (!isAuthenticated || !orderId) return undefined;
    cancelled.current = false;
    const start = setTimeout(check, 0);
    return () => {
      cancelled.current = true;
      clearTimeout(start);
    };
  }, [isAuthenticated, orderId, check]);

  async function tryAgain() {
    setRetryError("");
    setRetrying(true);
    try {
      await payForOrder(paymentService, orderId);
    } catch (error) {
      setRetryError(error?.response?.data?.message || error.message);
      setRetrying(false);
    }
  }

  if (authLoading) return <Shell><Checking /></Shell>;
  if (!isAuthenticated) return <SignInRequired title="Sign in to see your payment" message="Sign in with the same account you used to place the order." />;
  if (!orderId) return <Navigate to="/account/orders" replace />;

  const { phase, data } = state;
  const orderLink = `/account/orders/${orderId}`;

  return (
    <Shell>
      {phase === "checking" && <Checking />}

      {phase === "paid" && (
        <Result
          icon={<CheckCircle2 size={44} color="#16A34A" />}
          tone="#16A34A"
          eyebrow="Payment received · Order placed"
          title="Thank you! Your order is placed."
          text={`We've received ${formatINR(data.amount)} for order ${data.orderNumber}. Our team will check availability and confirm it shortly: you'll get an email once it's confirmed.`}
        >
          <Link to={orderLink} className="btn-primary">View order details</Link>
          <Link to="/account/orders" className="btn-secondary">My orders</Link>
          <Link to="/" className="btn-secondary">Continue shopping</Link>
        </Result>
      )}

      {phase === "waiting" && (
        <Result
          icon={<LoaderCircle size={44} color={COLORS.blue} />}
          tone={COLORS.blue}
          eyebrow="Confirming payment"
          title="Your bank is still confirming the payment"
          text="This can take a minute. If money was taken, your order will be confirmed automatically and you'll get an email. Don't pay again yet."
        >
          <button type="button" onClick={() => { setState({ phase: "checking", data: null }); check(); }} className="btn-primary">
            Check again
          </button>
          <Link to={orderLink} className="btn-secondary">View order</Link>
        </Result>
      )}

      {phase === "failed" && (
        <Result
          icon={<CircleAlert size={44} color="#DC2626" />}
          tone="#DC2626"
          eyebrow="Payment not completed"
          title="Your payment didn't go through"
          text={`${String(data.lastFailure || "The payment was cancelled or failed").replace(/[.!]?$/, ".")} No money was taken. Your cart and order are saved, so you can try again.`}
        >
          <button type="button" onClick={tryAgain} disabled={retrying} className="btn-primary">
            {retrying ? <LoaderCircle size={17} className="animate-spin" /> : <RotateCcw size={17} />}
            Try paying again
          </button>
          <Link to={orderLink} className="btn-secondary">View order</Link>
          {retryError && <p className="w-full text-sm text-red-600">{retryError}</p>}
        </Result>
      )}

      {phase === "closed" && (
        <Result
          icon={<CircleAlert size={44} color="#DC2626" />}
          tone="#DC2626"
          eyebrow="Order closed"
          title="This order was cancelled"
          text="It wasn't paid within an hour, so it was cancelled. Nothing was charged. Your cart still has the items: place the order again when you're ready."
        >
          <Link to="/cart" className="btn-primary">Go to cart</Link>
        </Result>
      )}

      {phase === "error" && (
        <Result
          icon={<CircleAlert size={44} color="#DC2626" />}
          tone="#DC2626"
          eyebrow="Something went wrong"
          title="We couldn't check your payment"
          text={data?.message || "Please check your order in a minute. If money was taken, the order will be confirmed automatically."}
        >
          <Link to={orderLink} className="btn-primary">View order</Link>
        </Result>
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <main className="min-h-[60vh] bg-[#F6F8FC] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-6 text-center shadow-sm sm:p-10">{children}</div>
    </main>
  );
}

function Checking() {
  return (
    <div className="py-6" role="status">
      <LoaderCircle size={40} className="mx-auto animate-spin" color={COLORS.blue} />
      <h1 className="mt-4 text-xl font-extrabold" style={{ color: COLORS.navy }}>
        Checking your payment…
      </h1>
      <p className="mt-2 text-sm text-slate-500">Please don't close or refresh this page.</p>
    </div>
  );
}

function Result({ icon, tone, eyebrow, title, text, children }) {
  return (
    <div role="status">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: tone }}>
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl font-extrabold" style={{ color: COLORS.navy }}>
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 [&_.btn-primary]:inline-flex [&_.btn-primary]:min-h-11 [&_.btn-primary]:items-center [&_.btn-primary]:gap-2 [&_.btn-primary]:rounded-xl [&_.btn-primary]:bg-[#2C62E0] [&_.btn-primary]:px-5 [&_.btn-primary]:text-sm [&_.btn-primary]:font-bold [&_.btn-primary]:text-white disabled:[&_.btn-primary]:opacity-60 [&_.btn-secondary]:inline-flex [&_.btn-secondary]:min-h-11 [&_.btn-secondary]:items-center [&_.btn-secondary]:rounded-xl [&_.btn-secondary]:border [&_.btn-secondary]:border-[#DDE4F2] [&_.btn-secondary]:px-5 [&_.btn-secondary]:text-sm [&_.btn-secondary]:font-bold [&_.btn-secondary]:text-[#0E1A3D]">
        {children}
      </div>
    </div>
  );
}
