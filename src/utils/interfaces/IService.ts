export interface IServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export interface IService {
  id: number;
  supplier_id?: number;
  name: string;
  code: string;
  description: string;
  price: string; // Menggunakan string karena di JSON tertulis "50000.00"
  estimated_duration: number;
  difficulty: "easy" | "medium" | "hard"; // Menggunakan union type agar lebih spesifik
  estimated_type: "hours" | "minutes" | "days" | string;
  is_active: boolean;
  category: IServiceCategory;
}

export interface IServiceSettings {
  default_pic_id: number | string | null;

  default_advisor_id: number | string | null;

  notes_service: string;

  notes_sales: string;

  service_reg_prefix: string;
  service_pay_prefix: string;
  job_order_prefix: string;
  sales_order_prefix: string;
  sales_inv_prefix: string;
  sales_ret_prefix: string;
  ar_pay_prefix: string;

  default_warehouse_id: number | null;

  default_km_increment: number;

  pit_count: number;

  default_cash_account_id: number | null;
}
