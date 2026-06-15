"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type State = "idle" | "loading" | "ok" | "error";

/** Newsletter signup → POST /api/subscribe → addSubscriber(). Styled for the dark footer. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    const fd = new FormData(e.currentTarget);
    const payload = { email: String(fd.get("email") || ""), website: String(fd.get("website") || "") };
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState("ok");
        setEmail("");
      } else {
        setState("error");
        setMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMsg("Could not reach the server. Please try again.");
    }
  }

  if (state === "ok") {
    return (
      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-cyan">
        <Icon name="check" className="size-4 shrink-0" /> Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-3" noValidate>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-cyan focus:ring-2 focus:ring-cyan/30"
        />
        {/* honeypot — hidden from users, bots fill it */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded-lg bg-green px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-xs text-rose-300">{msg}</p>}
    </form>
  );
}
