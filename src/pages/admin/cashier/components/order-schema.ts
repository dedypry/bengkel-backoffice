import z from "zod";

export const paymentSchema = z.object({
  discount: z.number().min(0, "Diskon tidak boleh negatif"),
  promoCode: z.string().optional(),
  receivedAmount: z.number().optional(),
  proofImage: z.any().optional(),
  isManualDiscount: z.boolean().optional(),
  paymentMethod: z.enum(["CASH", "TRANSFER"]),
});

export type PaymentForm = z.infer<typeof paymentSchema>;
