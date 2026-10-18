const announcements = [
  "Welcome to Kreedum Sports",
  "Quality Sports & Fitness Equipment",
  "Explore Our Latest Products",
];

function AnnouncementText() {
  return (
    <div className="flex shrink-0 items-center gap-5 px-4">
      {announcements.map((message) => (
        <span
          key={message}
          className="flex shrink-0 items-center gap-5 whitespace-nowrap text-xs font-semibold sm:text-sm"
        >
          {message}
          <span aria-hidden="true" className="text-white/70">
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBanner() {
  return (
    <div
      className="relative z-50 h-8 w-full overflow-hidden bg-[#2C62E0] text-white"
      role="region"
      aria-label="Kreedum announcements"
    >
      <div className="flex h-full items-center">
        <div className="announcement-marquee flex h-full w-max shrink-0 items-center">
          <AnnouncementText />
          <div aria-hidden="true">
            <AnnouncementText />
          </div>
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