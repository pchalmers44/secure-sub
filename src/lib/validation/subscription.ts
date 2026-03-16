import { z } from "zod";

export const createSubscriptionSchema = z.object({
  customerId: z.string().trim().min(1),
  planId: z.string().trim().min(1),
});

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().trim().min(1),
});

export const subscriptionQuerySchema = z.object({
  customerId: z.string().trim().min(1).optional(),
});

