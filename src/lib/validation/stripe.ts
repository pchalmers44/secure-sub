import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  priceId: z.string().trim().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

