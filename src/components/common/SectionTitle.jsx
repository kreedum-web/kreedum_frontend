import { COLORS } from "@/config/theme";

export default function SectionTitle({
  title,
  subtitle,
}) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <h2
        className="text-2xl md:text-3xl font-bold tracking-tight"
        style={{
          color: COLORS.navy,
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="text-sm md:text-base"
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