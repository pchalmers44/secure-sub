import type { Prisma } from "@prisma/client";

import { getPrisma, MissingDatabaseUrlError } from "@/lib/prisma";
import type { RequestContext } from "@/lib/requestContext";
import type { AuditAction, AuditOutcome } from "@/types/audit";

export type AuditLogInput = {
  action: AuditAction;
  outcome: AuditOutcome;
  userId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  context?: RequestContext | null;
  metadata?: Prisma.InputJsonValue;
};

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  try {
    const prisma = getPrisma();
    await prisma.auditLog.create({
      data: {
        action: input.action,
        outcome: input.outcome,
        userId: input.userId ?? null,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        ip: input.context?.ip ?? null,
        userAgent: input.context?.userAgent ?? null,
        metadata: input.metadata ?? undefined,
      },
    });
  } catch (error) {
    if (error instanceof MissingDatabaseUrlError) return;
    // Audit logging should never break the primary request path.
  }
}

