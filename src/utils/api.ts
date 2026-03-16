import { NextResponse } from "next/server";

export type ApiErrorBody = {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export function jsonError(
  message: string,
  options?: { status?: number; code?: string; details?: unknown },
) {
  return NextResponse.json(
    {
      error: {
        message,
        code: options?.code,
        details: options?.details,
      },
    } satisfies ApiErrorBody,
    { status: options?.status ?? 400 },
  );
}

