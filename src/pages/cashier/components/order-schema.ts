import z from "zod";

export const paymentSchema = z.object({
  signature_id: z.number().optional().nullable(),
  other_fee: z.any().optional().nullable(),
  disc_percentage: z.any().optional().nullable(),
  disc_value: z.any().optional().nullable(),
  po_no: z.string().optional().nullable(),
  customer_id: z.any().optional().nullable(),
  notes: z.any().optional().nullable(),
  total: z.any().optional().nullable(),
  tax: z.any().optional().nullable(),
  sub_total: z.any().optional().nullable(),
  received_amount: z.any().optional().nullable(),
  proof_image: z.any().optional().nullable(),
  payment_method: z.enum(["CASH", "TRANSFER"]),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;
