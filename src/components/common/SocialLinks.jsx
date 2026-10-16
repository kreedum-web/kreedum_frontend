import { SOCIAL_LINKS } from "@/data/socialLinks";

export default function SocialLinks() {
  return (
    <div className="mt-5 flex items-center gap-3">
      {SOCIAL_LINKS.map(({ name, href, path }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Kreedum Sports on ${name}`}
          title={name}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors hover:border-[#8FADFF] hover:bg-white/10"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="text-white/80"
          >
            <path d={path} />
          </svg>
        </a>
      ))}
    </div>
  );
}