import { mockNextRequest } from "../helpers/mockNextRequest";
import type { NextRequest } from "next/server";

describe("/api/auth/register", () => {
  test("rejects weak password via Zod validation", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    const req = mockNextRequest({
      url: "http://localhost:3000/api/auth/register",
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        host: "localhost:3000",
        "content-type": "application/json",
      },
      jsonBody: { email: "test@example.com", password: "short" },
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
