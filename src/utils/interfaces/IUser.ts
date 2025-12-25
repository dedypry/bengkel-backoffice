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
  user_id: number;
  full_name: string;
  phone_number: string | null;
  address: string | null;
  gender: "male" | "female" | null;
  photo_url: string | null;
  emergency_name: string | null;
  emergency_contact: string | null;
}

export interface IUser {
  id: number;
  created_at: string;
  updated_at: string;
  nik: string | null;
  name: string;
  email: string;
  companies: ICompany[]; // Relasi HasMany / ManyToMany
  position: string | null;
  join_date: string | null;
  is_active: boolean;
  profile: IProfile;
}
