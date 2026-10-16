
import { Link } from "react-router-dom";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

const values = [
  {
    number: "01",
    title: "Quality & Reliability",
    description:
      "We focus on sports and fitness products that support everyday training, performance, and active lifestyles.",
  },
  {
    number: "02",
    title: "Customer First",
    description:
      "We aim to make product discovery, purchase decisions, and customer support straightforward and convenient.",
  },
  {
    number: "03",
    title: "Built Around Sport",
    description:
      "From fitness essentials to sports equipment, our focus is on helping people and organizations stay active.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white">
      <InnerPageHeader
        eyebrow="About Kreedum"
        title="Passion for Sport. Built for Performance."
        description="Discover Kreedum Sports — your destination for sports equipment, fitness essentials, and gym products."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "About Us" },
        ]}
      />

      {/* Introduction */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#2C62E0]">
            Who We Are
          </p>

          <h2 className="text-3xl font-bold leading-tight text-[#0E1A3D] sm:text-4xl">
            Making sports and fitness more accessible.
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            Kreedum Sports serves customers looking for sports equipment,
            gym equipment, fitness accessories, and products for active
            lifestyles. We bring a range of products together to help
            individuals, fitness enthusiasts, and organizations find
            equipment suited to their needs.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            We believe choosing the right equipment should be a clear and
            convenient experience. Our goal is to help customers explore
            products, understand their options, and get support throughout
            their shopping journey.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2C62E0] px-6 py-3 font-semibold text-white transition hover:bg-[#1F49B8]"
          >
            Explore Our Products
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-[#EAF0FF]" />

          <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-[#0E1A3D] p-8 sm:min-h-[400px] sm:p-10">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
            <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-[#2C62E0]/30 blur-2xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                KREEDUM SPORTS
              </p>
              <h3 className="mt-6 max-w-sm text-3xl font-bold leading-tight text-white sm:text-4xl">
                Equip your ambition.
              </h3>
            </div>

            <div className="relative mt-10 border-l-2 border-blue-400 pl-4">
              <p className="text-lg font-medium text-white">
                Sport. Fitness. Performance.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Products for training, movement, and the pursuit of better
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#F6F8FC] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2C62E0]">
            Our Mission
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#0E1A3D] sm:text-4xl">
            Helping every customer find the right equipment for their goals.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
            Our mission is to provide a convenient destination for sports and
            fitness products, supported by clear information and responsive
            customer service. Whether you are building a workout routine or
            equipping a sports facility, we want to make your product journey
            easier.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2C62E0]">
            What Matters to Us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0E1A3D] sm:text-4xl">
            Our approach
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            The principles that guide how we present our products and serve
            our customers.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.number}
              className="rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0FF] font-bold text-[#2C62E0]">
                {value.number}
              </span>

              <h3 className="mt-6 text-xl font-bold text-[#0E1A3D]">
                {value.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-[#0E1A3D] p-8 sm:p-10 md:flex-row md:items-center lg:p-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Start Exploring
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Find equipment for your next goal.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Explore our available sports and fitness products and find
              options that fit your needs.
            </p>
          </div>

          <Link
            to="/products"
            className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-[#0E1A3D] transition hover:bg-blue-50"
          >
            Shop Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
