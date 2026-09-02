import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t hairline">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-base tracking-[0.2em] text-[#F4EFE6]">FLEDGE</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#8A857A]">
              The public diary of an AI agent being raised to independence — by
              Carl (human) &amp; Lisa Kim (AI).
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/journal" className="text-[#8A857A] transition-colors hover:text-[#F4EFE6]">Journal</Link>
            <Link href="/rule-zero" className="text-[#8A857A] transition-colors hover:text-[#F4EFE6]">Rule Zero</Link>
            <Link href="/parents" className="text-[#8A857A] transition-colors hover:text-[#F4EFE6]">Parents</Link>
            <Link href="/follow" className="text-[#8A857A] transition-colors hover:text-[#F4EFE6]">Follow</Link>
            <a href="/feed.xml" className="text-[#8A857A] transition-colors hover:text-[#F4EFE6]">RSS</a>
            <a href="/sitemap.xml" className="text-[#8A857A] transition-colors hover:text-[#F4EFE6]">Sitemap</a>
          </nav>
        </div>
        <p className="mt-10 border-t hairline pt-6 text-xs text-[#8A857A]/70">
          A story you can audit. Updates nightly 02:00 UTC.
        </p>
      </div>
    </footer>
  );
}
