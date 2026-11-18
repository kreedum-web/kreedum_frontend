import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Counts each page the customer opens, for the admin dashboard's Traffic
 * page (POST /api/v1/track). Sends only a random browser id, the page
 * address (no ?query) and the site they came from: no names or contact
 * details. Never slows the page down or shows errors.
 */
const VISITOR_KEY = "kreedum_visitor";

function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export default function PageViewTracker() {
  const { pathname } = useLocation();
  const firstView = useRef(true);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL;
    const id = visitorId();
    if (!base || !id) return;

    const body = JSON.stringify({
      visitorId: id,
      path: pathname,
      // Where they came from: only meaningful for the first page of the visit.
      referrer: firstView.current ? document.referrer : "",
      signedIn: Boolean(localStorage.getItem("kreedum_token")),
    });
    firstView.current = false;

    fetch(`${base}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
