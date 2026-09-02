/**
 * lib/markdown.ts — dependency-free Markdown → React renderer.
 *
 * Supports the subset the journal actually uses:
 *   paragraphs · ### headings · bullet lists · numbered lists ·
 *   tables (| a | b |) · blockquotes (> ...) ·
 *   inline **bold** · *italic* · `code` — all HTML-escaped.
 *
 * Returns React nodes, so nothing is injected via dangerouslySetInnerHTML.
 */

import React, { type ReactNode } from "react";

// ---------------------------------------------------------------------------
// inline: **bold**, *italic*, `code` — React escapes all text nodes for us,
// so no manual HTML escaping is needed anywhere in this renderer.
// ---------------------------------------------------------------------------

/** Render inline markdown to an array of React nodes. */
function inline(src: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Bold, italic, and inline code. Code is matched first so `**` inside
  // backticks is left alone.
  const pattern = /(`[^`\n]+`)|(\*\*[^*\n][^*\n]*\*\*)|(\*[^*\n]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(src)) !== null) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const token = m[0];
    const key = `${keyPrefix}-i${i++}`;
    if (token.startsWith("`")) {
      out.push(
        <code key={key} className="rounded bg-[#141417] px-1.5 py-0.5 font-mono text-[0.85em] text-[#E8B24A]">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      out.push(
        <strong key={key} className="font-semibold text-[#F4EFE6]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      out.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + token.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

// ---------------------------------------------------------------------------
// block-level parsing
// ---------------------------------------------------------------------------

const isBullet = (line: string) => /^\s*[-*+]\s+/.test(line);
const isNumbered = (line: string) => /^\s*\d+[.)]\s+/.test(line);
const isTable = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableDivider = (line: string) => /^\s*\|[\s:|-]+\|\s*$/.test(line);

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function renderMarkdown(md: string | null | undefined): ReactNode {
  if (!md) return null;
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // blank
    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code (bonus: fenced blocks appear in the journal occasionally)
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) buf.push(lines[i++]);
      i++; // closing fence
      blocks.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-lg border border-white/10 bg-[#141417] p-4 font-mono text-sm leading-relaxed text-[#F4EFE6]/90"
        >
          {buf.join("\n")}
        </pre>,
      );
      continue;
    }

    // heading (### and deeper; ## / # styled the same, scaled)
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      blocks.push(
        <h3
          key={key++}
          className="mt-10 mb-3 font-serif text-xl font-semibold tracking-tight text-[#F4EFE6] sm:text-2xl"
          {...(level <= 2 ? { "data-h": level } : {})}
        >
          {inline(h[2], `h${key}`)}
        </h3>,
      );
      i++;
      continue;
    }

    // table
    if (isTable(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTable(lines[i])) rows.push(splitRow(lines[i++]));
      blocks.push(
        <div key={key++} className="my-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#141417]">
                {header.map((cell, ci) => (
                  <th
                    key={ci}
                    className="border-b border-white/10 px-4 py-2.5 font-medium text-[#E8B24A]"
                  >
                    {inline(cell, `th${key}-${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="align-top">
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-white/5 px-4 py-2.5 text-[#F4EFE6]/80">
                      {inline(cell, `td${key}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ""));
      blocks.push(
        <blockquote
          key={key++}
          className="my-6 border-l-2 border-[#E8B24A] bg-[#E8B24A]/5 py-3 pr-4 pl-5 text-[#F4EFE6]/85 italic"
        >
          {inline(buf.join(" ").trim(), `bq${key}`)}
        </blockquote>,
      );
      continue;
    }

    // bullet list
    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) items.push(lines[i++].replace(/^\s*[-*+]\s+/, ""));
      blocks.push(
        <ul key={key++} className="my-5 list-disc space-y-2 pl-6 text-[#F4EFE6]/85">
          {items.map((item, ii) => (
            <li key={ii} className="leading-relaxed">
              {inline(item, `ul${key}-${ii}`)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // numbered list
    if (isNumbered(line)) {
      const items: string[] = [];
      while (i < lines.length && isNumbered(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      blocks.push(
        <ol key={key++} className="my-5 list-decimal space-y-2 pl-6 text-[#F4EFE6]/85">
          {items.map((item, ii) => (
            <li key={ii} className="leading-relaxed">
              {inline(item, `ol${key}-${ii}`)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // paragraph (single line — journal markdown uses one line per paragraph)
    blocks.push(
      <p key={key++} className="my-5 leading-[1.85] text-[#F4EFE6]/85">
        {inline(line.trim(), `p${key}`)}
      </p>,
    );
    i++;
  }

  return <>{blocks}</>;
}
