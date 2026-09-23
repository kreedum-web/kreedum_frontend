import { Link } from "react-router-dom";
import { Button } from "@/components/common";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F6F8FC]">
      <h1 className="text-6xl font-bold text-[#2C62E0]">404</h1>

      <h2 className="text-2xl font-semibold text-[#0E1A3D]">
        Page Not Found
      </h2>

      <p className="text-gray-500">
        The page you are looking for doesn't exist.
      </p>

      <Link to="/">
        <Button>Back to Homepage</Button>
      </Link>
    </div>
  );
}