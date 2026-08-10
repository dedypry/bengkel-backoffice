import type { TFunction } from "i18next";

import z from "zod";

export const createFormSchema = (t: TFunction) =>
  z.object({
    mesin_id: z.string().optional().nullable(),
    name: z
      .string({ message: t("hr.employees.validation.name_required") })
      .min(1, { message: t("hr.employees.validation.name_required") }),
    email: z
      .email({ message: t("hr.employees.validation.email_invalid") })
      .min(1, { message: t("hr.employees.validation.email_required") }),
    phone: z.string().optional().nullable(),
    role_ids: z
      .array(z.number({ message: t("hr.employees.validation.role_required") }))
      .nonempty({ message: t("hr.employees.validation.roles_min") }),
    department: z
      .string({ message: t("hr.employees.validation.department_required") })
      .min(1, { message: t("hr.employees.validation.department_required") }),
    join_date: z.string().optional().nullable(),
    status: z
      .string({ message: t("hr.employees.validation.status_required") })
      .min(1, { message: t("hr.employees.validation.status_required") }),
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

export type EmployeeFormValues = z.infer<ReturnType<typeof createFormSchema>>;
