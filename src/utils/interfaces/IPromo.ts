export interface IPromo {
  id: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  code: string;
  name: string;
  type: "percentage" | "fixed";
  /** * value, max_discount, dan min_purchase datang sebagai string 
   * dari database (biasanya tipe Decimal/Numeric) 
   */
  value: string; 
  max_discount: string;
  min_purchase: string;
  company_id: number;
  start_date: string; // ISO Date string
  end_date: string;   // ISO Date string
  quota: number;
  used_count: number;
  is_active: boolean;
  description: string;
}