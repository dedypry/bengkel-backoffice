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
    id: z.number().optional(),
    province_id: z.number(),
    city_id: z.number(),
    district_id: z.number(),
    birth_date: z
      .string({ message: "Tanggal Lahir wajib diisi" })
      .min(1, { message: "Tanggal Lahir wajib diisi" }),
    address: z
      .string({ message: "Alamat Wajib diisi" })
      .min(5, "Alamat minimal 5 karakter"),
  }),
  customer_type: z.enum(["personal", "corporate"]),
  nik_ktp: z
    .string()
    .length(16, "NIK harus 16 digit")
    .optional()
    .or(z.literal("")),
  credit_limit: z.string().default("0"),
  notes: z.string().optional(),

  vehicles: z
    .array(
      z.object({
        id: z.number().optional(),
        plate_number: z.string().min(4, "Nopol tidak valid"),
        brand: z.string().min(1, "Merk wajib diisi"),
        model: z.string().min(1, "Tipe wajib diisi"),
        year: z.string().optional(),
        color: z.string().optional(),
        engine_capacity: z.string().optional(), // misal: 1500cc
        transmission_type: z.string().optional(), // CVT, AT, MT
        fuel_type: z.string().optional(), // Bensin, Diesel, Listrik
        vin_number: z.string().optional(), // No. Rangka
        engine_number: z.string().optional(), // No. Mesin
        tire_size: z.string().optional(), // misal: 185/65 R15
      }),
    )
    .min(1, "Minimal harus ada satu kendaraan"),
});
