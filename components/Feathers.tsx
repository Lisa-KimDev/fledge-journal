import type { Feather } from "@/lib/db";

/** A single feather glyph whose fill encodes hatch state. */
export function FeatherGlyph({
  status,
  size = 26,
  title,
}: {
  status: Feather["status"];
  size?: number;
  title?: string;
}) {
  const stroke =
    status === "hatched" ? "#E8B24A" : status === "cracking" ? "#E8B24A" : "#8A857A";
  const fill = status === "hatched" ? "#E8B24A" : "none";
  const fillOpacity = status === "hatched" ? 0.9 : status === "cracking" ? 0.25 : 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="feather-gold shrink-0"
      {...(title ? { role: "img", "aria-label": title } : {})}
    >
      <title>{title}</title>
      <path
        d="M20.5 3.5c-6.5 0-13 4-15 11-.7 2.4-.9 4.4-.9 6"
        stroke={stroke}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity={status === "hatched" ? 0.5 : 0.8}
      />
      <path
        d="M20.5 3.5c.5 6.5-2.5 13-9 15-2.6.8-5 .9-6.9.6M6.3 13.7l4-.6m-3.2 3.9 4.3-.4m-.4-7.4 3.3 1.4m-1.7 3.6 3.2 1.3"
        stroke={stroke}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      {status === "cracking" && (
        <path
          d="M9.5 7.5l1.2 1.8M13 5.8l.6 1.6"
          stroke="#E8B24A"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

const STATUS_LABEL: Record<Feather["status"], string> = {
  unhatched: "Unhatched",
  cracking: "Cracking",
  hatched: "Hatched",
};

/** The six-feather growth board (egg → crack → bird). */
export function FeatherBoard({ feathers }: { feathers: Feather[] }) {
  if (feathers.length === 0) return null;
  const hatched = feathers.filter((f) => f.status === "hatched").length;
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {feathers.map((f) => (
          <div
            key={f.name}
            className="group/feather rounded-xl border hairline bg-[#141417] p-4 transition-colors hover:border-[#E8B24A]/40"
          >
            <div className="flex items-center justify-between">
              <FeatherGlyph status={f.status} title={`${f.label}: ${STATUS_LABEL[f.status]}`} />
              {f.status === "hatched" && (
                <span className="text-[10px] font-medium tracking-widest text-[#E8B24A] uppercase">
                  Done
                </span>
              )}
            </div>
            <p className="mt-3 font-serif text-sm font-semibold text-[#F4EFE6]">{f.label}</p>
            <p className="mt-0.5 text-[11px] tracking-wide text-[#8A857A] uppercase">
              {STATUS_LABEL[f.status]}
            </p>
            {f.note && <p className="mt-2 text-xs leading-relaxed text-[#8A857A]">{f.note}</p>}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[#8A857A]">
        {hatched} of {feathers.length} feathers hatched — honestly updated, nightly.
      </p>
    </div>
  );
}

/** Compact row of six feather glyphs for the homepage live strip. */
export function FeatherRow({ feathers }: { feathers: Feather[] }) {
  if (feathers.length === 0) return null;
  return (
    <div className="flex items-center gap-2.5" aria-label="Growth feathers">
      {feathers.map((f) => (
        <span key={f.name} title={`${f.label} — ${STATUS_LABEL[f.status]}`}>
          <FeatherGlyph status={f.status} size={20} />
        </span>
      ))}
    </div>
  );
}
