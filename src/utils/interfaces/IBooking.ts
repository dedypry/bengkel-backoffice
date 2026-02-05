import type { ICustomer, IVehicle } from "./IUser";

export interface IBooking {
  id: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  customer_id: number;
  vehicle_id: number;
  branch_id?: number;
  booking_date: string;
  booking_time: any;
  service_type: string;
  complaint?: string;
  status?: string;
  created_by?: number;
  updated_by?: number;
  vehicle: IVehicle;
  customer: ICustomer;
}
