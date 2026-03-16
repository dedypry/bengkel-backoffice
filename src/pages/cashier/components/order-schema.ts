import z from "zod";

export const paymentSchema = z.object({
  otherFee: z.number().min(0, "Diskon tidak boleh negatif"),
  discount: z.number().min(0, "Diskon tidak boleh negatif"),
  promoCode: z.string().optional(),
  receivedAmount: z.number().optional(),
  proofImage: z.any().optional(),
  poNo: z.string().optional().nullable(),
  customerId: z.number().optional().nullable(),
  total: z.number().optional().nullable(),
  tax: z.number().optional().nullable(),
  subTotal: z.number().optional().nullable(),
  isManualDiscount: z.boolean().optional(),
  paymentMethod: z.enum(["CASH", "TRANSFER"]),
});

export type PaymentForm = z.infer<typeof paymentSchema>;
