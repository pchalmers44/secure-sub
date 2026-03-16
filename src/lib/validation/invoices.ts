import { z } from "zod";

export const invoicesQuerySchema = z.object({
  subscriptionId: z.string().trim().min(1).optional(),
  customerId: z.string().trim().min(1).optional(),
});

