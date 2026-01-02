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

export interface IUom {
  id?: number; // Opsional saat create, ada saat read
  code: string; // 'pcs', 'ltr', 'set', dll
  name: string; // 'Pieces', 'Liter', 'Set', dll
  description: string | null;
  created_at?: string; // ISO Date String
  updated_at?: string; // ISO Date String
}
