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
    url: "#",
    icon: ClipboardList,
    items: [
      { title: "Pendaftaran Servis", url: "/service/add" },
      { title: "Antrean Bengkel", url: "/service/queue" },
      { title: "Riwayat Servis", url: "/service/history" },
    ],
  },
  {
    title: "Inventaris Sparepart",
    url: "#",
    icon: Package,
    items: [
      { title: "Stok Barang", url: "/inventory/stock" },
      { title: "Barang Masuk", url: "/inventory/in" },
      { title: "Kategori Produk", url: "/inventory/categories" },
    ],
  },
  {
    title: "Data Master",
    url: "#",
    icon: CarFront,
    items: [
      { title: "Data Pelanggan", url: "/master/customers" },
      { title: "Data Kendaraan", url: "/master/vehicles" },
      { title: "Data Mekanik", url: "/master/mechanics" },
      { title: "Daftar Jasa Servis", url: "/master/services" },
      { title: "Sparepart", url: "/master/spareparts" },
    ],
  },
  {
    title: "Keuangan",
    url: "#",
    icon: Receipt,
    items: [
      { title: "Daftar (Invoicing)", url: "/finance/list" },
      { title: "Kasir (Invoicing)", url: "/finance/invoices" },
      { title: "Pengeluaran Operasional", url: "/finance/expenses" },
    ],
  },
  {
    title: "Laporan",
    url: "#",
    icon: FileBarChart,
    items: [
      { title: "Laporan Pendapatan", url: "/reports/revenue" },
      { title: "Performa Mekanik", url: "/reports/mechanics" },
      { title: "Barang Terlaris", url: "/reports/top-parts" },
    ],
  },
  {
    title: "Pengaturan",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Profil Bengkel", url: "/settings/profile" },
      { title: "Manajemen User", url: "/settings/users" },
    ],
  },
  {
    title: "Human Resources",
    url: "#",
    icon: Users, // Menggunakan icon Users dari lucide-react
    items: [
      {
        title: "Data Karyawan",
        url: "/hr/employees",
      },
      {
        title: "Absensi Staf",
        url: "/hr/attendance",
      },
      // {
      //   title: "Penggajian (Payroll)",
      //   url: "/hr/payroll",
      // },
      {
        title: "Penilaian Kinerja",
        url: "/hr/performance",
      },
      // {
      //   title: "Jadwal Shift",
      //   url: "/hr/shifts",
      // },
    ],
  },
];
