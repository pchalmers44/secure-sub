import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { handleApi, parseJson } from "@/lib/api/handler";
import { getRequestContext } from "@/lib/requestContext";
import { getPrisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";
import { writeAuditLog } from "@/services/auditLogService";
import { hashPassword } from "@/services/passwordService";

export async function POST(req: NextRequest) {
  return handleApi(
    req,
    async () => {
      const body = await parseJson(req, registerSchema);
      const prisma = getPrisma();
      const passwordHash = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name ?? null,
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
      });

      await writeAuditLog({
        action: "auth.register",
        outcome: "success",
        userId: user.id,
        context: getRequestContext(req),
      });

      return NextResponse.json({ user }, { status: 201 });
    },
    {
      rateLimit: { limit: 5, windowMs: 60_000, keyPrefix: "api:auth:register" },
      csrf: true,
    },
  );
}
