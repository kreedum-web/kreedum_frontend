
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

const leaders = [
  {
    name: "Richa Kothari",
    role: "Managing Director",
    image: "/images/richa-kothari.jpeg",
    quote:
      "Our vision is to make quality sports and fitness equipment accessible, helping more people pursue their goals with confidence.",
  },
  {
    name: "Shivam Gupta",
    role: "CEO",
    image: "/images/shivam-gupta.jpeg",
    quote:
      "We believe every sporting ambition deserves the right support. Our focus is on building a dependable experience for every customer we serve.",
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
            to="/categories"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2C62E0] px-6 py-3 font-semibold text-white transition hover:bg-[#1F49B8]"
          >
            Explore Our Products
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative">
       
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

{/* Leadership */}
{/* Leadership */}
<section className="bg-[#F6F8FC] px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
  <div className="mx-auto max-w-7xl">
    {/* Section Heading */}
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2C62E0]">
        Our Leadership
      </p>

      <h2 className="mt-3 text-3xl font-bold text-[#0E1A3D] sm:text-4xl">
        The people behind Kreedum
      </h2>

      <p className="mt-4 leading-7 text-slate-600">
        Meet the leadership guiding our vision for sports, fitness,
        and customer experience.
      </p>
    </div>

    {/* Leadership Cards */}
    <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:mt-10 md:grid-cols-2 md:gap-8">
      {leaders.map((leader) => (
        <article
          key={leader.name}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:rounded-3xl"
        >
          {/* Mobile Layout */}
          <div className="p-5 sm:hidden">
            {/* Quote */}
            <div className="border-l-2 border-[#2C62E0] pl-4">
              <span
                aria-hidden="true"
                className="block text-3xl font-bold leading-none text-[#2C62E0]"
              >
                “
              </span>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {leader.quote}
              </p>
            </div>

            {/* Compact Profile */}
            <div className="mt-5 flex items-center gap-3">
              {/* Portrait */}
              <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full border-2 border-[#2C62E0] bg-[#EAF0FF]">
                <img
                  src={leader.image}
                  alt={`${leader.name}, ${leader.role} at Kreedum`}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>

              {/* Name and Role */}
              <div className="min-w-0">
                <h3 className="text-lg font-bold leading-snug text-[#0E1A3D]">
                  {leader.name}
                </h3>

                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#2C62E0]">
                  {leader.role}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Existing Design */}
          <div className="hidden sm:grid sm:grid-cols-[200px_1fr]">
            {/* Portrait */}
            <div className="relative min-h-[260px] overflow-hidden bg-[#EAF0FF]">
              <img
                src={leader.image}
                alt={`${leader.name}, ${leader.role} at Kreedum`}
                className="absolute inset-0 h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>

            {/* Profile */}
            <div className="flex flex-col p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2C62E0]">
                {leader.role}
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#0E1A3D]">
                {leader.name}
              </h3>

              <div className="mt-5 border-l-2 border-[#2C62E0] pl-4">
                <span
                  aria-hidden="true"
                  className="text-3xl font-bold leading-none text-[#2C62E0]"
                >
                  “
                </span>

                <p className="mt-1 text-sm leading-7 text-slate-600">
                  {leader.quote}
                </p>
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Kreedum Sports
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
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
            to="/categories"
            className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-[#0E1A3D] transition hover:bg-blue-50"
          >
            Shop Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
