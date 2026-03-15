import z from "zod";

export const formSchema = z.object({
  name: z
    .string({ message: "Nomor telepon wajib diisi." })
    .min(1, { message: "Nama wajib diisi." }),
  email: z
    .email({ message: "Format email tidak valid." })
    .min(1, { message: "Email wajib diisi." }),
  phone: z.string().optional().nullable(),
  role_ids: z
    .array(z.number({ message: "Jabatan wajib diisi." }))
    .nonempty({ message: "Pilih minimal satu jabatan." }),
  department: z
    .string({ message: "Departemen wajib diisi." })
    .min(1, { message: "Departemen wajib diisi." }),
  join_date: z.string().optional().nullable(),
  status: z
    .string({ message: "Status wajib dipilih" })
    .min(1, { message: "Status wajib dipilih." }),
  photo: z.any().optional(),
  province_id: z.number().optional().nullable(),
  city_id: z.number().optional().nullable(),
  district_id: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  place_birth: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  emergency_name: z.string().nullable().optional().nullable(),
  emergency_contact: z.string().nullable().optional().nullable(),
});
