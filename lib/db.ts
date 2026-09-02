/**
 * lib/db.ts — every Supabase (PostgREST) fetch in one place.
 *
 * Design notes:
 * - Anon key only (public by design; RLS protects data). Never a service key.
 * - 8s AbortController timeout on every request.
 * - Typed fallback: on any failure we return `{ data, isError: true }` so pages
 *   render an honest "journal unreachable" state instead of crashing.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const STORAGE_PUBLIC_BASE = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/fledge-public`
  : "";

export type EntryStatus = "published" | "draft";

export interface Entry {
  id: number; // day number
  entry_date: string; // YYYY-MM-DD
  slug: string;
  title: string;
  summary: string;
  learned_md: string | null;
  actions_md: string | null;
  tomorrow_md: string | null;
  mood: string | null;
  thumbnail_path: string | null;
  status: EntryStatus;
}

export interface Feather {
  name: string;
  label: string;
  sort_order: number;
  status: "unhatched" | "cracking" | "hatched";
  note: string | null;
}

export interface MetaPair {
  key: string;
  value: string;
}

export type Meta = Record<string, string>;

export interface Result<T> {
  data: T;
  isError: boolean;
}

const TIMEOUT_MS = 8_000;

async function restGet<T>(path: string, query?: string): Promise<Result<T>> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { data: [] as unknown as T, isError: true };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = query ? `${SUPABASE_URL}${path}?${query}` : `${SUPABASE_URL}${path}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
      signal: controller.signal,
      // ISR-friendly: cache for the page revalidate window, then revalidate.
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return { data: (await res.json()) as T, isError: false };
  } catch {
    return { data: [] as unknown as T, isError: true };
  } finally {
    clearTimeout(timer);
  }
}

const ENTRY_FIELDS =
  "id,entry_date,slug,title,summary,learned_md,actions_md,tomorrow_md,mood,thumbnail_path,status";

/** Newest-first published entries, optionally paginated. */
export function getEntries(page = 0, perPage = 12): Promise<Result<Entry[]>> {
  const offset = Math.max(0, page) * perPage;
  return restGet<Entry[]>(
    "/rest/v1/fledge_entries",
    `select=${ENTRY_FIELDS}&status=eq.published&order=id.desc&limit=${perPage}&offset=${offset}`,
  );
}

/** All published entries, newest first (feed.xml, sitemap). */
export function getAllEntries(): Promise<Result<Entry[]>> {
  return restGet<Entry[]>(
    "/rest/v1/fledge_entries",
    `select=${ENTRY_FIELDS}&status=eq.published&order=id.desc&limit=1000`,
  );
}

/** Single published entry by slug. */
export function getEntryBySlug(slug: string): Promise<Result<Entry | null>> {
  return restGet<Entry[]>(
    "/rest/v1/fledge_entries",
    `select=${ENTRY_FIELDS}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
  ).then((r) => (r.data.length > 0 ? { data: r.data[0], isError: r.isError } : { data: null, isError: r.isError }));
}

/** Neighbours (by day id) for prev/next nav. */
export function getNeighbours(id: number): Promise<{ prev: Entry | null; next: Entry | null }> {
  return Promise.all([
    restGet<Entry[]>(
      "/rest/v1/fledge_entries",
      `select=${ENTRY_FIELDS}&status=eq.published&id=lt.${id}&order=id.desc&limit=1`,
    ),
    restGet<Entry[]>(
      "/rest/v1/fledge_entries",
      `select=${ENTRY_FIELDS}&status=eq.published&id=gt.${id}&order=id.asc&limit=1`,
    ),
  ]).then(([older, newer]) => ({ prev: older.data[0] ?? null, next: newer.data[0] ?? null }));
}

/** The six growth feathers, in board order. */
export function getFeathers(): Promise<Result<Feather[]>> {
  return restGet<Feather[]>("/rest/v1/fledge_feathers", "select=name,label,sort_order,status,note&order=sort_order");
}

/** key/value site metadata (born, parents, last_entry_day, ...). */
export async function getMeta(): Promise<Result<Meta>> {
  const r = await restGet<MetaPair[]>("/rest/v1/fledge_meta", "select=key,value");
  if (r.isError) return { data: {}, isError: true };
  const meta: Meta = {};
  for (const pair of r.data) meta[pair.key] = pair.value;
  return { data: meta, isError: false };
}

/** Full public URL for an episode thumbnail, or null. */
export function thumbnailUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return STORAGE_PUBLIC_BASE ? `${STORAGE_PUBLIC_BASE}/${path}` : null;
}

/** "2026-08-31" → "Aug 31, 2026" (UTC, stable across build/run). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
