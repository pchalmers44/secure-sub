import { Prisma } from "@prisma/client";
import { ZodError, type ZodSchema } from "zod";
import type { NextRequest } from "next/server";

import { MissingDatabaseUrlError } from "@/lib/prisma";
import { HttpError } from "@/lib/httpErrors";
import { enforceCsrf } from "@/lib/security/csrf";
import { enforceRateLimit, type RateLimitOptions } from "@/lib/security/rateLimit";
import { jsonError } from "@/utils/api";

export type ApiSecurityOptions = {
  rateLimit?: RateLimitOptions;
  csrf?: boolean;
};

export async function parseJson<T>(
  req: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError("Invalid JSON body.", { status: 400, code: "BAD_JSON" });
  }
  return schema.parse(raw);
}

export function parseQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>,
): T {
  const obj: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) obj[key] = value;
  return schema.parse(obj);
}

export async function handleApi(
  req: NextRequest,
  handler: () => Promise<Response>,
  security?: ApiSecurityOptions,
): Promise<Response> {
  try {
    if (security?.rateLimit) enforceRateLimit(req, security.rateLimit);
    if (security?.csrf) enforceCsrf(req);
    return await handler();
  } catch (error) {
    if (error instanceof HttpError) {
      const res = jsonError(error.message, {
        status: error.status,
        code: error.code,
        details: error.details,
      });
      if (error.retryAfterSeconds) {
        res.headers.set("Retry-After", String(error.retryAfterSeconds));
      }
      return res;
    }

    if (error instanceof ZodError) {
      return jsonError("Invalid request.", {
        status: 400,
        code: "VALIDATION_ERROR",
        details: error.flatten(),
      });
    }

    if (error instanceof MissingDatabaseUrlError) {
      return jsonError("Server misconfigured: DATABASE_URL is missing.", {
        status: 500,
        code: "MISSING_DATABASE_URL",
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return jsonError("Not found.", { status: 404, code: "NOT_FOUND" });
      }
      if (error.code === "P2002") {
        return jsonError("Conflict.", {
          status: 409,
          code: "CONFLICT",
          details: { meta: error.meta },
        });
      }
      return jsonError("Database error.", {
        status: 500,
        code: error.code,
        details: { meta: error.meta },
      });
    }

    return jsonError("Unexpected error.", { status: 500, code: "UNKNOWN" });
  }
}
