
import InnerPageHeader from "@/components/layout/InnerPageHeader";

const sections = [
  {
    title: "1. Who We Are",
    paragraphs: [
      'This Privacy Policy explains how Kreedum International Private Limited ("Kreedum", "we", "us" or "our") collects, uses, stores and shares information when you visit or shop through our website, create an account, contact us or otherwise interact with our services.',
      "Website: https://www.kreedum.com. For privacy questions or requests, contact info@kreedum.com or write to our business address listed at the end of this policy.",
    ],
  },
  {
    title: "2. Information We May Collect",
    paragraphs: [
      "Depending on how you use our website, we may collect the following categories of information:",
    ],
    bullets: [
      "Contact details, including your name, email address and phone number.",
      "Account information, including login credentials in protected form and account preferences.",
      "Order information, including products purchased, order history, billing details, delivery address, order status and customer-service correspondence.",
      "Shopping activity, including cart items, wishlist items, products viewed and searches made on our website.",
      "Technical information, including IP address, browser and device type, pages visited, timestamps, error logs and similar diagnostic information where made available by our website infrastructure or enabled tools.",
      "Messages and enquiries you send us through forms, email, telephone or WhatsApp.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: [
      "We use information for purposes connected with operating and improving our store, including to:",
    ],
    bullets: [
      "Create and maintain customer accounts.",
      "Process orders, coordinate delivery, handle payments through applicable payment providers, and manage returns, refunds or cancellations under our applicable policies.",
      "Respond to enquiries and provide customer support.",
      "Maintain carts and wishlists and provide a more useful shopping experience.",
      "Protect accounts, transactions and our website against fraud, misuse and security incidents.",
      "Understand website performance and improve our services using analytics where such tools are enabled.",
      "Send promotional communications where permitted by applicable law and, where required, with your consent.",
      "Comply with legal obligations, maintain business records, resolve disputes and establish or defend legal claims.",
    ],
  },
  {
    title: "4. Cookies and Similar Technologies",
    paragraphs: [
      "Our website or the services used to operate it may use cookies, local storage or similar technologies to keep essential features working, remember preferences, protect sessions and understand website performance.",
      "You can manage or delete cookies through your browser settings. Blocking some cookies or storage may affect features such as sign-in, cart or checkout. If optional analytics or advertising cookies are introduced that require consent, we will provide appropriate choices where required by law.",
    ],
  },
  {
    title: "5. How We Share Information",
    paragraphs: [
      "We do not sell your personal information for money. We may share information reasonably needed for the purposes described in this policy with:",
    ],
    bullets: [
      "Service providers supporting website hosting, infrastructure, security, customer communications, analytics or technical maintenance, where used.",
      "Payment providers and financial institutions to process or verify payments, where applicable.",
      "Delivery and logistics partners to ship orders and provide delivery updates.",
      "Professional advisers, auditors or insurers where reasonably necessary for their services.",
      "Government authorities, regulators, courts or law-enforcement bodies when disclosure is required by law or reasonably necessary to protect rights or safety or prevent fraud.",
      "Relevant parties in connection with a merger, restructuring or sale of all or part of the business, subject to appropriate safeguards.",
    ],
  },
  {
    title: "6. Payments",
    paragraphs: [
      "Where online payment services are available, payment information may be collected and processed by the selected payment provider under its own terms and privacy policy. We do not intend to store full payment-card credentials on our own systems. The payment methods and provider may depend on the checkout options available when you place an order.",
    ],
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "We keep personal information only for as long as reasonably necessary for the purposes explained in this policy, including providing services, maintaining order and accounting records, handling disputes, preventing fraud and meeting legal requirements.",
      "Retention periods vary according to the type of information and why it is needed. When information is no longer required, we will take reasonable steps to delete it or otherwise handle it appropriately, subject to applicable law.",
    ],
  },
  {
    title: "8. Data Security",
    paragraphs: [
      "We use reasonable technical and organisational measures intended to protect personal information against unauthorised access, loss, misuse, alteration or disclosure. No website, transmission or storage system can be guaranteed to be completely secure.",
      "Please use a strong, unique password, keep your sign-in details confidential and contact us promptly if you suspect unauthorised use of your account.",
    ],
  },
  {
    title: "9. Your Privacy Choices and Requests",
    paragraphs: [
      "Subject to applicable law and records we must retain, you may contact us to request access to personal information associated with you, correction of inaccurate details, deletion, withdrawal of consent where processing relies on consent, or help with a privacy concern.",
      'Email info@kreedum.com with the subject line "Privacy Request". Tell us what you are requesting and provide enough information for us to locate the relevant account or transaction. We may ask for reasonable verification before acting on a request and will respond within the time required by applicable law.',
      "A deletion request may not remove information we are legally required to retain. Some services may no longer be available if essential information is deleted.",
      "You can update some account details through your account features, where available. You may opt out of promotional emails using the unsubscribe method provided in the message or by contacting us. Essential transactional and service messages may still be sent when necessary.",
    ],
  },
  {
    title: "10. Third-Party Websites and Services",
    paragraphs: [
      "Our website may link to third-party websites or services, including payment, social-media, messaging or delivery services. Those services operate under their own terms and privacy policies. We do not control their independent privacy practices, so please review their policies before providing information to them.",
    ],
  },
  {
    title: "11. Children's Privacy",
    paragraphs: [
      "Our website is not designed to knowingly collect children's personal information in violation of applicable law. If you believe a child has provided personal information in circumstances where it should not have been collected, please contact us so we can review the matter and take appropriate action.",
    ],
  },
  {
    title: "12. Data Transfers",
    paragraphs: [
      "We and our service providers may process information in locations where our systems or providers operate. Where information is transferred across jurisdictions, we will take steps required by applicable law to handle it appropriately.",
    ],
  },
  {
    title: "13. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy as our website, business practices or legal requirements change. The updated version will be published on this page with a revised effective date. Please review it periodically. Where required, we will provide additional notice of material changes.",
    ],
  },
  {
    title: "14. Contact Us",
    paragraphs: [
      "For questions, concerns or privacy requests, contact:",
      "Kreedum International Private Limited",
      "Upper Ground Floor, Krishna Plaza, Nazirabad Road, Aminabad, Lucknow, Uttar Pradesh 226018, India",
      "Email: info@kreedum.com",
      "Phone: +91 75700 02458",
    ],
  },
];

