import type { IRole } from "./IRole";

export interface IAddress {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  province: string;
  city: string;
  district: string;
  zip_code: string;
}

export interface ICompany {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  email: string | null;
  phone_number: string | null;
  fax: string | null;
  npwp: string | null;
  address: IAddress; // Relasi HasOne
}

export interface IProfile {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  full_name: string;
  phone_number: string;
  address: string;
  gender: "male" | "female" | string;
  photo_url: string;
  emergency_name: string;
  emergency_contact: string;
  join_date: string;
  province_id: number;
  city_id: number;
  district_id: number;
  birth_date: string;
  place_birth: string;
  province: IRegion;
  city: IRegion;
  district: IRegion;
}
export interface IRegion {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  created_at: string;
  updated_at: string;
  nik: string;
  name: string;
  email: string;
  position: string | null;
  is_active: boolean;
  type: "employed" | "owner" | string; // Gunakan union type jika opsinya terbatas
  department: string;
  status: "Permanent" | "Contract" | "Probation" | string;
  companies: ICompany[]; // Relasi HasMany / ManyToMany
  profile?: IProfile;
  roles: IRole[];
}

export interface IUserForm {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  department: string;
  join_date: string; // ISO Date String
  status: "Permanent" | "Contract" | "Probation" | string;
  province_id: number;
  city_id: number;
  district_id: number;
  address: string;
  gender: "male" | "female";
  place_birth: string;
  birth_date: string; // ISO Date String
  emergency_name: string;
  emergency_contact: string;
}
