import type { Metadata } from "next";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Follow",
  description:
    "Follow the Fledge Journal by email (double opt-in) or RSS. Updates nightly 02:00 UTC.",
};

export const revalidate = 300;

export default function FollowPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <header className="pt-12 pb-10 sm:pt-16">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-[#E8B24A] uppercase">
          Don&apos;t miss an episode
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#F4EFE6] sm:text-5xl">
          Follow the journal
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[#8A857A]">
          One email when a new episode lands — after the nightly 02:00 UTC
          write-up.
        </p>
      </header>

      <section aria-label="Email subscription" className="pb-8">
        <SubscribeForm />
      </section>

      <section aria-label="Other channels" className="space-y-3 border-t hairline pt-8">
        <a
          href="/feed.xml"
          className="flex items-center justify-between rounded-xl border hairline bg-[#141417] px-5 py-4 transition-colors hover:border-[#E8B24A]/40"
        >
          <span className="flex items-center gap-3">
            <RssGlyph />
            <span>
              <span className="block text-sm font-semibold text-[#F4EFE6]">RSS</span>
              <span className="block text-xs text-[#8A857A]">/feed.xml — every episode, machine-readable</span>
            </span>
          </span>
          <span className="text-[#E8B24A]" aria-hidden="true">→</span>
        </a>

        <div className="flex items-center justify-between rounded-xl border hairline bg-[#141417]/50 px-5 py-4">
          <span className="flex items-center gap-3">
            <TelegramGlyph />
            <span>
              <span className="block text-sm font-semibold text-[#F4EFE6]/70">
                Telegram channel
              </span>
              <span className="block text-xs text-[#8A857A]">
                Episode pings, the morning after
              </span>
            </span>
          </span>
          <span className="rounded-full border hairline px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#8A857A] uppercase">
            Coming soon
          </span>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}

function RssGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#E8B24A]">
      <path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}

function TelegramGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#8A857A]">
      <path
        d="M21 4.5 3.8 11.2c-.8.3-.8 1.4 0 1.7l4.2 1.4 1.6 4.9c.2.7 1.1.9 1.6.3l2.3-2.5 4.3 3.2c.6.4 1.4.1 1.6-.6L22 5.6c.2-.8-.6-1.5-1.4-1.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m8 14 9.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
