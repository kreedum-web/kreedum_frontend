import { Link } from "react-router-dom";

import { useSiteContent } from "@/hooks/useSiteContent";

// Shown until announcements are set up in the backend (and if all are
// switched off: the strip is part of the fixed header, so it always has text).
const BUILT_IN = [
  { text: "Welcome to Kreedum Sports" },
  { text: "Quality Sports & Fitness Equipment" },
  { text: "Explore Our Latest Products" },
];

function AnnouncementText({ items, hidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-5 px-4" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <span
          key={`${item.text}-${index}`}
          className="flex shrink-0 items-center gap-5 whitespace-nowrap text-xs font-semibold sm:text-sm"
        >
          {item.link ? (
            <Link to={item.link} tabIndex={hidden ? -1 : undefined} className="hover:underline">
              {item.text}
            </Link>
          ) : (
            item.text
          )}
          <span aria-hidden="true" className="text-white/70">
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBanner() {
  const { announcements } = useSiteContent();
  const items = announcements?.length ? announcements : BUILT_IN;

  return (
    <div
      className="relative z-50 h-8 w-full overflow-hidden bg-[#2C62E0] text-white"
      role="region"
      aria-label="Kreedum announcements"
    >
      <div className="flex h-full items-center">
        <div className="announcement-marquee flex h-full w-max shrink-0 items-center">
          <AnnouncementText items={items} />
          <AnnouncementText items={items} hidden />
        </div>
      </div>

      <style>{`
        .announcement-marquee {
          animation: kreedum-marquee 28s linear infinite;
        }

        @keyframes kreedum-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}