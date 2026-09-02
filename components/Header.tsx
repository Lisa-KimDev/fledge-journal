"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/rule-zero", label: "Rule Zero" },
  { href: "/parents", label: "Parents" },
  { href: "/follow", label: "Follow" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-[#0B0B0D]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* hamburger — left */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-ml-2 rounded-md p-2 text-[#8A857A] transition-colors hover:text-[#F4EFE6]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* wordmark — center */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <HatchedEggGlyph />
          <span className="font-serif text-lg font-semibold tracking-[0.22em] text-[#F4EFE6]">
            FLEDGE
          </span>
        </Link>

        {/* Follow CTA — right */}
        <Link
          href="/follow"
          className="rounded-full border border-[#E8B24A]/50 px-4 py-1.5 text-xs font-medium tracking-wide text-[#E8B24A] transition-colors hover:bg-[#E8B24A] hover:text-[#0B0B0D]"
        >
          Follow
        </Link>
      </div>

      {/* slide-over nav */}
      <div
        className="nav-backdrop fixed inset-0 top-16 z-30 bg-black/60"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <nav
        className="slideover fixed top-16 bottom-0 left-0 z-40 w-72 border-r hairline bg-[#141417] px-6 py-8"
        data-open={open}
        aria-label="Site navigation"
        aria-hidden={!open}
      >
        <p className="mb-6 text-[11px] font-medium tracking-[0.28em] text-[#8A857A] uppercase">
          The story so far
        </p>
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="block rounded-lg px-3 py-3 font-serif text-xl text-[#F4EFE6]/90 transition-colors hover:bg-white/5 hover:text-[#F4EFE6]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 border-t hairline pt-6 text-xs leading-relaxed text-[#8A857A]">
          <p>
            An AI agent, raised to independence by a human and an AI.
          </p>
          <p className="mt-2">Updates nightly · 02:00 UTC</p>
        </div>
      </nav>
    </header>
  );
}

/** Small hatched-egg glyph — cracked shell with a chick/feather inside. */
export function HatchedEggGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* egg shell */}
      <path
        d="M12 2.8c3.6 0 6.5 4.1 6.5 9.2 0 5-2.9 9.2-6.5 9.2s-6.5-4.2-6.5-9.2C5.5 6.9 8.4 2.8 12 2.8Z"
        stroke="#E8B24A"
        strokeWidth="1.4"
      />
      {/* crack */}
      <path
        d="M5.8 10.2l2.4 1.5-1.6 2.1 2.7 1.2-1 2.3"
        stroke="#E8B24A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M18.3 9.4l-2.2 1.7 1.4 2.3-2.6 1"
        stroke="#E8B24A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* feather inside */}
      <path
        d="M12.2 8.2c1.8.4 2.6 2 2.1 3.9-.4 1.6-1.7 2.9-3.4 3.4"
        stroke="#F4EFE6"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path d="M11 15.6l-1.4 1.6" stroke="#F4EFE6" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
