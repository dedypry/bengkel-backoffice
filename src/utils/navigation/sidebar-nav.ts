import {
  Settings2,
  SquareTerminal,
  CarFront,
  Package,
  ClipboardList,
  FileBarChart,
  Receipt,
  Users,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    url: "/",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Transaksi Utama",
    url: "/service",
    icon: ClipboardList,
    items: [
      { title: "Pendaftaran Servis", url: "add" },
      { title: "Antrean Bengkel", url: "queue" },
      { title: "Riwayat Servis", url: "history" },
    ],
  },
  {
    title: "Inventaris Sparepart",
    url: "/inventory",
    icon: Package,
    items: [
      { title: "Stok Barang", url: "stock" },
      { title: "Barang Masuk", url: "in" },
      { title: "Kategori Produk", url: "categories" },
    ],
  },
  {
    title: "Data Master",
    url: "/master",
    icon: CarFront,
    items: [
      { title: "Data Pelanggan", url: "customers" },
      { title: "Data Kendaraan", url: "vehicles" },
      { title: "Data Mekanik", url: "mechanics" },
      { title: "Daftar Jasa Servis", url: "services" },
    ],
  },
  {
    title: "Keuangan",
    url: "/finance",
    icon: Receipt,
    items: [
      { title: "Daftar (Invoicing)", url: "list" },
      { title: "Kasir (Invoicing)", url: "invoices" },
      { title: "Pengeluaran Operasional", url: "expenses" },
    ],
  },
  {
    title: "Laporan",
    url: "/reports",
    icon: FileBarChart,
    items: [
      { title: "Laporan Pendapatan", url: "revenue" },
      { title: "Performa Mekanik", url: "mechanics" },
      { title: "Barang Terlaris", url: "top-parts" },
    ],
  },
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings2,
    items: [
      { title: "Profil Bengkel", url: "profile" },
      { title: "Manajemen User", url: "users" },
    ],
  },
  {
    title: "Human Resources",
    url: "/hr",
    icon: Users, // Menggunakan icon Users dari lucide-react
    items: [
      {
        title: "Data Karyawan",
        url: "employees",
      },
      {
        title: "Absensi Staf",
        url: "attendance",
      },
      // {
      //   title: "Penggajian (Payroll)",
      //   url: "payroll",
      // },
      {
        title: "Penilaian Kinerja",
        url: "performance",
      },
      // {
      //   title: "Jadwal Shift",
      //   url: "shifts",
      // },
    ],
  },
];
