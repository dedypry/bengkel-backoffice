import type { IUser } from "./IUser";

export interface IAttendance {
  id: number;
  company_id: number;
  user_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: "present" | "late" | "absent" | "leave" | "sick" | "permit" | string;
  work_minutes: number | null;
  source: "machine" | "manual" | string;
  note: string | null;
  created_at: string;
  updated_at: string;
  user?: IUser;
}

export interface IAttendanceSummary {
  date: string;
  total: number;
  present: number;
  late: number;
  leave: number;
  absent: number;
}

export interface IAttendanceDevice {
  id: number;
  company_id: number | null;
  serial_number: string;
  name: string | null;
  location: string | null;
  ip_address: string | null;
  firmware: string | null;
  last_seen_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IAttendanceLog {
  id: number;
  company_id: number | null;
  device_id: number | null;
  serial_number: string | null;
  pin: string | null;
  user_id: number | null;
  punch_time: string;
  status: string | null;
  verify_mode: string | null;
  source: string;
  user?: IUser;
  device?: IAttendanceDevice;
}
