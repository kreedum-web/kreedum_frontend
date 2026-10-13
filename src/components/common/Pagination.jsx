
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "@/config/theme";

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];

  if (currentPage > 4) pages.push("...");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) pages.push("...");

  pages.push(totalPages);
  return pages;
}

export default function Pagination({
  pagination,
  onPageChange,
}) {
  const {
    page,
    totalPages,
    hasPrevPage,
    hasNextPage,
  } = pagination || {};

  if (!totalPages || totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6 md:pb-16">
      <div className="flex justify-center">
        <nav
          aria-label="Pagination"
          className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm sm:gap-2"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={!hasPrevPage}
            onClick={() => onPageChange(page - 1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: COLORS.navy }}
          >
            <ChevronLeft size={18} />
          </button>

          {pages.map((item, index) =>
            item === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-gray-400"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={`h-10 min-w-10 shrink-0 rounded-xl px-3 text-sm font-semibold transition-colors ${
                  item === page
                    ? "text-white"
                    : "hover:bg-gray-100"
                }`}
                style={
                  item === page
                    ? { backgroundColor: COLORS.blue }
                    : { color: COLORS.navy }
                }
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            aria-label="Next page"
            disabled={!hasNextPage}
            onClick={() => onPageChange(page + 1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ color: COLORS.navy }}
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      </div>
    </section>
  );
}
