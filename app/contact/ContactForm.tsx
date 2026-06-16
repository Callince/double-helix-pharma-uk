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
type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

const fieldBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-muted/70 focus:outline-none focus:ring-2";
const fieldOk = "border-line focus:border-teal focus:ring-teal/30";
const fieldError = "border-red-400 focus:border-red-500 focus:ring-red-200";
const labelCls = "mb-1.5 block text-sm font-medium text-navy";

function validate(d: Record<string, string>): Errors {
  const e: Errors = {};
  if (!d.name?.trim()) e.name = "Please enter your name.";
  if (!d.email?.trim()) e.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()))
    e.email = "Please enter a valid email address.";
  if (!d.message?.trim()) e.message = "Please tell us a little about your enquiry.";
  return e;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [token, setToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
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

  // After the first submit attempt, validate live so errors clear as the user fixes them.
  function onFormChange() {
    if (!attempted || !formRef.current) return;
    const data = Object.fromEntries(new FormData(formRef.current).entries()) as Record<string, string>;
    setErrors(validate(data));
  }

  function fieldClass(name: FieldName) {
    return `${fieldBase} ${errors[name] ? fieldError : fieldOk}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return; // guard against double-submit
    setFormError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot — bots fill hidden fields. Send them to the confirmation page silently.
    if (data.website) {
      window.location.assign("/thank-you");
      return;
    }

    // Inline field validation — show errors by the field, focus the first problem.
    const fieldErrors = validate(data);
    setAttempted(true);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      const first = (["name", "email", "message"] as const).find((k) => fieldErrors[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    if (!token) {
      setFormError("Please complete the verification check below.");
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
      setFormError("Something went wrong. Please email us directly instead.");
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
        ref={formRef}
        onSubmit={onSubmit}
        onChange={onFormChange}
        className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>Name <span className="text-teal">*</span></label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={fieldClass("name")}
            />
            {errors.name && (
              <p id="name-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="company" className={labelCls}>Company</label>
            <input id="company" name="company" autoComplete="organization" className={`${fieldBase} ${fieldOk}`} />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelCls}>Email <span className="text-teal">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={fieldClass("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="service" className={labelCls}>How can we help?</label>
            <select id="service" name="service" defaultValue="" className={`${fieldBase} ${fieldOk}`}>
              <option value="" disabled>Select a service…</option>
              {servicePages.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
              <option value="General enquiry">General enquiry</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="message" className={labelCls}>Message <span className="text-teal">*</span></label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={fieldClass("message")}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        {/* Honeypot (hidden from users) */}
        <div className="hidden" aria-hidden>
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Cloudflare Turnstile */}
        <div className="mt-5" ref={widgetEl} />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit" variant="green" size="lg" withArrow disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send enquiry"}
          </Button>
          {formError && (
            <p role="alert" className="text-sm font-medium text-red-600">{formError}</p>
          )}
        </div>
        <p className="mt-4 text-xs text-muted">
          By submitting this form you agree to be contacted about your enquiry. We never share your details.
          This site is protected by Cloudflare Turnstile.
        </p>
      </form>
    </>
  );
}
