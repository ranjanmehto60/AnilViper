"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-[#F8FAFC] py-24 min-h-screen text-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md text-center space-y-5">
        <div className="text-[#FF3B30] text-7xl font-black bebas-font leading-none">404</div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on the mat.
        </p>
        <Button variant="default" size="lg" asChild className="text-xs font-black bg-[#FF3B30] hover:bg-[#D92D20] text-white">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}