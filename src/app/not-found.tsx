"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <Button variant="default" size="lg" asChild className="rounded-full text-sm text-white">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
