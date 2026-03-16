import { credentialsSchema, registerSchema } from "@/lib/validation/auth";

describe("validation/auth", () => {
  test("registerSchema normalizes email", () => {
    const parsed = registerSchema.parse({
      email: "  TEST@Example.com ",
      password: "password123",
      name: " Pat ",
    });
    expect(parsed.email).toBe("test@example.com");
    expect(parsed.name).toBe("Pat");
  });

  test("credentialsSchema rejects invalid email", () => {
    const res = credentialsSchema.safeParse({ email: "nope", password: "x" });
    expect(res.success).toBe(false);
  });
});

