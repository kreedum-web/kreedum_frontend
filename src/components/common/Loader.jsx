
import "./Loader.css";

function Spinner() {
  return (
    <div
      className="kreedum-loader"
      role="status"
      aria-label="Loading"
    >
      <div className="kreedum-ball">
        <div className="kreedum-ball-seams">
          <span className="kreedum-seam kreedum-seam-one" />
          <span className="kreedum-seam kreedum-seam-two" />
        </div>
      </div>

      <div className="kreedum-ball-shadow" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-3 space-y-3">
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
