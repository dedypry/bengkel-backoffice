import z from "zod";

export const formSchema = z.object({
  name: z
    .string({ message: "Nomor telepon wajib diisi." })
    .min(1, { message: "Nama wajib diisi." }),
  email: z
    .email({ message: "Format email tidak valid." })
    .min(1, { message: "Email wajib diisi." }),
  phone: z
    .string({ message: "Nomor telepon wajib diisi." })
    .min(1, { message: "Nomor telepon wajib diisi." }),
  photo: z.any().optional(),
  province_id: z
    .number({ message: "Provinsi wajib diisi" })
    .min(1, { message: "Provinsi wajib diisi" }),
  city_id: z
    .number({ message: "Kota wajib diisi" })
    .min(1, { message: "Kota wajib diisi" }),
  district_id: z
    .number({ message: "Kecamatan wajib diisi" })
    .min(1, { message: "Kecamatan wajib diisi" }),
  address: z
    .string({ message: "Alamat wajib diisi" })
    .min(1, { message: "Alamat wajib diisi" }),
  gender: z
    .string({ message: "Jenis Kelamin wajib diisi" })
    .min(1, { message: "Jenis Kelamin wajib diisi" }),
  place_birth: z
    .string({ message: "Tempat Lahir wajib diisi" })
    .min(1, { message: "Tempat Lahir wajib diisi" }),
  birth_date: z
    .string({ message: "Tanggal Lahir wajib diisi" })
    .min(1, { message: "Tanggal Lahir wajib diisi" }),
  emergency_name: z.string().nullable().optional(),
  emergency_contact: z.string().nullable().optional(),
});
