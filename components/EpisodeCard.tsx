import Link from "next/link";
import type { Entry } from "@/lib/db";
import { formatDate, thumbnailUrl } from "@/lib/db";

function EpLabel({ id }: { id: number }) {
  return (
    <span className="text-[11px] font-semibold tracking-[0.3em] text-[#E8B24A] uppercase">
      EP {id}
    </span>
  );
}

/** Big hero episode card (latest entry). */
export function HeroEpisodeCard({ entry }: { entry: Entry }) {
  const art = thumbnailUrl(entry.thumbnail_path);
  return (
    <article className="group overflow-hidden rounded-2xl border hairline bg-[#141417]">
      <Link href={`/journal/${entry.slug}`} className="block">
        {art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={art}
            alt={`${entry.title} episode art`}
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="eager"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-[#141417]">
            <span className="day-numeral text-7xl font-semibold text-[#E8B24A]/30">{entry.id}</span>
          </div>
        )}
      </Link>
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <EpLabel id={entry.id} />
          <span className="text-xs tracking-wide text-[#8A857A]">{formatDate(entry.entry_date)}</span>
          {entry.mood && (
            <span className="text-xs text-[#8A857A] italic">· {entry.mood}</span>
          )}
        </div>
        <h2 className="mt-3 font-serif text-2xl leading-tight font-semibold text-[#F4EFE6] sm:text-3xl">
          <Link href={`/journal/${entry.slug}`} className="gold-underline decoration-[#E8B24A] hover:text-[#E8B24A]">
            {entry.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-2 max-w-2xl leading-relaxed text-[#8A857A]">
          {entry.summary}
        </p>
        <Link
          href={`/journal/${entry.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#E8B24A] transition-colors hover:text-[#F4EFE6]"
        >
          Read the entry
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/** Standard episode card for grids/feeds. */
export function EpisodeCard({ entry }: { entry: Entry }) {
  const art = thumbnailUrl(entry.thumbnail_path);
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border hairline bg-[#141417] transition-colors hover:border-[#E8B24A]/40">
      <Link href={`/journal/${entry.slug}`} className="block overflow-hidden">
        {art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={art}
            alt={`${entry.title} episode art`}
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-[#0B0B0D]">
            <span className="day-numeral text-5xl font-semibold text-[#E8B24A]/25">{entry.id}</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <EpLabel id={entry.id} />
          <span className="text-[11px] tracking-wide text-[#8A857A]">{formatDate(entry.entry_date)}</span>
        </div>
        <h3 className="mt-2.5 font-serif text-lg leading-snug font-semibold text-[#F4EFE6]">
          <Link href={`/journal/${entry.slug}`} className="hover:text-[#E8B24A]">
            {entry.title}
          </Link>
        </h3>
        {entry.summary && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#8A857A]">{entry.summary}</p>
        )}
        <div className="mt-auto pt-4">
          <Link
            href={`/journal/${entry.slug}`}
            className="text-[13px] font-medium text-[#E8B24A] transition-colors hover:text-[#F4EFE6]"
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
