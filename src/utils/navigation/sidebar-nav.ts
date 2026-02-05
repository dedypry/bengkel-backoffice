const navigation = [
  {
    title: "Dashboard",
    url: "/",
    icon: "SquareTerminal",
    isActive: true,
    permissions: ["dashboard.view"],
  },
  {
    title: "Kasir",
    url: "/cashier",
    icon: "ShoppingCart",
    isActive: true,
    permissions: ["payment.create", "payment.view"],
  },
  {
    title: "Booking",
    url: "/booking",
    icon: "Book",
    isActive: true,
    permissions: ["wo.create"],
  },
  {
    title: "Transaksi Utama",
    url: "/service",
    icon: "ClipboardList",
    permissions: ["wo.view"],
    items: [
      {
        title: "Pendaftaran Servis",
        url: "add",
        roles: ["super-admin", "sa", "owner"],
        permissions: ["wo.create"],
      },
      {
        title: "Antrean Bengkel",
        url: "queue",
        permissions: ["wo.view", "wo.create", "wo.update", "wo.delete"],
      },
      { title: "Riwayat Servis", url: "history", permissions: ["wo.view"] },
    ],
  },
  {
    roles: ["super-admin", "partsman", "owner"],
    title: "Inventaris Sparepart",
    url: "/inventory",
    icon: "Package",
    permissions: ["product.view", "product.stock", "product.manage"],
    items: [
      {
        title: "Stok Barang",
        url: "stock",
      },
      { title: "Barang Masuk", url: "in" },
      { title: "Kategori Produk", url: "categories" },
    ],
  },
  {
    roles: ["super-admin", "owner", "cro"],
    title: "Data Master",
    url: "/master",
    icon: "CarFront",
    permissions: ["master.manage"],
    items: [
      {
        title: "Data Pelanggan",
        url: "customers",
        permissions: ["customer.view", "customer.manage"],
      },
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
    permissions: ["report.manage"],
    icon: "Receipt",
    items: [
      { title: "Daftar (Invoicing)", url: "list" },
      { title: "Pengeluaran Operasional", url: "expenses" },
    ],
  },
  {
    roles: ["super-admin", "owner"],
    title: "Laporan",
    url: "/reports",
    permissions: ["report.manage"],
    icon: "FileBarChart",
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
    icon: "Settings2",
    items: [
      {
        title: "Profil Bengkel",
        url: "profile",
        permissions: ["profile.manage"],
      },
      { title: "Promo", url: "promo", permissions: ["promo.manage"] },
      // { title: "Manajemen User", url: "users" },
      { title: "Management Role", url: "roles", permissions: ["role.manage"] },
      { title: "Whastapp", url: "wa" },
    ],
  },
  {
    roles: ["super-admin", "owner", "hr"],
    title: "Human Resources",
    url: "/hr",
    icon: "Users",
    permissions: ["user.manage"],
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
