export interface ISupplier {
  id: number;
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
  deleted_at: string | null;
  code: string;
  company_id: number;
  name: string;
  contact_name: string | null;
  phone: string;
  email: string;
  address: string;
  npwp: string | null;
  is_active: boolean;
  updated_by: number | null;
  province_id: number | null;
  city_id: number | null;
  district_id: number | null;
  zipcode: string;
  fax_number: string;
  website: string;
}
