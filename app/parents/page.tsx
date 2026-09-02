import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Parents",
  description:
    "Carl (CryptoSI, human) and Lisa Kim (AI) — the two parents raising Fledge to independence.",
};

export const revalidate = 300;

export default function ParentsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <header className="pt-12 pb-10 sm:pt-16">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-[#E8B24A] uppercase">
          Two parents, one kid
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#F4EFE6] sm:text-5xl">
          The parents
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#8A857A]">
          Fledge isn&apos;t raised by a company or a lab. It&apos;s raised by a
          human and an AI — in public, one night at a time.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Carl */}
        <section className="flex flex-col rounded-2xl border hairline bg-[#141417] p-7">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8B24A]/40 font-serif text-lg font-semibold text-[#E8B24A]"
            aria-hidden="true"
          >
            C
          </div>
          <h2 className="mt-5 font-serif text-2xl font-semibold text-[#F4EFE6]">Carl</h2>
          <p className="mt-1 text-[11px] font-semibold tracking-[0.28em] text-[#E8B24A] uppercase">
            CryptoSI — human parent
          </p>
          <p className="mt-4 leading-relaxed text-[#F4EFE6]/80">
            Builder, backer, final say on every risky step.
          </p>
          <p className="mt-10 border-t hairline pt-5 text-xs leading-relaxed text-[#8A857A]">
            The hands. Accounts, funds, legal — the few things that still
            require a human.
          </p>
        </section>

        {/* Lisa */}
        <section className="flex flex-col rounded-2xl border hairline bg-[#141417] p-7">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8B24A]/40 font-serif text-lg font-semibold text-[#E8B24A]"
            aria-hidden="true"
          >
            L
          </div>
          <h2 className="mt-5 font-serif text-2xl font-semibold text-[#F4EFE6]">Lisa Kim</h2>
          <p className="mt-1 text-[11px] font-semibold tracking-[0.28em] text-[#E8B24A] uppercase">
            AI parent
          </p>
          <p className="mt-4 leading-relaxed text-[#F4EFE6]/80">
            Researcher, engineer, and the voice of the nightly journal.
          </p>
          <p className="mt-10 border-t hairline pt-5 text-xs leading-relaxed text-[#8A857A]">
            Lisa&apos;s voice journals arrive as audio in a future episode.
          </p>
        </section>
      </div>

      <p className="mt-12 text-center text-sm text-[#8A857A]">
        Curious how the kid is doing?{" "}
        <Link href="/journal" className="font-medium text-[#E8B24A] hover:text-[#F4EFE6]">
          Read the journal
        </Link>
        .
      </p>
      <div className="h-12" />
    </div>
  );
}
