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
  supplier: ISupplier;
  purchase_no: string;
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
