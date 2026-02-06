import z from "zod";

export const companySchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "Nama cabang wajib diisi"),
    logo_url: z.any().optional(),
    email: z.string().email("Format email tidak valid"),
    phone_number: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^[0-9]+$/, "Hanya boleh berisi angka"),
    fax: z.string().optional().or(z.literal("")),
    npwp: z.string().optional().or(z.literal("")),
    is_ppn: z.boolean(),
    ppn: z.number().optional(),
    is_discount_birth_day: z.boolean(),
    total_discount_birth_day: z.number().optional(),
    type_discount_birth_day: z.string().optional(),
    max_discount_birth_day: z.number().optional(),
    address: z.object({
      title: z.string().optional(),
      province_id: z.number().optional(),
      city_id: z.number().optional(),
      district_id: z.number().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.is_ppn) {
        return data.ppn !== undefined && data.ppn !== null;
      }

      return true;
    },
    {
      message: "Nilai PPN wajib diisi jika PPN aktif",
      path: ["ppn"],
    },
  )
  .refine(
    (data) => {
      if (data.is_discount_birth_day) {
        return (
          data.total_discount_birth_day !== undefined &&
          data.total_discount_birth_day !== null
        );
      }

      return true;
    },
    {
      message: "Nilai Diskon wajib diisi jika Diskon aktif",
      path: ["total_discount_birth_day"],
    },
  );

export type CompanyFormValues = z.infer<typeof companySchema>;
