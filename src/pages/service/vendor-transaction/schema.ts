import { z } from "zod";

export const PurchaseVendorSchema = z.object({
  // --- HEADER SECTION ---
  id: z.any().optional(),
  purchaseNo: z.string().min(1, "Purchase number is required"),
  date: z.string().min(1, "Date must be selected"),
  invoiceNo: z.string().optional().nullable(),

  // Payment & Terms
  paymentType: z.enum(["cash", "credit"]),
  paymentMethod: z.string(),
  paymentMethodData: z.any().optional(),
  supplierId: z.number(),
  dueDays: z.number().nonnegative(),
  dueDate: z.string().optional().nullable(),

  // --- ITEMS SECTION (TABLE) ---
  items: z
    .array(
      z.object({
        id: z.number(),
        select: z.boolean(),
        code: z.string(),
        trx_no: z.string(),
        name: z.string(),
        purchasePrice: z.number().optional().nullable(),
        discPercentage: z.number().optional().nullable(),
        discValue: z.number().optional().nullable(),
        total: z.number().min(0),
        taxPercentage: z.number().optional().nullable(),
      }),
    )
    .min(1, "At least one item must be selected"),

  // --- FOOTER / SUMMARY SECTION ---
  notes: z.string().optional().nullable(),
  signatureId: z.number().optional(),

  subTotal: z.number().nonnegative(),
  finalDiscValue: z.number().nonnegative(),
  tax: z.number().min(0),
  otherFees: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

// Type inference for TypeScript
export type IPurchaseVendorForm = z.infer<typeof PurchaseVendorSchema>;
