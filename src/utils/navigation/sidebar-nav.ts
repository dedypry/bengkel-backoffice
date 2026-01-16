import {
  Settings2,
  SquareTerminal,
  CarFront,
  Package,
  ClipboardList,
  FileBarChart,
  Receipt,
  Users,
  ShoppingCart,
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    url: "/",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Kasir",
    url: "/cashier",
    icon: ShoppingCart,
    isActive: true,
  },
  {
    title: "Transaksi Utama",
    url: "/service",
    icon: ClipboardList,
    items: [
      {
        title: "Pendaftaran Servis",
        url: "add",
        roles: ["super-admin", "sa", "owner"],
      },
      { title: "Antrean Bengkel", url: "queue" },
      { title: "Riwayat Servis", url: "history" },
    ],
  },
  {
    roles: ["super-admin", "partsman", "owner"],
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
    roles: ["super-admin", "owner", "cro"],
    title: "Data Master",
    url: "/master",
    icon: CarFront,
    items: [
      { title: "Data Pelanggan", url: "customers" },
      { title: "Data Kendaraan", url: "vehicles" },
      {
        title: "Data Mekanik",
        url: "mechanics",
        roles: ["super-admin", "owner"],
      },
      {
        title: "Daftar Jasa Servis",
        url: "services",
        roles: ["super-admin", "owner"],
      },
      {
        title: "Supplier",
        url: "suppliers",
        roles: ["super-admin", "owner"],
      },
    ],
  },
  {
    roles: ["super-admin", "owner", "cashier"],
    title: "Keuangan",
    url: "/finance",
    icon: Receipt,
    items: [
      { title: "Daftar (Invoicing)", url: "list" },
      { title: "Pengeluaran Operasional", url: "expenses" },
    ],
  },
  {
    roles: ["super-admin", "owner"],
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
    roles: ["super-admin", "owner"],
    title: "Pengaturan",
    url: "/settings",
    icon: Settings2,
    items: [
      { title: "Profil Bengkel", url: "profile" },
      { title: "Promo", url: "promo" },
      { title: "Manajemen User", url: "users" },
      { title: "Whastapp", url: "wa" },
    ],
  },
  {
    roles: ["super-admin", "owner", "hr"],
    title: "Human Resources",
    url: "/hr",
    icon: Users,
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

export { navigation };
