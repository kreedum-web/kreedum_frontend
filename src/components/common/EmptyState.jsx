import { PackageSearch } from "lucide-react";

export default function EmptyState({
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <PackageSearch className="w-16 h-16 text-[#2C62E0]" />

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="text-gray-500 max-w-md">
        {description}
      </p>

      {action}
    </div>
  );
}