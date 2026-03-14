import { IService } from "./IService";
import { ISupplier } from "./ISupplier";
import { IWOItems } from "./IUser";

export interface IVendorTransaction {
  id: number;
  code: string;
  name: string;
  total_item: string;
}

export interface IVendorTrxDetail {
  id?: string;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  purchase_no: string;
  invoice_no: string;

  payment_type: "cash" | "credit";
  payment_method: string;
  due_days: number;
  due_date: string;

  signature_id: number | null;
  company_id: number;
  supplier_id: number;

  status: "pending" | "completed" | "cancelled";
  tax: number;
  discount: string | number;
  other_fees: string | number;
  subtotal: string | number;
  total: string | number;
  supplier: ISupplier;
  items: IWOItems<IService>[];
}

export interface IVendorPayment {
  id: number;
  purchase_no?: string;
  invoice_no?: string;
  payment_type?: string;
  payment_method?: string;
  due_days?: number;
  due_date?: string;
  signature_id?: number;
  tax?: number;
  discount?: number;
  other_fees?: number;
  subtotal?: number;
  total?: number;
  status?: string;
  company_id?: number;
  supplier_id?: number;
  total_item?: string;
  supplier: ISupplier;
  created_at?: string;
}
