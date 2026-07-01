import z from "zod";

export const operationsSchema = z.object({
  service_reg_prefix: z.string().optional(),
  service_pay_prefix: z.string().optional(),
  job_order_prefix: z.string().optional(),
  sales_order_prefix: z.string().optional(),
  sales_inv_prefix: z.string().optional(),
  sales_ret_prefix: z.string().optional(),
  ar_pay_prefix: z.string().optional(),
  default_km_increment: z.number().min(0).optional(),
  default_cash_account_id: z.number().optional().nullable(),
  default_warehouse_id: z.number().optional().nullable(),
  pit_count: z.number().min(0).optional().nullable(),
  default_pic_id: z.number().optional().nullable(),
  default_advisor_id: z.number().optional().nullable(),
  mechanic_roles: z.array(z.string()).optional(),
  notes_service: z.string().optional(),
  notes_sales: z.string().optional(),
  next_service_notes: z.array(z.string()).optional(),
});

export type OperationsFormValues = z.infer<typeof operationsSchema>;

export const operationsDefaults: OperationsFormValues = {
  service_reg_prefix: "PKB.",
  service_pay_prefix: "SRV.",
  job_order_prefix: "OPL.",
  sales_order_prefix: "SO.",
  sales_inv_prefix: "SI.",
  sales_ret_prefix: "SR.",
  ar_pay_prefix: "AR.",
  default_km_increment: 7000,
  default_cash_account_id: null,
  default_warehouse_id: null,
  pit_count: 10,
  default_pic_id: null,
  default_advisor_id: null,
  mechanic_roles: [],
  notes_service: "",
  notes_sales: "",
  next_service_notes: [],
};
