import type { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fledge.cryptosidao.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/journal`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/rule-zero`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/parents`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/follow`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const { data: entries } = await getAllEntries();
  const entryRoutes: MetadataRoute.Sitemap = entries.map((e) => ({
    url: `${SITE_URL}/journal/${e.slug}`,
    lastModified: e.entry_date ? new Date(`${e.entry_date.slice(0, 10)}T02:00:00Z`) : undefined,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...entryRoutes];
}
