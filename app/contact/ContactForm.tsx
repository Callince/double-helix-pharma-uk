"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { servicePages } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const fieldCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-sm transition-colors placeholder:text-muted/70 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30";
const labelCls = "mb-1.5 block text-sm font-medium text-navy";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot — bots fill hidden fields.
    if (data.website) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-teal/10 text-teal">
          <Icon name="check" className="size-7" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-navy">Thank you</h3>
        <p className="mt-2 text-sm text-muted">
          Your enquiry has been received. We aim to respond within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-[#1d6d85] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name <span className="text-teal">*</span>
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="company" className={labelCls}>
            Company
          </label>
          <input id="company" name="company" autoComplete="organization" className={fieldCls} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelCls}>
            Email <span className="text-teal">*</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="service" className={labelCls}>
            How can we help?
          </label>
          <select id="service" name="service" defaultValue="" className={fieldCls}>
            <option value="" disabled>
              Select a service…
            </option>
            {servicePages.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="General enquiry">General enquiry</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelCls}>
          Message <span className="text-teal">*</span>
        </label>
        <textarea id="message" name="message" required rows={5} className={fieldCls} />
      </div>

      {/* Honeypot (hidden from users) */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="green" size="lg" withArrow>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </Button>
        {status === "error" && (
          <p className="text-sm text-red-600">
            Something went wrong. Please email us directly instead.
          </p>
        )}
      </div>
      <p className="mt-4 text-xs text-muted">
        By submitting this form you agree to be contacted about your enquiry. We never share your details.
      </p>
    </form>
  );
}
