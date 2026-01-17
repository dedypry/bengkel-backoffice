import z from "zod";

const itemSchema = z.object({
  productId: z
    .number({ message: "Product Tidak boleh Kosong" })
    .min(1, "Pilih barang"),
  qtyPo: z.number({ message: "Tidak boleh Kosong" }).min(1, "Qty PO minimal 1"),
  qtyRec: z
    .number({ message: "Tidak boleh Kosong" })
    .min(0, "Tidak boleh Kosong"),
  purchasePrice: z
    .number({ message: "Tidak boleh Kosong" })
    .min(0, "Tidak boleh Kosong"),
  condition: z.enum(["Baik", "Rusak", "Kurang"]),
});

export const receiptSchema = z.object({
  poNumber: z.string().min(3, "No. PO minimal 3 karakter"),
  supplierId: z
    .number({ message: "Tidak boleh Kosong" })
    .min(1, "Pilih supplier"),
  receiptDate: z
    .string({ message: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  items: z.array(itemSchema).min(1, "Minimal harus ada 1 barang yang diterima"),
  notes: z.string().optional(),
  suratJalanNumber: z.string().optional(),
  policeNumber: z.string().optional(),
  expedition: z.string().optional(),
});

export type ReceiptFormValues = z.infer<typeof receiptSchema>;
