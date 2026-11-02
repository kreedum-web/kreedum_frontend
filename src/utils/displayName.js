/**
 * What to call the customer on the site (account button, menus).
 * Sign-up only asks for an email, so until they give a name we use the
 * part of the email before the "@" (asha.verma@gmail.com → asha.verma).
 */
export function displayName(user, fallback = "Account") {
  if (!user) return fallback;
  const first = String(user.firstName || user.name || "").trim();
  if (first) return first.split(/\s+/)[0];
  const email = String(user.email || "").trim();
  if (email) return email.split("@")[0];
  if (user.phone) return user.phone;
  return fallback;
}

/** Full name if known, else the same as displayName. */
export function fullDisplayName(user, fallback = "Account") {
  const full = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return full || user?.name || displayName(user, fallback);
}
