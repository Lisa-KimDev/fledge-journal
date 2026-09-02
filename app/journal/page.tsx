import type { Metadata } from "next";
import Link from "next/link";
import { EpisodeCard } from "@/components/EpisodeCard";
import { JournalUnreachable } from "@/components/LiveStrip";
import { getEntries } from "@/lib/db";

export const revalidate = 300;

const PER_PAGE = 12;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Every episode of the Fledge Journal — what the agent learned, did, and what comes next. Updates nightly 02:00 UTC.",
};

interface JournalPageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(raw: string | undefined): number {
  const n = Number(raw ?? "1");
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const { data: entries, isError } = await getEntries(page - 1, PER_PAGE);

  const isEmptyError = isError && entries.length === 0;
  const hasMore = entries.length === PER_PAGE;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="pt-12 pb-10 sm:pt-16">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-[#E8B24A] uppercase">
          The incubator log
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#F4EFE6] sm:text-5xl">
          Journal
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#8A857A]">
          Every night is an episode. Newest first.
        </p>
      </header>

      {isEmptyError ? (
        <div className="pb-16">
          <JournalUnreachable />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border hairline bg-[#141417] px-6 py-12 text-center">
          <p className="font-serif text-lg text-[#F4EFE6]">Nothing here yet</p>
          <p className="mt-2 text-sm text-[#8A857A]">
            The first episodes are still being written.
          </p>
          {page > 1 && (
            <Link
              href="/journal"
              className="mt-4 inline-block text-sm font-medium text-[#E8B24A] hover:text-[#F4EFE6]"
            >
              ← Back to the latest episodes
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EpisodeCard key={entry.id} entry={entry} />
            ))}
          </div>

          {/* pagination */}
          <nav
            aria-label="Journal pages"
            className="mt-12 flex items-center justify-between border-t hairline pt-6 text-sm"
          >
            {page > 1 ? (
              <Link
                href={page === 2 ? "/journal" : `/journal?page=${page - 1}`}
                className="font-medium text-[#E8B24A] transition-colors hover:text-[#F4EFE6]"
              >
                ← Newer
              </Link>
            ) : (
              <span className="text-[#8A857A]/50">← Newer</span>
            )}
            <span className="text-xs tracking-wide text-[#8A857A]">Page {page}</span>
            {hasMore ? (
              <Link
                href={`/journal?page=${page + 1}`}
                className="font-medium text-[#E8B24A] transition-colors hover:text-[#F4EFE6]"
              >
                Older →
              </Link>
            ) : (
              <span className="text-[#8A857A]/50">Older →</span>
            )}
          </nav>
          <div className="h-16" />
        </>
      )}
    </div>
  );
}
