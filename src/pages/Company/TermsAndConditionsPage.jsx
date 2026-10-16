
import InnerPageHeader from "@/components/layout/InnerPageHeader";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. About These Terms",
    paragraphs: [
      'These Terms & Conditions ("Terms") govern your access to and use of the Kreedum Sports ecommerce website at https://www.kreedum.com, including browsing, creating an account, placing orders and contacting us about products or services.',
      'The website is operated by Kreedum International Private Limited ("Kreedum", "we", "us" or "our"). By using the website or placing an order, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the website to place an order.',
    ],
  },
  {
    title: "2. Eligibility and Your Account",
    paragraphs: [
      "You must be legally capable of entering into a binding contract under applicable law to place an order. If you use the website on behalf of a business or another person, you confirm that you are authorised to do so.",
      "You are responsible for providing accurate information, keeping your account credentials confidential, and activity carried out through your account. Notify us promptly if you suspect unauthorised access.",
    ],
  },
  {
    title: "3. Product Information and Availability",
    paragraphs: [
      "We make reasonable efforts to display product descriptions, specifications, images and prices accurately. Product images are for illustration and actual colour, finish, packaging or appearance may vary slightly. Check the product page or confirm specifications with us before purchase where important.",
      "Products are subject to availability. Adding an item to a cart or wishlist does not reserve it. We may correct listing errors, update listings or discontinue products. If an order cannot be fulfilled, we will contact you and arrange an appropriate refund for payment collected for unfulfilled items, subject to applicable law.",
    ],
  },
  {
    title: "4. Prices, Taxes and Offers",
    paragraphs: [
      "Prices, applicable taxes, delivery charges and other fees will be shown or communicated before you confirm your order, where applicable. Quotes for customised, bulk or gym-setup orders may be valid only for the period stated in the quote.",
      "Promotional offers are subject to their stated conditions, validity period, stock availability and eligibility. If a clear pricing or listing error affects an order, we may contact you to confirm whether you wish to proceed at the correct price or cancel the affected order and receive a refund for any amount paid.",
    ],
  },
  {
    title: "5. Orders and Order Acceptance",
    paragraphs: [
      "Submitting an order is an offer to purchase the selected products. An automated acknowledgement does not necessarily mean the order has been finally accepted. We may need to verify availability, delivery details, payment status or suspected fraud before processing an order.",
      "We may decline or cancel an order where reasonably necessary, including when an item is unavailable, information is materially inaccurate, payment is not authorised, a listing contains a clear error or fraud is suspected. If we cancel after receiving payment, we will arrange a refund for the cancelled items, subject to applicable law.",
      "Check your cart, delivery address, contact details and order summary carefully before checkout. Contact us promptly if you notice an error; changes may not be possible once an order has been processed or dispatched.",
    ],
  },
  {
    title: "6. Payments",
    paragraphs: [
      "Available payment methods are those displayed or confirmed during checkout. Payments may be processed by a third-party payment provider and are subject to that provider's terms. You must be authorised to use the selected payment method.",
      "An order may not be processed until payment is successfully authorised or received, unless we have expressly agreed to another arrangement. Never send full card details, passwords, PINs or one-time passwords to us by email, phone or messaging.",
    ],
  },
  {
    title: "7. Shipping and Delivery",
    paragraphs: [
      "Delivery availability, estimated timelines, shipping charges and any installation or handling arrangements will be communicated during checkout or separately for the relevant order. Delivery estimates are not guarantees and may be affected by location, product availability, carrier operations, weather or circumstances outside our reasonable control.",
      "Provide a complete delivery address and reachable phone number. Ensure that the delivery location can safely receive the ordered product, including bulky or heavy equipment. Agree any special delivery, installation or site-readiness requirements in writing before purchase.",
      "Please also review our Refund and shipping policy or contact us before placing an order if your delivery requirements are unusual.",
    ],
  },
  {
    title: "8. Cancellations, Returns and Refunds",
    paragraphs: [
      "Order cancellation, return eligibility, exchanges, refunds and applicable exclusions are governed by our Refund Policy and the terms communicated for the particular product or order, subject to applicable law.",
      "Inspect products on delivery and contact us promptly if an item is damaged, incorrect, missing or appears defective. Keep order details and relevant packaging or photographs where possible to help us assess the issue. Please obtain return instructions from our team before sending an item back.",
      "Nothing in these Terms removes rights that cannot lawfully be excluded under applicable consumer protection law.",
    ],
  },
  {
    title: "9. Safe Use of Sports and Fitness Equipment",
    paragraphs: [
      "Sports and fitness equipment must be selected, installed, maintained and used in accordance with the manufacturer's instructions, warnings, weight limits and safety guidance. Ensure equipment is suitable for its intended user, location and level of use.",
      "Where installation, anchoring, assembly, electrical connection or site preparation is required, it should be performed by suitably qualified persons. Inspect equipment before use and stop using it if it appears damaged, unstable or unsafe.",
      "Customers must follow applicable safety instructions and ensure appropriate supervision and training. This section does not exclude liability that cannot be excluded under applicable law.",
    ],
  },
  {
    title: "10. Acceptable Use",
    paragraphs: [
      "You must not use the website unlawfully, attempt unauthorised access to accounts or systems, interfere with website security or operation, submit fraudulent orders, distribute malicious code, harvest information in violation of applicable law, or infringe another person's rights.",
      "We may restrict or suspend access where reasonably necessary to protect customers, the website or our business, investigate suspected misuse or comply with law.",
    ],
  },
  {
    title: "11. Intellectual Property",
    paragraphs: [
      "Website content, including text, design, graphics, logos, photographs and other materials, is owned by Kreedum or its licensors unless otherwise stated and is protected by applicable intellectual-property laws.",
      "You may use the website for personal or legitimate business shopping purposes. You must not reproduce, republish, modify, distribute or commercially exploit website content without prior permission, except where permitted by law. Third-party product names and trademarks belong to their respective owners.",
    ],
  },
  {
    title: "12. Third-Party Services and Links",
    paragraphs: [
      "The website may link to or use third-party services, including payment, delivery, social-media and messaging platforms. Those services may have separate terms and privacy policies. We do not control independent third-party websites or services. This does not affect any rights you may have under applicable law in relation to our own obligations.",
    ],
  },
  {
    title: "13. Disclaimers and Liability",
    paragraphs: [
      "We aim to keep the website available and information accurate, but we do not guarantee uninterrupted access or that every listing will always be error-free. To the extent permitted by law, we are not responsible for losses caused by circumstances beyond our reasonable control or by use of products contrary to applicable instructions and safety warnings.",
      "Nothing in these Terms excludes or limits any liability, warranty or consumer right that cannot lawfully be excluded or limited. Where the law permits a limitation, liability will be assessed in light of the circumstances and remedies available under applicable law.",
    ],
  },
  {
    title: "14. Privacy",
    paragraphs: [
      "Our collection and use of personal information is described in our Privacy Policy. Please review it to understand how information is handled when you use the website.",
    ],
  },
  {
    title: "15. Changes to the Website or Terms",
    paragraphs: [
      "We may update website features, product listings and these Terms as our services or legal requirements change. Updated Terms will be published on this page with a revised effective date. Changes apply from publication unless otherwise required by law. Orders already accepted remain subject to the terms applicable to them, except where a change is required by law or otherwise agreed.",
    ],
  },
  {
    title: "16. Governing Law and Disputes",
    paragraphs: [
      "These Terms are governed by the laws of India. We encourage customers to contact us first so we can try to resolve a concern promptly. Any dispute will be handled by the courts or forums having jurisdiction under applicable law. Nothing in these Terms restricts a consumer from approaching a forum or authority where the law permits.",
    ],
  },
  {
    title: "17. Contact Us",
    paragraphs: [
      "Kreedum International Private Limited",
      "Upper Ground Floor, Krishna Plaza, Nazirabad Road, Aminabad, Lucknow, Uttar Pradesh 226018, India",
      "Email: info@kreedum.com",
      "Phone: +91 75700 02458",
    ],
  },
];

