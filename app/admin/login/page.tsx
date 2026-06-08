"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted/60 focus:border-teal focus:ring-2 focus:ring-teal/25"
      />
    </label>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement)?.value ?? "";
    try {
      const res = await fetch("/api/admin-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }
      const from = new URLSearchParams(window.location.search).get("from");
      router.push(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink-gradient px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo tone="light" />
        </div>
        <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)]">
          <h1 className="font-display text-xl font-semibold text-navy">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Double Helix Pharma console</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Email" type="email" name="email" autoComplete="username"
              defaultValue="admin@doublehelixpharma.co.uk" />
            <Field label="Password" type="password" name="password" autoComplete="current-password"
              placeholder="Access password" />
            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 rounded-lg bg-surface px-3 py-2 text-center text-xs text-muted">
            Protected preview area. Real authentication is implemented by the backend (spec §7).
          </p>
        </div>
        <p className="mt-5 text-center text-xs text-white/45">
          <Link href="/" className="hover:text-white">&larr; Back to website</Link>
        </p>
      </div>
    </div>
  );
}
