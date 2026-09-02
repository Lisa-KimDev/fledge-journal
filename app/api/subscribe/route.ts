import { NextResponse } from "next/server";

export const revalidate = 0;

/**
 * POST /api/subscribe — relay an email capture to the Lisa Mail API,
 * which subscribes it to the Fledge Journal list in Listmonk.
 *
 * Env:
 *   MAIL_API_URL    base URL of the mail API, e.g. https://db.cryptosidao.org/mail-api
 *   FOLLOW_LIST_ID  Listmonk list id for this site's followers
 */

// naive in-memory rate limit: 5 requests per IP per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "That email doesn't look right." },
      { status: 400 },
    );
  }

  const base = process.env.MAIL_API_URL;
  const listId = process.env.FOLLOW_LIST_ID || "8";
  if (!base) {
    return NextResponse.json(
      { ok: false, error: "Subscriptions are not configured yet. Try RSS for now." },
      { status: 503 },
    );
  }

  const endpoint = `${base.replace(/\/+$/, "")}/api/lists/${listId}/subscribers`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: "" }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // Log nothing about internals; return a clean error.
    return NextResponse.json(
      { ok: false, error: "The mailing service didn't accept that. Try again shortly." },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "The mailing service is unreachable. Try again shortly." },
      { status: 504 },
    );
  }
}
