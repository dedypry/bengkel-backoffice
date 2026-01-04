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
  }),
  vehicles: z.object({
    id: z.number().optional(),
    plate_number: z.string().min(4, "Nopol tidak valid"),
    brand: z.string().min(1, "Merk wajib diisi"),
    model: z.string().min(1, "Tipe wajib diisi"),
    year: z.string().optional(),
    engine_capacity: z.string().optional(), // misal: 1500cc
    transmission_type: z.string().optional(), // CVT, AT, MT
    fuel_type: z.string().optional(), // Bensin, Diesel, Listrik
    vin_number: z.string().optional(), // No. Rangka
    engine_number: z.string().optional(), // No. Mesin
    tire_size: z.string().optional(), // misal: 185/65 R15
  }),
  current_km: z.coerce.number().min(0, "Kilometer tidak boleh negatif"),
  service_types: z.array(z.string()).min(1, "Pilih minimal satu jenis layanan"),
  complaints: z.string().optional().default(""),
  mechanic_id: z.number().optional(),
});

export type TServiceRegistration = z.infer<typeof ServiceRegistrationSchema>;
