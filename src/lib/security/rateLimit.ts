import type { NextRequest } from "next/server";

import { tooManyRequests } from "@/lib/httpErrors";

export type RateLimitOptions = {
  limit: number;
  windowMs: number;
  keyPrefix?: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

export function enforceRateLimit(req: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  cleanup(now);

  const ip = getClientIp(req);
  const key = `${options.keyPrefix ?? req.nextUrl.pathname}:${ip}`;

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  existing.count += 1;
  if (existing.count > options.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000),
    );
    throw tooManyRequests(
      "Too many requests. Please try again later.",
      retryAfterSeconds,
    );
  }
}
