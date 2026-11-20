/** Digits only, without a pasted +91 / 0 in front, at most 10. */
export function tenDigits(text) {
  const digits = String(text || "").replace(/\D/g, "");
  return (digits.length > 10 ? digits.replace(/^(91|0)/, "") : digits).slice(0, 10);
}

