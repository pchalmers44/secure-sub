import type { NextRequest } from "next/server";

export type RequestContext = {
  ip: string | null;
  userAgent: string | null;
};

type HeaderLike =
  | Headers
  | Pick<Headers, "get">
  | Record<string, string | string[] | undefined>;

function headerGet(headers: HeaderLike, name: string): string | null {
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name);
  }
  const record = headers as Record<string, string | string[] | undefined>;
  const key = Object.keys(record).find((k) => k.toLowerCase() === name.toLowerCase());
  const v = key ? record[key] : undefined;
  if (!v) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

export function getRequestContext(req: Pick<NextRequest, "headers">): RequestContext {
  const xff = req.headers.get("x-forwarded-for");
  const ip = xff ? xff.split(",")[0]?.trim() || null : null;
  const userAgent = req.headers.get("user-agent");
  return { ip, userAgent };
}

export function getRequestContextFromHeaders(headers: HeaderLike): RequestContext {
  const xff = headerGet(headers, "x-forwarded-for");
  const ip = xff ? xff.split(",")[0]?.trim() || null : null;
  const userAgent = headerGet(headers, "user-agent");
  return { ip, userAgent };
}
