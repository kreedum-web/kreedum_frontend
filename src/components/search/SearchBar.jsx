
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { searchService } from "@/api";
import { COLORS } from "@/config/theme";

const PLACEHOLDERS = [
  "Search treadmills...",
  "Search exercise bikes...",
  "Search dumbbells...",
  "Search home gyms...",
  "Search sports equipment...",
];

export default function SearchBar({ className = "" }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  // Rotate placeholder examples while the input is empty.
  useEffect(() => {
    if (query) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((current) =>
        (current + 1) % PLACEHOLDERS.length
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [query]);

  // Close suggestions when clicking outside the search.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // Fetch suggestions after the user pauses typing.
  useEffect(() => {
    const keyword = query.trim();

    if (keyword.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await searchService.getSuggestions(keyword);

        if (cancelled) return;

        setSuggestions(
          response?.data?.suggestions || []
        );
      } catch (err) {
        if (cancelled) return;

        console.error("Search suggestions failed:", err);
        setSuggestions([]);
        setError("Suggestions are temporarily unavailable.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function handleSubmit(event) {
    event.preventDefault();

    const keyword = query.trim();

    if (!keyword) return;

    setIsOpen(false);

    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  }

  function selectProduct(product) {
    if (!product?.slug) return;

    setIsOpen(false);
    setQuery("");
    navigate(`/products/${product.slug}`);
  }

  function formatPrice(price) {
    const amount = Number(price);

    if (!Number.isFinite(amount)) return null;

    return `₹${amount.toLocaleString("en-IN")}`;
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full min-w-0 ${className}`}
    >
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-center gap-3 rounded-full border px-4 py-3 transition-all duration-200 focus-within:ring-2"
        style={{
          backgroundColor: COLORS.paper,
          borderColor: "rgba(14,26,61,0.08)",
          "--tw-ring-color": "rgba(44,98,224,0.18)",
        }}
      >
        <button
          type="submit"
          aria-label="Search products"
          className="shrink-0"
          style={{ color: COLORS.slate }}
        >
          <Search className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          aria-label="Search Kreedum Sports products"
          aria-autocomplete="list"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-500 md:text-base"
          style={{ color: COLORS.navy }}
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setError("");
              setIsOpen(true);
            }}
            className="shrink-0 text-gray-500 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div
          className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-2xl border bg-white shadow-xl"
          style={{ borderColor: "rgba(14,26,61,0.10)" }}
        >
          {loading && (
            <p className="px-4 py-4 text-sm text-gray-500">
              Finding products...
            </p>
          )}

          {!loading && error && (
            <p className="px-4 py-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            suggestions.length === 0 && (
              <div className="px-4 py-4">
                <p className="text-sm text-gray-600">
                  No matching products found.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-2 text-sm font-semibold hover:underline"
                  style={{ color: COLORS.blue }}
                >
                  Search the full catalogue
                </button>
              </div>
            )}

          {!loading &&
            suggestions.slice(0,4).map((product) => (
              <button
                key={product._id || product.slug}
                type="button"
                onClick={() => selectProduct(product)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F6F8FC]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F6F8FC]">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Search className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="line-clamp-2 text-sm font-semibold"
                    style={{ color: COLORS.navy }}
                  >
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {product.brand &&
                    product.brand !== "Unknown"
                      ? `${product.brand} · `
                      : ""}
                    {formatPrice(product.sellingPrice) ||
                      "Price on request"}
                  </p>
                </div>
              </button>
            ))}

          {!loading && suggestions.length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full border-t px-4 py-3 text-left text-sm font-semibold hover:bg-[#F6F8FC]"
              style={{
                borderColor: "rgba(14,26,61,0.08)",
                color: COLORS.blue,
              }}
            >
              See all results for "{query.trim()}" →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
