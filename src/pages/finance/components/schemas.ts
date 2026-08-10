import { TFunction } from "i18next";
import { z } from "zod";

export const createExpenseSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(3, t("finance.expenses.validation.title_min")),
    category_id: z
      .string()
      .min(1, t("finance.expenses.validation.category_required")),
    amount: z.number().min(1, t("finance.expenses.validation.amount_min")),
    date: z.string().min(1, t("finance.expenses.validation.date_required")),
    supplier_id: z.string().optional(),
    notes: z.string().optional(),
    attachment_path: z.any().optional(),
  });

export type ExpenseFormValues = z.infer<ReturnType<typeof createExpenseSchema>>;
