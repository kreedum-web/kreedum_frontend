/**
 * A random id for this browser, kept in localStorage. Lets the admin
 * dashboard count visitors (Traffic page) and see that two WhatsApp clicks
 * came from the same person. Holds no personal details.
 */
const VISITOR_KEY = "kreedum_visitor";

export function visitorId() {
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
