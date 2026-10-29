import { Link } from "react-router-dom";

export default function InnerPageHeader({
  eyebrow = "Kreedum Sports",
  title,
  description,
  breadcrumbs = [],
  rightContent = null,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0E1A3D] via-[#16234A] to-[#2C62E0] text-white">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-20 -top-32 h-64 w-64 rounded-full bg-[#2C62E0] opacity-30 blur-3xl" />

        <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[#1F49B8] opacity-30 blur-3xl" />
      </div>

      {/* Top padding clears the fixed navbar (158px mobile, 114px desktop). */}
      <div className="relative mx-auto max-w-6xl px-4 pb-4 pt-[170px] sm:px-6 md:pb-6 md:pt-[124px]">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-blue-100 md:text-xs"
          >
            {breadcrumbs.map((item, index) => (
              <span
                key={item.label || index}
                className="flex items-center gap-2"
              >
                {item.to ? (
                  <Link
                    to={item.to}
                    className="transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white/80">
                    {item.label}
                  </span>
                )}

                {index < breadcrumbs.length - 1 && (
                  <span aria-hidden="true">/</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-4">

          {/* Heading */}
          <div className="min-w-0">


            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="mt-0.5 max-w-2xl text-xs text-blue-100 md:text-sm">
                {description}
              </p>
            )}

          </div>

          {/* Optional right-side content */}
          {rightContent && (
            <div className="shrink-0 text-xs text-blue-100 md:text-sm">
              {rightContent}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}