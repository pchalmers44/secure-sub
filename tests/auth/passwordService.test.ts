import { hashPassword, verifyPassword } from "@/services/passwordService";

describe("passwordService", () => {
  test("hashPassword + verifyPassword work", async () => {
    const hash = await hashPassword("password123");
    expect(typeof hash).toBe("string");
    expect(hash).not.toBe("password123");
    await expect(verifyPassword("password123", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong", hash)).resolves.toBe(false);
  });
});

