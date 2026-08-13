import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Toggle to pause/resume Admin Panel access
  const isAdminPaused = false;

  if (isAdminPaused) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-blue-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-white">Admin Panel Paused</h1>
            <p className="text-sm text-slate-400 mt-2">
              The Viper Gears Admin Panel is temporarily paused. Store operations, catalog browsing, cart, and payment checkout remain 100% active and functional.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-xs font-extrabold uppercase px-6 h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl w-full transition-all shadow-lg shadow-blue-500/20"
          >
            <ArrowLeft className="w-4 h-4" /> Return To Store Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
