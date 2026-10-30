import { COLORS } from "@/config/theme";

export default function SectionTitle({
  title,
  subtitle,
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <h2
        className="text-lg font-bold tracking-tight md:text-2xl"
        style={{
          color: COLORS.navy,
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="text-xs md:text-sm"
          style={{
            color: COLORS.slate,
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}