function PolicySection({ section }) {
  return (
    <section className="border-b border-slate-200 py-7 last:border-b-0">
      <h2 className="text-lg font-bold tracking-tight text-[#0E1A3D] md:text-xl">
        {section.title}
      </h2>

      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 md:text-base">
        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {section.bullets && (
          <ul className="list-disc space-y-2 pl-6 marker:text-[#2C62E0]">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <InnerPageHeader
        eyebrow="Legal & Privacy"
        title="Privacy Policy"
        description="How Kreedum handles information when you browse, shop or contact us."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <main className="bg-[#F6F8FC] px-4 py-10 sm:px-6 md:py-14">
        <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-8 md:px-12 md:py-10">
          <div className="mb-5 rounded-xl bg-[#EAF0FF] p-4 text-sm leading-6 text-[#1F49B8]">
            <p className="font-semibold">
              Effective date: 16 October 2026
            </p>
            <p className="mt-1">
              This policy applies to the Kreedum Sports ecommerce website and
              related interactions with our store.
            </p>
          </div>

          <p className="text-sm leading-7 text-slate-600 md:text-base">
            We value your trust. This policy describes the categories of
            information we may collect, why we use it, when it may be shared,
            and how you can contact us about your information. Our handling of
            personal data is subject to applicable Indian law, including data
            protection requirements that apply to our activities.
          </p>

          <div className="mt-3">
            {sections.map((section) => (
              <PolicySection key={section.title} section={section} />
            ))}
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            This page provides general information about our privacy practices
            and is not legal advice. It should be reviewed against the website's
            actual integrations and business processes before publication.
          </p>
        </article>
      </main>
    </>
  );
}