function TermsSection({ section }) {
  return (
    <section className="border-b border-slate-200 py-7 last:border-b-0">
      <h2 className="text-lg font-bold tracking-tight text-[#0E1A3D] md:text-xl">
        {section.title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 md:text-base">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <>
      <InnerPageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms that apply when you browse, shop or place an order with Kreedum Sports."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Terms & Conditions" },
        ]}
      />

      <main className="bg-[#F6F8FC] px-4 py-10 sm:px-6 md:py-14">
        <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-8 md:px-12 md:py-10">
          <div className="mb-5 rounded-xl bg-[#EAF0FF] p-4 text-sm leading-6 text-[#1F49B8]">
            <p className="font-semibold">
              Effective date: 16 October 2026
            </p>
            <p className="mt-1">
              Please read these Terms before placing an order. Product-specific
              quotes and the linked policies may also apply.
            </p>
          </div>

          <p className="text-sm leading-7 text-slate-600 md:text-base">
            These Terms explain the main rules for using the Kreedum Sports
            ecommerce website and purchasing products through it. If a specific
            written quote or order confirmation contains additional agreed
            terms, those terms apply to that transaction to the extent
            permitted by law.
          </p>

          <div className="mt-3">
            {sections.map((section) => (
              <TermsSection key={section.title} section={section} />
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-[#0E1A3D]">
              Related policies
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                to="/privacy-policy"
                className="font-medium text-[#2C62E0] hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/refund-policy"
                className="font-medium text-[#2C62E0] hover:underline"
              >
                Refund Policy
              </Link>
              <Link
                to="/shipping-policy"
                className="font-medium text-[#2C62E0] hover:underline"
              >
                Refund and shipping policy
              </Link>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            This is a business-policy draft, not legal advice. Review it against
            Kreedum's actual order, delivery, payment and return processes
            before publication.
          </p>
        </article>
      </main>
    </>
  );
}
