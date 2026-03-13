import { z } from "zod";

export const PurchaseVendorSchema = z.object({
  // --- HEADER SECTION ---
  purchaseNo: z.string().min(1, "Purchase number is required"),
  date: z.string().min(1, "Date must be selected"),
  invoiceNo: z.string().optional().nullable(),

  // Payment & Terms
  paymentType: z.enum(["cash", "credit"]),
  dueDays: z.number().nonnegative(),
  dueDate: z.string().optional().nullable(),

  // --- ITEMS SECTION (TABLE) ---
  items: z
    .array(
      z.object({
        id: z.number(),
        pkbNo: z.string(),
        serviceCode: z.string(),
        serviceName: z.string(),
        purchasePrice: z.number().min(0),
        qty: z.number().min(1),
        amount: z.number().min(0), // Result of purchasePrice * qty
      }),
    )
    .min(1, "At least one item must be selected"),

  // --- FOOTER / SUMMARY SECTION ---
  notes: z.string().optional().nullable(),
  signature: z.string().min(1, "Signature name is required"),

  subTotal: z.number().nonnegative(),
  finalDiscPercent: z.number().min(0).max(100),
  finalDiscValue: z.number().nonnegative(),
  taxPercent: z.number().min(0).max(100),
  otherFees: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

// Type inference for TypeScript
export type IPurchaseVendorForm = z.infer<typeof PurchaseVendorSchema>;
