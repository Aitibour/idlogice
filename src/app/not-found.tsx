import Link from "next/link";

export default function NotFound() {
  return (
    <div lang="en" className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <p className="text-8xl font-black" style={{ color: "oklch(0.52 0.22 27)" }}>404</p>
          <h2 className="text-2xl font-bold mt-2 mb-3" style={{ color: "#111827" }}>
            Page Not Found
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "#374151" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-bold text-white transition-colors"
              style={{ background: "oklch(0.52 0.22 27)" }}
            >
              Go Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-medium transition-colors"
              style={{ color: "#374151" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
    </div>
  );
}
