import * as z from "zod";

export const customerSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ message: "Nama Pelanggan Wajib diisi" })
    .min(3, "Nama pelanggan minimal 3 karakter"),
  phone: z
    .string({ message: "Nomor telepon Wajib diisi" })
    .min(10, "Nomor telepon minimal 10 digit"),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  profile: z.object({
    id: z.number().optional().nullable(),
    province_id: z.number().optional().nullable(),
    city_id: z.number().optional().nullable(),
    district_id: z.number().optional().nullable(),
    birth_date: z.string().optional().nullable(),
    address: z.string({ message: "Alamat Wajib diisi" }).optional().nullable(),
  }),
  customer_type: z.enum(["personal", "corporate"]),
  nik_ktp: z
    .string()
    .length(16, "NIK harus 16 digit")
    .optional()
    .nullable()
    .or(z.literal("")),
  credit_limit: z.string().optional().nullable().default("0"),
  notes: z.string().optional().nullable(),

  vehicles: z
    .array(
      z.object({
        id: z.number().optional().nullable(),
        plate_number: z.string().min(4, "Nopol tidak valid"),
        brand: z.string().min(1, "Merk wajib diisi"),
        model: z.string().min(1, "Tipe wajib diisi"),
        year: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        engine_capacity: z.string().optional(), // misal: 1500cc
        transmission_type: z.string().optional().nullable(), // CVT, AT, MT
        fuel_type: z.string().optional().nullable(), // Bensin, Diesel, Listrik
        vin_number: z.string().optional().nullable(), // No. Rangka
        engine_number: z.string().optional().nullable(), // No. Mesin
        tire_size: z.string().optional().nullable(), // misal: 185/65 R15
      }),
    )
    .optional(),
});
