import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalUnreachable } from "@/components/LiveStrip";
import { formatDate, getEntryBySlug, getNeighbours, thumbnailUrl, type Entry } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";

export const revalidate = 300;

interface EntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: entry } = await getEntryBySlug(slug);
  if (!entry) return { title: "Entry not found" };
  return {
    title: `EP ${entry.id} — ${entry.title}`,
    description: entry.summary,
    openGraph: {
      title: `EP ${entry.id} — ${entry.title}`,
      description: entry.summary,
      type: "article",
      publishedTime: entry.entry_date,
    },
  };
}

function Section({
  kicker,
  title,
  body,
  first,
}: {
  kicker: string;
  title: string;
  body: string | null;
  first?: boolean;
}) {
  if (!body || !body.trim()) return null;
  return (
    <section className="border-t hairline pt-8">
      <p className="text-[11px] font-semibold tracking-[0.32em] text-[#E8B24A] uppercase">
        {kicker}
      </p>
      <h2 className="mt-2 mb-2 font-serif text-2xl font-semibold text-[#F4EFE6]">{title}</h2>
      <div className={`prose-fledge ${first ? "drop-cap" : ""}`}>{renderMarkdown(body)}</div>
    </section>
  );
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { slug } = await params;
  const { data: entry, isError } = await getEntryBySlug(slug);

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <JournalUnreachable />
      </div>
    );
  }
  if (!entry) notFound();

  const { prev, next } = await getNeighbours(entry.id);
  const art = thumbnailUrl(entry.thumbnail_path);

  return (
    <article className="pb-8">
      {/* art header — taller crop on desktop */}
      <header>
        {art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={art}
            alt={`${entry.title} episode art`}
            className="max-h-[62vh] w-full object-cover md:max-h-[70vh]"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-[#141417]">
            <span className="day-numeral text-8xl font-semibold text-[#E8B24A]/25">{entry.id}</span>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-8 grid gap-10 lg:grid-cols-[200px_minmax(0,42rem)] lg:gap-12 lg:justify-center">
          {/* episode meta — in-flow on mobile, sticky rail on desktop */}
          <aside className="hidden lg:block" aria-label="Episode details">
            <div className="sticky top-24 space-y-4">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.32em] text-[#E8B24A] uppercase">
                  EP {entry.id}
                </span>
                <p className="mt-2 text-xs tracking-wide text-[#8A857A]">
                  {formatDate(entry.entry_date)}
                </p>
              </div>
              {entry.mood && (
                <p className="border-l-2 border-[#E8B24A]/40 pl-3 font-serif text-sm leading-relaxed text-[#F4EFE6]/80 italic">
                  {entry.mood}
                </p>
              )}
              <Link
                href="/journal"
                className="inline-block text-xs font-medium text-[#E8B24A] transition-colors hover:text-[#F4EFE6]"
              >
                ← All episodes
              </Link>
            </div>
          </aside>

          <div>
            {/* mobile-only in-flow header block */}
            <div className="lg:hidden">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-[11px] font-semibold tracking-[0.32em] text-[#E8B24A] uppercase">
                  EP {entry.id}
                </span>
                <span className="text-xs tracking-wide text-[#8A857A]">{formatDate(entry.entry_date)}</span>
              </div>
              <h1 className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#F4EFE6] sm:text-4xl">
                {entry.title}
              </h1>
              {entry.summary && (
                <p className="mt-4 max-w-2xl leading-relaxed text-[#8A857A]">{entry.summary}</p>
              )}
            </div>
            {/* desktop title (aligned with reading column) */}
            <h1 className="mt-2 hidden font-serif text-3xl leading-tight font-semibold tracking-tight text-[#F4EFE6] sm:text-4xl lg:block">
              {entry.title}
            </h1>
            {entry.summary && (
              <p className="mt-4 hidden max-w-2xl leading-relaxed text-[#8A857A] lg:block">
                {entry.summary}
              </p>
            )}

            <div className="mt-10 space-y-10">
              <Section kicker="01" title="Learned" body={entry.learned_md} first />
              <Section kicker="02" title="What we did" body={entry.actions_md} />
              <Section kicker="03" title="Next" body={entry.tomorrow_md} />
            </div>

            {/* mood sign-off */}
            {entry.mood && (
              <p className="mt-14 border-t hairline pt-8 text-center font-serif text-xl leading-relaxed text-[#F4EFE6]/90 italic">
                “{entry.mood}”
              </p>
            )}

            {/* prev / next */}
            <nav aria-label="Entry navigation" className="mt-12 grid gap-3 border-t hairline pt-8 sm:grid-cols-2">
              <NeighbourLink entry={prev} direction="prev" />
              <NeighbourLink entry={next} direction="next" />
            </nav>
          </div>
        </div>
      </div>
    </article>
  );
}

function NeighbourLink({ entry, direction }: { entry: Entry | null; direction: "prev" | "next" }) {
  if (!entry) {
    return <span className="text-sm text-[#8A857A]/50">The story begins here.</span>;
  }
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className={`group rounded-xl border hairline bg-[#141417] p-4 transition-colors hover:border-[#E8B24A]/40 ${
        isPrev ? "" : "sm:text-right"
      }`}
    >
      <span className="text-[11px] font-semibold tracking-[0.28em] text-[#8A857A] uppercase">
        {isPrev ? "← Earlier" : "Later →"}
      </span>
      <span
        className={`mt-1 block font-serif text-base font-semibold text-[#F4EFE6] group-hover:text-[#E8B24A]`}
      >
        EP {entry.id} — {entry.title}
      </span>
    </Link>
  );
}
