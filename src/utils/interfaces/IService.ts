export interface IServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export interface IService {
  id: number;
  name: string;
  code: string;
  description: string;
  price: string; // Menggunakan string karena di JSON tertulis "50000.00"
  estimated_duration: number;
  difficulty: "easy" | "medium" | "hard"; // Menggunakan union type agar lebih spesifik
  estimated_type: "hours" | "minutes" | "days" | string;
  is_active: boolean;
  category: IServiceCategory;
}
