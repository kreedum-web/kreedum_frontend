
import logo from "@/assets/logo.png";
import "./Loader.css";

function Spinner() {
  return (
    <div
      className="kreedum-loader"
      role="status"
      aria-label="Loading"
    >
      <div className="kreedum-loader-mark">
        <span className="kreedum-loader-ring" aria-hidden="true" />

        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="kreedum-loader-logo"
        />

        <span
          className="kreedum-loader-spark"
          aria-hidden="true"
        />
      </div>

      <p className="kreedum-loader-label">
        Getting things ready
      </p>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl border bg-white p-3">
      <div className="h-44 rounded-xl bg-gray-200" />
      <div className="h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
      <div className="h-8 rounded bg-gray-200" />
    </div>
  );
}

const Loader = {
  Spinner,
  ProductSkeleton,
};

export default Loader;
