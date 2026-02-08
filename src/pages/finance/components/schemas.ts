import { z } from "zod";

export const ExpenseSchema = z.object({
  title: z.string().min(3, "Deskripsi minimal 3 karakter"),
  category_id: z.string().min(1, "Pilih kategori"),
  amount: z.number().min(1, "Nominal harus lebih dari 0"),
  date: z.string().min(1, "Pilih tanggal transaksi"),
  supplier_id: z.string().optional(),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof ExpenseSchema>;
