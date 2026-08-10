import { TFunction } from "i18next";
import z from "zod";

export const createFormSchema = (t: TFunction) =>
  z.object({
    name: z
      .string({ message: t("profile.validation.phone_required") })
      .min(1, { message: t("profile.validation.name_required") }),
    email: z
      .email({ message: t("profile.validation.email_invalid") })
      .min(1, { message: t("profile.validation.email_required") }),
    phone: z
      .string({ message: t("profile.validation.phone_required") })
      .min(1, { message: t("profile.validation.phone_required") }),
    photo: z.any().optional(),
    province_id: z
      .number({ message: t("profile.validation.province_required") })
      .min(1, { message: t("profile.validation.province_required") }),
    city_id: z
      .number({ message: t("profile.validation.city_required") })
      .min(1, { message: t("profile.validation.city_required") }),
    district_id: z
      .number({ message: t("profile.validation.district_required") })
      .min(1, { message: t("profile.validation.district_required") }),
    address: z
      .string({ message: t("profile.validation.address_required") })
      .min(1, { message: t("profile.validation.address_required") }),
    gender: z
      .string({ message: t("profile.validation.gender_required") })
      .min(1, { message: t("profile.validation.gender_required") }),
    place_birth: z
      .string({ message: t("profile.validation.birth_place_required") })
      .min(1, { message: t("profile.validation.birth_place_required") }),
    birth_date: z
      .string({ message: t("profile.validation.birth_date_required") })
      .min(1, { message: t("profile.validation.birth_date_required") }),
    emergency_name: z.string().nullable().optional(),
    emergency_contact: z.string().nullable().optional(),
  });

export type FormSchemaValues = z.infer<ReturnType<typeof createFormSchema>>;

export const createChangePasswordSchema = (t: TFunction) =>
  z
    .object({
      old_password: z
        .string()
        .min(1, { message: t("profile.validation.old_password_required") }),
      new_password: z
        .string()
        .min(8, { message: t("profile.validation.new_password_min") })
        .regex(/[A-Z]/, {
          message: t("profile.validation.new_password_uppercase"),
        })
        .regex(/[0-9]/, {
          message: t("profile.validation.new_password_number"),
        }),
      confirm_password: z
        .string()
        .min(1, { message: t("profile.validation.confirm_required") }),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t("profile.validation.confirm_mismatch"),
      path: ["confirm_password"],
    });

export type ChangePasswordType = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
