import type { IProduct } from "./IProduct";

import { ICustomer } from "./IUser";

export interface IOrder {
  id: number;
  trx_no?: string;
  ppn?: number;
  grand_total?: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  items: IOrderItem[];
  customer: ICustomer;
  company_id?: number;
  updated_id?: number;
  customer_id?: number;
  po_no?: string;
  other_fee?: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
  notes?: string;
}

export interface IOrderItem {
  id: number;
  order_id?: number;
  data?: IProduct;
  product_id?: number;
  qty?: number;
  price?: number;
  total_price?: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  tax?: number;
  disc_percentage?: number;
  disc_value?: number;
}
