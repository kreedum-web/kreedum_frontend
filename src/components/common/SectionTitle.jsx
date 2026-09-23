export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <h2 className="text-3xl font-bold text-[#0E1A3D]">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}