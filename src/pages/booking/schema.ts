import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.number().optional(),
  plate_number: z.string().min(4, "Nopol wajib diisi (min. 4 karakter)"),
  brand: z.string().min(1, "Merk wajib diisi"),
  model: z.string().min(1, "Tipe wajib diisi"),
  year: z.any().optional(),
  color: z.string().optional(),
  engine_capacity: z.any().optional(),
  transmission_type: z.string().optional(),
  fuel_type: z.string().optional(),
  vin_number: z.string().optional(),
  engine_number: z.string().optional(),
  tire_size: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

export const bookingSchema = z.object({
  id: z.number().optional(),
  customer_id: z
    .string("Silahkan pilih pelanggan")
    .min(1, "Silahkan pilih pelanggan"),
  vehicle_id: z
    .string("Silahkan pilih kendaraan")
    .min(1, "Silahkan pilih kendaraan"),
  branch_id: z.string("Silahkan pilih Cabang").min(1, "Silahkan pilih Cabang"),
  booking_date: z
    .string("Tanggal booking wajib diisi")
    .min(1, "Tanggal booking wajib diisi"),
  booking_time: z
    .string("Jam booking wajib diisi")
    .min(1, "Jam booking wajib diisi"),
  service_type: z.string("Pilih jenis servis").min(1, "Pilih jenis servis"),
  complaint: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
