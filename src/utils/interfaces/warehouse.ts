import { IRegion } from "./IUser";

export interface IWarehouse {
  id: number;
  company_id?: number;
  code: string;
  name: string;
  description?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  fax?: string;
  npwp?: string;
  province_id?: number;
  city_id?: number;
  district_id?: number;
  zipcode?: string;
  logo_url?: string;
  contact_name?: string;
  contact_phone?: string;
  is_active?: boolean;
  created_id?: number;
  updated_id?: number;
  created_at: string;
  updated_at: string;
  province: IRegion;
  city: IRegion;
  district: IRegion;
}
