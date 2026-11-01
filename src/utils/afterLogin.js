/** Where to go after logging in: the page the customer came from, else home. */
export function afterLoginPath(location) {
  const requested = location?.state?.from;
  return typeof requested === "string" && requested.startsWith("/") && !requested.startsWith("//")
    ? requested
    : "/";
}
