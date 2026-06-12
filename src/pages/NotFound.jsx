import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <Compass className="mx-auto mb-4 text-ink-300" size={48} aria-hidden="true" />
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
        This route doesn't exist, but your retirement plan still does.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
