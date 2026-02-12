import { IUser } from "./IUser";

export interface IExpenseCategorie {
  id: number;
  name: string;
  color?: string;
  company_id?: number;
}

export interface IExpense {
  id: number;
  expense_code: string;
  title: string;
  amount: number;
  date: string;
  notes?: string;
  status?: string;
  category_id: number;
  company_id?: number;
  attachment_path?: string;
  supplier_id?: number;
  updated_by?: number;
  category?: IExpenseCategorie;
  updated?: IUser;
}
