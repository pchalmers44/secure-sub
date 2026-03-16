export type MockNextRequestInit = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  jsonBody?: unknown;
  textBody?: string;
};

export function mockNextRequest(init: MockNextRequestInit) {
  const headers = new Headers(init.headers);
  const nextUrl = new URL(init.url);

  return {
    method: init.method,
    headers,
    nextUrl,
    async json() {
      return init.jsonBody;
    },
    async text() {
      return init.textBody ?? "";
    },
  } as unknown;
}

