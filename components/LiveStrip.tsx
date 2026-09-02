import { FeatherRow } from "@/components/Feathers";
import type { Feather, Meta } from "@/lib/db";

/** Homepage live strip: day counter · feather row · cadence. */
export function LiveStrip({ meta, feathers }: { meta: Meta; feathers: Feather[] }) {
  const lastDay = Number(meta.last_entry_day ?? 0);
  return (
    <section
      aria-label="Fledge status"
      className="flex flex-col items-start gap-4 rounded-xl border hairline bg-[#141417] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="live-dot" aria-hidden="true" />
        <span className="text-sm text-[#8A857A]">
          Day{" "}
          {lastDay > 0 ? (
            <span className="day-numeral font-serif text-xl font-semibold text-[#F4EFE6]">
              {lastDay}
            </span>
          ) : (
            <span className="font-serif text-xl font-semibold text-[#F4EFE6]">—</span>
          )}{" "}
          of the flight
        </span>
      </div>
      <FeatherRow feathers={feathers} />
      <p className="text-xs tracking-wide text-[#8A857A]">Updates nightly · 02:00 UTC</p>
    </section>
  );
}

/** Shared honest error state. */
export function JournalUnreachable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-xl border hairline bg-[#141417] px-6 py-10 text-center">
      <p className="font-serif text-lg text-[#F4EFE6]">Journal unreachable</p>
      <p className={`mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#8A857A] ${compact ? "" : "mb-2"}`}>
        The incubator log didn&apos;t answer. Nothing is lost — the journal is
        written on disk first and synced here. Try again in a few minutes.
      </p>
    </div>
  );
}
