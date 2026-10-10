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

      {/* <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-9"> */}
        
<div className="relative max-w-6xl mx-auto px-6 pt-36 pb-9 md:pt-24">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-2 text-xs text-blue-100"
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

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          {/* Heading */}
          <div className="min-w-0">


            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h1>

            {description && (
              <p className="mt-2 max-w-2xl text-blue-100 text-sm md:text-base">
                {description}
              </p>
            )}

          </div>

          {/* Optional right-side content */}
          {rightContent && (
            <div className="shrink-0 text-sm text-blue-100">
              {rightContent}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}