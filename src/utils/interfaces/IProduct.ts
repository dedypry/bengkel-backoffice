export interface IProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  company_id: number | null;
  updated_by: number | null;
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
  deleted_at: string | null;
  total_product: string;
}
