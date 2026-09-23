import { LoaderCircle } from "lucide-react";

function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <LoaderCircle className="w-8 h-8 animate-spin text-[#2C62E0]" />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-3 space-y-3">
      <div className="h-44 rounded-xl bg-gray-200"></div>
      <div className="h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
      <div className="h-8 rounded bg-gray-200"></div>
    </div>
  );
}

const Loader = {
  Spinner,
  ProductSkeleton,
};

export default Loader;