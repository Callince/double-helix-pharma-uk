"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { servicePages } from "@/lib/site";

type Status = "idle" | "sending" | "error";

const fieldCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-sm transition-colors placeholder:text-muted/70 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30";
const labelCls = "mb-1.5 block text-sm font-medium text-navy";

export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot — bots fill hidden fields. Send them to the confirmation page silently.
    if (data.website) {
      router.push("/thank-you");
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
      router.push("/thank-you");
    } catch {
      setStatus("error");
    }
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
