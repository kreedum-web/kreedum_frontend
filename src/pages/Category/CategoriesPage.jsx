import { Link } from "react-router-dom";

import { COLORS } from "@/config/theme";
import { categoryUrl, useCategoryTree } from "@/hooks/useCategories";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

/** /categories — every department with its categories, in the Metro Sports menu order. */
export default function CategoriesPage() {
  const { tree, isLoading, isError } = useCategoryTree();

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <InnerPageHeader
        title="Shop by Category"
        description="Browse sports, fitness and gym equipment by category."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Categories" }]}
      />

      <div className="mx-auto max-w-6xl px-6 py-8 pb-14">
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white" />
            ))}
          </div>
        )}

        {isError && (
          <p className="py-12 text-center text-gray-500">Something went wrong while loading the categories.</p>
        )}

        {tree.map((department) => (
          <section key={department.slug} className="mb-10">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold" style={{ color: COLORS.navy }}>
                {department.name}
              </h2>
              <Link to={categoryUrl(department.slug)} className="text-sm font-semibold" style={{ color: COLORS.blue }}>
                View all {department.productCount} →
              </Link>
            </div>

            {department.children.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {department.children.map((category) => (
                  <div
                    key={category.slug}
                    className="rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <Link
                      to={categoryUrl(category.slug)}
                      className="flex items-baseline justify-between gap-3 font-semibold transition-colors hover:text-[#2C62E0]"
                      style={{ color: COLORS.navy }}
                    >
                      <span>{category.name}</span>
                      <span className="shrink-0 text-xs font-medium text-[#8A93A6]">
                        {category.productCount} products
                      </span>
                    </Link>

                    {category.children.length > 0 && (
                      <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                        {category.children.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to={categoryUrl(sub.slug)}
                              className="text-sm transition-colors hover:text-[#2C62E0]"
                              style={{ color: COLORS.slate }}
                            >
                              {sub.name}
                              <span className="ml-1 text-xs text-[#8A93A6]">({sub.productCount})</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Link
                to={categoryUrl(department.slug)}
                className="inline-block rounded-2xl border border-gray-100 bg-white px-5 py-4 font-semibold"
                style={{ color: COLORS.navy }}
              >
                Browse {department.name}
              </Link>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
