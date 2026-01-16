import z from "zod";

const itemSchema = z.object({
  productId: z.string().min(1, "Pilih barang"),
  qtyPo: z.number().min(1, "Qty PO minimal 1"),
  qtyRec: z.number().min(0, "Tidak boleh negatif"),
  condition: z.enum(["Baik", "Rusak", "Kurang"]),
});

export const receiptSchema = z.object({
  poNumber: z.string().min(3, "No. PO minimal 3 karakter"),
  supplierId: z.string().min(1, "Pilih supplier"),
  receiptDate: z.string().min(1, "Tanggal wajib diisi"),
  items: z.array(itemSchema).min(1, "Minimal harus ada 1 barang yang diterima"),
  notes: z.string().optional(),
});

export type ReceiptFormValues = z.infer<typeof receiptSchema>;
