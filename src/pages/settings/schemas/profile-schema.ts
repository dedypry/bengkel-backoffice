import { TFunction } from "i18next";
import z from "zod";

export const createCompanySchema = (t: TFunction) =>
  z
    .object({
      id: z.number().optional(),
      name: z.string().min(1, t("settings.profile.validation.branch_required")),
      logo_url: z.any().optional(),
      email: z.string().email(t("settings.profile.validation.email_invalid")),
      phone_number: z
        .string()
        .min(10, t("settings.profile.validation.phone_min"))
        .regex(/^[0-9]+$/, t("settings.profile.validation.numeric_only")),
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
        message: t("settings.profile.validation.ppn_required"),
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
        message: t("settings.profile.validation.discount_required"),
        path: ["total_discount_birth_day"],
      },
    );

export type CompanyFormValues = z.infer<ReturnType<typeof createCompanySchema>>;
