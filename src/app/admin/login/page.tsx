"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Lock } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  google_denied: "Sign-in with Google was cancelled or denied. Please try again.",
  invalid_request: "Invalid sign-in request. Please try again.",
  state_mismatch: "Security check failed. Please try signing in again.",
  not_configured: "Google sign-in is not configured yet. Please contact the site owner.",
  token_exchange_failed: "Could not complete the Google sign-in. Please try again.",
  token_invalid: "Google sign-in verification failed. Please try again.",
  not_authorized:
    "This Google account is not authorized to access the admin panel. Sign in with the authorized account.",
  server_error:
    "Google sign-in succeeded, but the admin session could not be saved. Check the database connection and try again.",
};

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const handlePasswordLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");
    setIsPasswordSubmitting(true);

    try {
      const response = await fetch("/api/admin/password/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPasswordError(data.error || "Unable to sign in with password.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setPasswordError("Network error while signing in. Please try again.");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] py-20 min-h-screen text-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl text-center">

          <div className="relative w-16 h-16 rounded-2xl bg-slate-900 p-2 mx-auto shadow-md overflow-hidden flex items-center justify-center text-[#FF3B30]">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-xs font-bold text-[#FF6B61] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF3B30]" /> SECURE ADMIN PORTAL
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
              STORE ADMIN LOGIN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in with Google or your secure admin password to manage the store.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl p-3">
              {ERROR_MESSAGES[error] ?? "Sign-in failed. Please try again."}
            </div>
          )}

          <Button asChild variant="secondary" size="lg" className="w-full h-11 shadow-md text-xs font-black gap-2.5">
            <a href="/api/admin/google/start">
              <GoogleIcon /> Continue with Google
            </a>
          </Button>

          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="h-px flex-1 bg-slate-100" />
            or use password
            <span className="h-px flex-1 bg-slate-100" />
          </div>

          <form onSubmit={handlePasswordLogin} className="space-y-3 text-left">
            <label htmlFor="admin-password" className="text-xs font-bold text-slate-600">
              Admin password
            </label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your admin password"
              autoComplete="current-password"
              required
              disabled={isPasswordSubmitting}
            />
            {passwordError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                {passwordError}
              </p>
            )}
            <Button type="submit" variant="default" size="lg" className="w-full h-11 text-xs font-black" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? "Signing in..." : "Sign in with password"}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Access is restricted to the authorized store owner.
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
