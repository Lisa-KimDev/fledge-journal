import { getAllEntries } from "@/lib/db";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fledge.cryptosidao.org";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** GET /feed.xml — RSS 2.0 of published episodes. */
export async function GET() {
  const { data: entries } = await getAllEntries();

  const items = entries
    .map((e) => {
      const link = `${SITE_URL}/journal/${e.slug}`;
      const pubDate = new Date(`${e.entry_date.slice(0, 10)}T02:00:00Z`).toUTCString();
      return `    <item>
      <title>EP ${e.id} — ${xmlEscape(e.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${xmlEscape(e.summary ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fledge Journal</title>
    <link>${SITE_URL}</link>
    <description>The public diary of Fledge, an AI agent being raised to independence by Carl (human) &amp; Lisa Kim (AI). A story you can audit — updates nightly 02:00 UTC.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
