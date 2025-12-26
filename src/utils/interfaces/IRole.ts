export interface IRole {
  id: number;
  created_at?: string; // Opsional jika data dari API terkadang tidak menyertakannya
  updated_at?: string;
  name: string;
  slug: RoleSlug;
  description: string;
}

export type RoleSlug =
  | "super-admin" // Akses seluruh sistem & multi-cabang
  | "owner" // Pemilik, melihat profit & laporan bisnis
  | "admin-bengkel" // Operasional, master data, & absensi
  | "sa" // Service Advisor: Work Order & estimasi
  | "foreman" // Kepala Regu: QC & pembagian tugas teknis
  | "mechanic" // Teknis: Update progres & pengerjaan
  | "partsman" // Logistik: Inventori & keluar masuk barang
  | "cashier" // Keuangan: Invoice & pembayaran
  | "cro" // Customer Relation: Follow-up & komplain
  | "driver-valet";
