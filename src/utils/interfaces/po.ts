import { IProduct } from "./IProduct";
import { ISupplier } from "./ISupplier";
import { IUser } from "./IUser";
import { IWarehouse } from "./warehouse";

export interface IPo {
  id: number;
  company_id?: number;
  po_no: string;
  supplier_id?: number;
  warehouse_id?: number;
  date?: string;
  sub_total?: number;
  other_fee?: number;
  disc_value?: number;
  tax?: number;
  disc_percentage?: number;
  total?: number;
  term_credit: number;
  dp: number;
  payment_method: string;
  status: string;
  notes?: string;
  signature_id?: number;
  created_id?: number;
  requested_date?: string;
  created_at: string;
  supplier?: ISupplier;
  warehouse?: IWarehouse;
  items: IPoItem[];
  signature: IUser;
  created_by: IUser;
  closed_notes?: string;
}

export interface IPoItem {
  id: number;
  po_id?: number;
  product_id?: number;
  qty?: number;
  price?: number;
  total?: number;
  disc_percentage?: number;
  disc_value?: number;
  ppn_percentage?: number;
  received_qty?: number;
  received_total?: number;
  created_at?: string;
  product?: IProduct;
}
