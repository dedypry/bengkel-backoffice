export interface IProvince {
  id: number;
  created_at: string; // Menggunakan string karena format ISO Date
  updated_at: string;
  name: string;
}

export interface ICity {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  province_id: number;
  province: IProvince;
}

export interface IDistrict {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  city_id: number;
  city: ICity;
}
