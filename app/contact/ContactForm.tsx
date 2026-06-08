"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { servicePages } from "@/lib/site";

// Cloudflare Turnstile site key — defaults to the "always passes" TEST key so the
// form works without setup. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY to your real key.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

type Status = "idle" | "sending" | "error";

const fieldCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-sm transition-colors placeholder:text-muted/70 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30";
const labelCls = "mb-1.5 block text-sm font-medium text-navy";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  function renderWidget() {
    if (typeof window === "undefined" || !window.turnstile || !widgetEl.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetEl.current, {
      sitekey: SITE_KEY,
      callback: (t: string) => setToken(t),
      "error-callback": () => setToken(""),
      "expired-callback": () => setToken(""),
      theme: "light",
    });
  }

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current); } catch { /* ignore */ }
        widgetId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetWidget() {
    setToken("");
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot — bots fill hidden fields. Send them to the confirmation page silently.
    if (data.website) {
      window.location.assign("/thank-you");
      return;
    }

    if (!token) {
      setError("Please complete the verification check below.");
      return;
    }
    data["cf-turnstile-response"] = token;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      window.location.assign("/thank-you");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please email us directly instead.");
      resetWidget();
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>Name <span className="text-teal">*</span></label>
            <input id="name" name="name" required autoComplete="name" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="company" className={labelCls}>Company</label>
            <input id="company" name="company" autoComplete="organization" className={fieldCls} />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelCls}>Email <span className="text-teal">*</span></label>
            <input id="email" name="email" type="email" required autoComplete="email" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="service" className={labelCls}>How can we help?</label>
            <select id="service" name="service" defaultValue="" className={fieldCls}>
              <option value="" disabled>Select a service…</option>
              {servicePages.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
              <option value="General enquiry">General enquiry</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="message" className={labelCls}>Message <span className="text-teal">*</span></label>
          <textarea id="message" name="message" required rows={5} className={fieldCls} />
        </div>

        {/* Honeypot (hidden from users) */}
        <div className="hidden" aria-hidden>
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Cloudflare Turnstile */}
        <div className="mt-5" ref={widgetEl} />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit" variant="green" size="lg" withArrow>
            {status === "sending" ? "Sending…" : "Send enquiry"}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <p className="mt-4 text-xs text-muted">
          By submitting this form you agree to be contacted about your enquiry. We never share your details.
          This site is protected by Cloudflare Turnstile.
        </p>
      </form>
    </>
  );
}
