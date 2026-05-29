import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-8xl font-bold text-red-600">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-semibold text-gray-900">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-600 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}