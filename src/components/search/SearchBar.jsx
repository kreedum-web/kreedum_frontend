
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Search, X } from "lucide-react";

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
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const SpeechRecognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition ||
        window.webkitSpeechRecognition
      : null;

  const supportsVoiceSearch = Boolean(SpeechRecognition);

  // Stop microphone when component unmounts
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  // Rotate search placeholders
  useEffect(() => {
    if (query) return;

    const interval = setInterval(() => {
      setPlaceholderIndex(
        (current) => (current + 1) % PLACEHOLDERS.length
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [query]);

  // Close suggestions when clicking outside
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

  // Fetch product suggestions
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
        setError(
          "Suggestions are temporarily unavailable."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Voice search
  function toggleVoiceSearch() {
    if (!supportsVoiceSearch) {
      setVoiceError(
        "Voice search is not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    setVoiceError("");

    try {
      const recognition = new SpeechRecognition();

      recognition.lang = "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsOpen(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .join("")
          .trim();

        if (transcript) {
          setQuery(transcript);
          setIsOpen(true);
        }
      };

      recognition.onerror = (event) => {
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          setVoiceError(
            "Microphone access blocked. Please allow microphone permission."
          );
        } else if (event.error === "no-speech") {
          setVoiceError(
            "No speech detected. Please try again."
          );
        } else if (event.error !== "aborted") {
          setVoiceError(
            "Voice search couldn't start. Please try again."
          );
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        inputRef.current?.focus();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Voice search failed:", err);
      setIsListening(false);
      setVoiceError(
        "Voice search couldn't start. Please try again."
      );
    }
  }

  // Submit search
  function handleSubmit(event) {
    event.preventDefault();

    const keyword = query.trim();

    if (!keyword) return;

    recognitionRef.current?.stop();
    setIsOpen(false);

    navigate(
      `/search?q=${encodeURIComponent(keyword)}`
    );
  }

  // Select suggested product
  function selectProduct(product) {
    if (!product?.slug) return;

    recognitionRef.current?.stop();
    setIsOpen(false);
    setQuery("");

    navigate(`/products/${product.slug}`);
  }

  // Format price
  function formatPrice(price) {
    const amount = Number(price);

    if (!Number.isFinite(amount)) return null;
    if (amount <= 0) return "Price on enquiry";

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
        className="flex items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-200 focus-within:ring-2 md:gap-3 md:px-4 md:py-3"
        style={{
          backgroundColor: COLORS.paper,
          borderColor: isListening
            ? COLORS.blue
            : "rgba(14,26,61,0.08)",
          "--tw-ring-color": "rgba(44,98,224,0.18)",
        }}
      >
        {/* Search icon */}
        <button
          type="submit"
          aria-label="Search products"
          className="shrink-0"
          style={{ color: COLORS.slate }}
        >
          <Search className="h-[18px] w-[18px] md:h-5 md:w-5" />
        </button>

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setVoiceError("");
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          placeholder={
            isListening
              ? "Listening... Speak now"
              : PLACEHOLDERS[placeholderIndex]
          }
          aria-label="Search Kreedum Sports products"
          aria-autocomplete="list"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-gray-500"
          style={{ color: COLORS.navy }}
        />

        {/* Microphone button */}
        <button
          type="button"
          onClick={toggleVoiceSearch}
          disabled={!supportsVoiceSearch}
          aria-label={
            isListening
              ? "Stop voice search"
              : "Search by voice"
          }
          aria-pressed={isListening}
          title={
            supportsVoiceSearch
              ? isListening
                ? "Stop listening"
                : "Search by voice"
              : "Voice search is not supported in this browser"
          }
          className={`-my-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            isListening
              ? "bg-blue-100 text-blue-700"
              : supportsVoiceSearch
                ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                : "cursor-not-allowed text-gray-300"
          }`}
        >
          {isListening ? (
            <MicOff className="h-[18px] w-[18px]" />
          ) : (
            <Mic className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Clear search */}
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              recognitionRef.current?.stop();
              setQuery("");
              setSuggestions([]);
              setError("");
              setVoiceError("");
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="-my-1 -mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Voice search status */}
      {voiceError && (
        <p
          role="status"
          aria-live="polite"
          className="mt-2 px-2 text-xs text-red-600"
        >
          {voiceError}
        </p>
      )}

      {isListening && (
        <p
          role="status"
          aria-live="polite"
          className="mt-2 px-2 text-xs font-medium"
          style={{ color: COLORS.blue }}
        >
          Listening... Speak now.
        </p>
      )}

      {/* Product suggestions */}
      {isOpen && query.trim().length >= 2 && (
        <div
          className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-2xl border bg-white shadow-xl"
          style={{
            borderColor: "rgba(14,26,61,0.10)",
          }}
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
            suggestions.slice(0, 4).map((product) => (
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
