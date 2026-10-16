import InnerPageHeader from "@/components/layout/InnerPageHeader";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Overview",
    content: (
      <>
        Kreedum Sports aims to provide a reliable shopping experience for sports
        equipment, fitness products, gym accessories, and related products.
        This policy explains how to contact us regarding return, replacement,
        cancellation, and refund requests.
      </>
    ),
  },
  {
    title: "2. Return Eligibility",
    content: (
      <>
        Return eligibility may depend on the product category, its condition,
        the reason for the request, and the applicable product-specific terms.
        Products must generally be unused, undamaged, and returned with their
        original packaging, accessories, manuals, and invoice where applicable.
        Please contact our team before sending any product back.
      </>
    ),
  },
  {
    title: "3. Damaged, Defective, or Incorrect Products",
    content: (
      <>
        If your order arrives damaged, defective, incomplete, or different from
        what you ordered, contact us as soon as possible. Include your order
        number, a description of the issue, and clear photographs or videos
        where available. Our team will review the request and communicate the
        next steps.
      </>
    ),
  },
  {
    title: "4. Products That May Not Be Returnable",
    content: (
      <>
        Certain products may not be eligible for return because of their
        nature, installation, customization, use, or supplier-specific terms.
        Eligibility will be assessed against the applicable product terms and
        legal requirements. Please confirm the return conditions for
        specialized equipment, installed products, and customized orders with
        our team before purchasing.
      </>
    ),
  },
  {
    title: "5. Order Cancellation",
    content: (
      <>
        If you need to cancel an order, contact us as early as possible and
        provide your order number. Cancellation requests are subject to the
        order's processing and dispatch status. An order that has already been
        dispatched may not be eligible for cancellation and may instead be
        assessed under the applicable return policy.
      </>
    ),
  },
  {
    title: "6. Refund Eligibility",
    content: (
      <>
        A refund may be considered for an approved cancellation, a cancellation
        initiated by Kreedum Sports, or an eligible return involving a damaged,
        defective, or incorrect product. The final resolution will depend on
        the circumstances, verification, product-specific terms, and
        applicable law.
      </>
    ),
  },
  {
    title: "7. Refund Processing",
    content: (
      <>
        Once a refund is approved, our team will communicate the applicable
        processing details. The time taken for the amount to appear in your
        account may depend on the original payment method, payment provider,
        and banking institution. We will provide further information when your
        request is reviewed.
      </>
    ),
  },
  {
    title: "8. Return Shipping and Related Costs",
    content: (
      <>
        Responsibility for return shipping, pickup arrangements, and any
        associated costs will depend on the reason for the return and the
        applicable product terms. Please obtain instructions from our team
        before shipping a product back. Do not send products to an address
        without return authorization or confirmation.
      </>
    ),
  },
  {
    title: "9. How to Request a Return or Refund",
    content: (
      <>
        To submit a request, contact Kreedum Sports using the details below.
        Please include your full name, order number, registered contact
        details, the reason for your request, and supporting photographs or
        documents where relevant. Our team will review the information and
        explain the next steps.
      </>
    ),
  },
  {
    title: "10. Policy Updates",
    content: (
      <>
        Kreedum Sports may update this policy when its business practices,
        products, or legal requirements change. The version published on this
        website will apply subject to applicable law and any terms that apply
        to your order.
      </>
    ),
  },
];

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <InnerPageHeader
        eyebrow="Customer Support"
        title="Return & Refund Policy"
        description="Information about return requests, order cancellations, replacements, and refunds for Kreedum Sports purchases."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Return & Refund Policy" },
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm leading-7 text-slate-700">
            For assistance with an order, please contact our team before
            returning a product. Return and refund requests are reviewed
            according to the applicable product terms and circumstances.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold text-[#0E1A3D]">
                {section.title}
              </h2>
              <div className="text-sm leading-7 text-slate-600 sm:text-base">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-[#F6F8FC] p-6">
          <h2 className="mb-3 text-xl font-semibold text-[#0E1A3D]">
            Contact Kreedum Sports
          </h2>

          <div className="space-y-2 text-sm leading-7 text-slate-600 sm:text-base">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@kreedum.com"
                className="text-[#2C62E0] hover:underline"
              >
                info@kreedum.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+917570002458"
                className="text-[#2C62E0] hover:underline"
              >
                +91 75700 02458
              </a>
            </p>
            <p>
              <strong>Address:</strong> Upper Ground Floor, Krishna Plaza,
              Nazirabad Road, Aminabad, Lucknow, Uttar Pradesh 226018, India.
            </p>
          </div>

          <p className="mt-5 text-sm text-slate-600">
            You may also review our{" "}
            <Link
              to="/privacy-policy"
              className="font-medium text-[#2C62E0] hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-and-conditions"
              className="font-medium text-[#2C62E0] hover:underline"
            >
              Terms & Conditions
            </Link>
            .
          </p>
        </section>
      </section>
    </main>
  );
}