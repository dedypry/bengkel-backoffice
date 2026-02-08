export const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: "SquareTerminal",
    isActive: true,
    permissions: ["dashboard.view"],
  },
  {
    title: "Kasir",
    href: "/cashier",
    icon: "ShoppingCart",
    isActive: true,
    permissions: ["payment.create", "payment.view"],
  },
  {
    title: "Booking",
    href: "/booking",
    icon: "Book",
    isActive: true,
    permissions: ["wo.create"],
  },
  {
    header: "Transaksi Utama",
    href: "/service",
    icon: "ClipboardList",
    permissions: ["wo.view"],
    items: [
      {
        title: "Pendaftaran Servis",
        href: "add",
        icon: "PlusCircle",
        roles: ["super-admin", "sa", "owner"],
        permissions: ["wo.create"],
      },
      {
        title: "Antrean Bengkel",
        href: "queue",
        icon: "LayoutList",
        permissions: ["wo.view", "wo.create", "wo.update", "wo.delete"],
      },
      {
        title: "Riwayat Servis",
        href: "history",
        icon: "History",
        permissions: ["wo.view"],
      },
    ],
  },
  {
    roles: ["super-admin", "partsman", "owner"],
    header: "Inventaris Sparepart",
    href: "/inventory",
    icon: "Package",
    permissions: ["product.view", "product.stock", "product.manage"],
    items: [
      {
        title: "Stok Barang",
        href: "stock",
        icon: "Boxes",
      },
      {
        title: "Kategori Produk",
        href: "categories",
        icon: "Tags",
      },
    ],
  },
  {
    roles: ["super-admin", "owner", "cro"],
    header: "Data Master",
    href: "/master",
    icon: "CarFront",
    permissions: ["master.manage"],
    items: [
      {
        title: "Data Pelanggan",
        href: "customers",
        icon: "Users",
        permissions: ["customer.view", "customer.manage"],
      },
      // {
      //   title: "Data Mekanik",
      //   href: "mechanics",
      //   icon: "Wrench",
      //   roles: ["super-admin", "owner"],
      // },
      {
        title: "Daftar Jasa Servis",
        href: "services",
        icon: "ClipboardList",
        roles: ["super-admin", "owner"],
      },
      {
        title: "Supplier",
        href: "suppliers",
        icon: "Truck",
        roles: ["super-admin", "owner"],
      },
    ],
  },
  {
    roles: ["super-admin", "owner", "cashier"],
    header: "Keuangan",
    href: "/finance",
    permissions: ["report.manage"],
    icon: "Receipt",
    items: [
      { title: "Daftar (Invoicing)", href: "list", icon: "FileText" },
      { title: "Pengeluaran Operasional", href: "expenses", icon: "Wallet" },
    ],
  },
  {
    roles: ["super-admin", "owner"],
    header: "Laporan",
    href: "/reports",
    permissions: ["report.manage"],
    icon: "FileBarChart",
    items: [
      { title: "Laporan Pendapatan", href: "revenue", icon: "TrendingUp" },
      { title: "Performa Mekanik", href: "mechanics", icon: "Award" },
      { title: "Barang Terlaris", href: "top-parts", icon: "BarChart3" },
    ],
  },
  {
    roles: ["super-admin", "owner"],
    header: "Pengaturan",
    href: "/settings",
    icon: "Settings2",
    items: [
      {
        title: "Profil Bengkel",
        href: "profile",
        icon: "Store",
        permissions: ["profile.manage"],
      },
      {
        title: "Management Role",
        href: "roles",
        icon: "ShieldAlert",
        permissions: ["role.manage"],
      },
      // {
      //   title: "Whatsapp",
      //   href: "wa",
      //   icon: "MessageSquare",
      // },
    ],
  },
  {
    roles: ["super-admin", "owner", "hr"],
    header: "Human Resources",
    href: "/hr",
    icon: "Users",
    permissions: ["user.manage"],
    items: [
      {
        title: "Data Karyawan",
        href: "employees",
        icon: "UserCircle",
      },
    ],
  },
];
