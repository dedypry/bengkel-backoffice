import type { IOrder } from "./IOrder";
import type { IProduct } from "./IProduct";
import type { IPromo } from "./IPromo";
import type { IRole } from "./IRole";

export interface IAddress {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  province: IRegion;
  city: IRegion;
  district: IRegion;
  zip_code: string;
  province_id?: number;
  city_id?: number;
  district_id?: number;
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
  is_ppn?: boolean;
  ppn?: number;
  is_discount_birth_day?: boolean;
  total_discount_birth_day?: number;
  max_discount_birth_day?: number;
  type_discount_birth_day?: string;
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
  work_status: string;
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
  company_id: number;
  rating: number;
  level: number;
  experience: number;
  efficiency: number;
  specialty: string;
  theme: string;
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

export interface IVehicle {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  plate_number: string;
  brand: string;
  model: string;
  year: string; // Tetap string karena di JSON tertulis "2024"
  engine_capacity: string;
  transmission_type: "AT" | "MT" | "CVT"; // Menggunakan union agar lebih aman
  fuel_type: string;
  vin_number: string;
  engine_number: string;
  tire_size: string;
  color: string;
  status: string;
  customers?: ICustomer[];
}
export interface ICustomer {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  phone: string;
  email: string | null;
  code_verify: string | null;
  customer_type: "personal" | "corporate";
  nik_ktp: string | null;
  credit_limit: string | number; // String dari DB (Decimal), bisa di-cast ke number
  notes: string | null;
  company_id: number;
  updated_by: number;
  profile: IProfile;
  total_vehicle: number;
  status: string;
  vehicles?: IVehicle[];
}

export interface IPayment {
  id: number;
  payment_no: string;
  amount: number;
  method?: string;
  payment_date?: string;
  reference_no?: string;
  bank_name?: string;
  proof_image?: string;
  updated_by?: number;
  work_order_id?: number;
  received_amount?: number;
  order_id?: number;
  company_id?: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  order?: IOrder;
  work_order?: IWorkOrder;
  cashier?: IUser;
}

export interface IWorkOrder {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  trx_no: string;
  queue_no: string | null;
  current_km?: number;
  priority: "normal" | "high" | "low"; // Sesuaikan dengan opsi priority Anda
  status: "draft" | "open" | "closed" | "cancel"; // Sesuaikan dengan opsi status Anda
  company_id?: number;
  customer_id?: number;
  vehicle_id?: number;
  supervisor_id?: number | null;
  mechanic_id?: number | null;
  updated_by?: number;
  sparepart_total?: string;
  service_total?: string;
  sub_total?: string;
  grand_total?: string;
  ppn_percent?: string;
  ppn_amount?: string;
  progress?: "queue" | "on_progress" | "ready" | "finish" | "cancel";
  discount_amount?: string;

  // Relasi & Computed Fields
  vehicle: IVehicle;
  customer: ICustomer;
  estimation?: string;
  mechanics?: IUser[];
  spareparts?: IProduct[];
  start_at?: string;
  end_at?: string;
  promo_data?: IPromo[];
  promo_amount?: number;
  payment: IPayment;
  services: {
    type: string;
    name: string;
    estimated: string;
  }[];
}
