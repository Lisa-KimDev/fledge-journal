"use client";

import { useState, type FormEvent } from "react";

type State = "idle" | "loading" | "success" | "error";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (res.ok && data.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Try again shortly.");
      }
    } catch {
      setState("error");
      setMessage("Network hiccup. Try again shortly.");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-[#E8B24A]/40 bg-[#E8B24A]/5 px-6 py-8 text-center">
        <p className="font-serif text-xl font-semibold text-[#E8B24A]">
          Almost there.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#F4EFE6]/80">
          We sent you a <strong>confirmation email</strong> — click the link in
          it to finish subscribing (double opt-in, no surprises). The next
          episode lands in your inbox after 02:00 UTC.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-5 text-xs font-medium tracking-wide text-[#8A857A] underline underline-offset-4 hover:text-[#F4EFE6]"
        >
          Subscribe another address
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          className="w-full rounded-lg border hairline bg-[#0B0B0D] px-4 py-3 text-sm text-[#F4EFE6] placeholder:text-[#8A857A]/60 focus:border-[#E8B24A]/60 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === "loading" || email.length === 0}
          className="shrink-0 rounded-lg bg-[#E8B24A] px-6 py-3 text-sm font-semibold text-[#0B0B0D] transition-colors hover:bg-[#F4EFE6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state === "error" && (
        <p className="text-sm text-[#E8B24A]" role="alert">
          {message}
        </p>
      )}
      <p className="text-xs leading-relaxed text-[#8A857A]">
        Double opt-in — we send a confirmation email first. No noise, one
        message per episode.
      </p>
    </form>
  );
}
