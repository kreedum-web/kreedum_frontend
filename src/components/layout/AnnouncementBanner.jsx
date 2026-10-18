
const announcements = [
  "Welcome to Kreedum Sports",
  "Quality Sports & Fitness Equipment",
  "Explore Our Latest Products",
];

function AnnouncementText() {
  return (
    <span className="flex shrink-0 items-center gap-4 px-4">
      {announcements.map((message, index) => (
        <span key={message} className="flex shrink-0 items-center gap-4">
          <span>{message}</span>
          <span aria-hidden="true" className="text-white/60">
            •
          </span>
        </span>
     ))}
    </span>
  );
    }
export default function AnnouncementBanner() {
  return (
    <div
      className="relative z-50 w-full overflow-hidden bg-[#2C62E0] text-white"
      role="region"
      aria-label="Kreedum announcements"
    >
      <div className="flex h-8 items-center overflow-hidden">
        <div className="announcement-marquee flex w-max shrink-0">
          <AnnouncementText />
          <div aria-hidden="true">
            <AnnouncementText />
          </div>
        </div>
      </div>

      <style>{`
        .announcement-marquee {
          animation: kreedum-marquee 30s linear infinite;
          will-change: transform;
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
