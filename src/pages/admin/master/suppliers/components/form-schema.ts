import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(3, "Nama supplier minimal 3 karakter"),
  code: z.string().min(2, "Kode wajib diisi"),
  email: z.string().email("Format email tidak valid").or(z.literal("")),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit").or(z.literal("")),
  address: z.string().optional(),
  npwp: z.string().optional(),
  website: z.string().url("Format URL tidak valid").or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
