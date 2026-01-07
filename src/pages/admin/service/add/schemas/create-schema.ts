import { z } from "zod";

export const ServiceRegistrationSchema = z.object({
  customer: z.object({
    id: z.number().optional(),
    name: z
      .string({ message: "Nama Pelanggan Wajib diisi" })
      .min(3, "Nama pelanggan minimal 3 karakter"),
    phone: z
      .string({ message: "Nomor telepon Wajib diisi" })
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
    email: z
      .string()
      .email("Format email tidak valid")
      .optional()
      .or(z.literal("")),
    birth_date: z
      .string({ message: "Tanggal Lahir wajib diisi" })
      .min(1, { message: "Tanggal Lahir wajib diisi" }),
  }),
  vehicles: z.object({
    id: z.number().optional(),
    plate_number: z
      .string({ message: "Nopol wajib diisi" })
      .min(4, "Nopol tidak valid"),
    brand: z.string({ message: "Merk wajib diisi" }).min(1, "Merk wajib diisi"),
    model: z.string({ message: "Tipe wajib diisi" }).min(1, "Tipe wajib diisi"),
    year: z.string().optional(),
    color: z.string({ message: "Merk wajib diisi" }).optional(),
    engine_capacity: z.string().optional(), // misal: 1500cc
    transmission_type: z.string().optional(), // CVT, AT, MT
    fuel_type: z.string().optional(), // Bensin, Diesel, Listrik
    vin_number: z.string().optional(), // No. Rangka
    engine_number: z.string().optional(), // No. Mesin
    tire_size: z.string().optional(), // misal: 185/65 R15
  }),
  current_km: z.coerce
    .number({ message: "Kilometer tidak boleh negatif" })
    .min(0, "Kilometer tidak boleh negatif"),
  complaints: z.string().optional().default(""),
  mechanic_id: z.number().optional(),
  priority: z.string(),
});

export type TServiceRegistration = z.infer<typeof ServiceRegistrationSchema>;
