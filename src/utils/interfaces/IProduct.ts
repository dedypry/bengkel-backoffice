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

export interface IProductImage {
  id: number;
  created_at: string;
  updated_at: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  path: string;
  is_primary: boolean;
}

export interface IProduct {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  code: string;
  company_id: number;
  name: string;
  image: string; // URL gambar utama
  description: string;
  category_id: number;
  supplier_id: number | null;
  purchase_price: string; // Tipe string karena format decimal dari DB
  sell_price: string;
  stock: number;
  min_stock: number;
  unit: string;
  location: string;
  is_active: boolean;
  updated_by: number | null;
  slug: string;
  uom_id: number;
  // Relasi
  category?: IProductCategory;
  uom?: IUom;
  images?: IProductImage[];
}
