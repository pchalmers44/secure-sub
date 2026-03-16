import type { NextRequest } from "next/server";

import { forbidden } from "@/lib/httpErrors";

function safeOrigin(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function expectedOrigin(req: NextRequest): string | null {
  const env = safeOrigin(process.env.NEXTAUTH_URL ?? null);
  if (env) return env;
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return null;
  return `${proto}://${host}`;
}

export function enforceCsrf(req: NextRequest) {
  const method = req.method.toUpperCase();
  const unsafe = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
  if (!unsafe) return;

  const origin = safeOrigin(req.headers.get("origin"));
  const referer = safeOrigin(req.headers.get("referer"));
  const secFetchSite = req.headers.get("sec-fetch-site");

  if (secFetchSite === "same-origin") return;

  const expected = expectedOrigin(req);
  const provided = origin ?? referer;

  if (!expected) return;
  if (!provided) {
    throw forbidden("CSRF protection: missing origin.", "CSRF_MISSING_ORIGIN");
  }
  if (provided !== expected) {
    throw forbidden("CSRF protection: origin mismatch.", "CSRF_ORIGIN_MISMATCH", {
      expected,
      provided,
    });
  }
}

