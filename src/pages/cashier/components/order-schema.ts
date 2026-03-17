import z from "zod";

export const paymentSchema = z.object({
  signature_id: z.number().optional().nullable(),
  other_fee: z.number().optional().nullable(),
  disc_percentage: z.number().optional().nullable(),
  disc_value: z.number().optional().nullable(),
  po_no: z.string().optional().nullable(),
  customer_id: z.any().optional().nullable(),
  notes: z.any().optional().nullable(),
  total: z.number().optional().nullable(),
  tax: z.number().optional().nullable(),
  sub_total: z.number().optional().nullable(),
  received_amount: z.number().optional().nullable(),
  proof_image: z.any().optional().nullable(),
  payment_method: z.enum(["CASH", "TRANSFER"]),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;
