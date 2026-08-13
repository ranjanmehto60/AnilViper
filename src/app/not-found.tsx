import Link from "next/link";

export default function NotFound() {
  return (
    <div className="editorial-page flex min-h-screen items-center justify-center py-24">
      <div className="mx-auto max-w-md space-y-5 px-4 text-center">
        <div className="display-title text-8xl leading-none text-accent">404</div>
        <h1 className="text-2xl font-medium tracking-tight text-ink">
          Page not found
        </h1>
        <p className="text-sm text-muted">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on the mat.
        </p>
        <Link href="/" className="inline-flex h-13 items-center justify-center rounded-lg bg-ink px-7 py-2.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
