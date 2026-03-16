export type HttpErrorOptions = {
  status: number;
  code: string;
  details?: unknown;
  retryAfterSeconds?: number;
};

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  readonly retryAfterSeconds?: number;

  constructor(message: string, options: HttpErrorOptions) {
    super(message);
    this.name = "HttpError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

export function badRequest(message: string, code = "BAD_REQUEST", details?: unknown) {
  return new HttpError(message, { status: 400, code, details });
}

export function forbidden(message: string, code = "FORBIDDEN", details?: unknown) {
  return new HttpError(message, { status: 403, code, details });
}

export function tooManyRequests(
  message: string,
  retryAfterSeconds: number,
  code = "RATE_LIMITED",
  details?: unknown,
) {
  return new HttpError(message, {
    status: 429,
    code,
    details,
    retryAfterSeconds,
  });
}

