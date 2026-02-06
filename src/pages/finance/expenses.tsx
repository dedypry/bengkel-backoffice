import {
  ArrowDownCircle,
  Plus,
  Search,
  Filter,
  TrendingDown,
  Receipt,
  ShoppingCart,
  Zap,
  Users,
  MoreVertical,
  Calendar,
  ChevronRight,
  PieChart,
} from "lucide-react";
import {
  Button,
  Progress,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
} from "@heroui/react";

const expenses = [
  {
    id: "EXP-8801",
    title: "Restock Oli Shell Helix",
    category: "Inventory",
    amount: 4500000,
    date: "24 Des 2025",
    status: "Selesai",
    color: "primary",
    icon: ShoppingCart,
  },
  {
    id: "EXP-8802",
    title: "Gaji Mekanik (Desember)",
    category: "Gaji/Payroll",
    amount: 12400000,
    date: "25 Des 2025",
    status: "Proses",
    color: "secondary",
    icon: Users,
  },
  {
    id: "EXP-8803",
    title: "Tagihan Listrik & Air",
    category: "Utilitas",
    amount: 1200000,
    date: "20 Des 2025",
    status: "Selesai",
    color: "warning",
    icon: Zap,
  },
  {
    id: "EXP-8804",
    title: "Beli Toolkit Kunci Pas",
    category: "Alat Bengkel",
    amount: 850000,
    date: "15 Des 2025",
    status: "Selesai",
    color: "danger",
    icon: Receipt,
  },
];

export default function FinanceExpensePage() {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header Finance - Hero Style */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 size-64 bg-rose-500/20 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-40 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/10">
              <TrendingDown className="size-4 text-rose-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                Cash Flow Management
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase italic">
              PENGELUARAN <span className="text-rose-500">.</span>
            </h1>
            <p className="text-gray-400 font-medium italic">
              Pantau setiap rupiah yang keluar untuk operasional bengkel Anda.
            </p>
          </div>

          <Button
            className="bg-white text-black hover:bg-gray-100 px-10 py-8 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-105 active:scale-95 border-none uppercase italic tracking-widest"
            startContent={<Plus className="size-6 stroke-[4]" />}
          >
            Catat Baru
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4">
          <CardBody className="flex flex-row items-center gap-5">
            <div className="bg-rose-50 p-4 rounded-2xl text-rose-600">
              <ArrowDownCircle size={32} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Total Keluar (Bulan Ini)
              </p>
              <p className="text-3xl font-black text-gray-900 tracking-tight">
                {formatIDR(18950000)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4">
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <PieChart className="text-blue-500" size={14} /> Budget
                Operasional
              </p>
              <span className="text-xs font-black text-blue-600 italic">
                75%
              </span>
            </div>
            <Progress
              aria-label="Budget"
              className="h-3"
              classNames={{ indicator: "bg-blue-600", track: "bg-gray-100" }}
              color="primary"
              value={75}
            />
            <p className="text-[9px] font-bold text-gray-400 italic text-right">
              Sisa: {formatIDR(5000000)}
            </p>
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm bg-gray-900 text-white rounded-[2rem] p-4 overflow-hidden relative group cursor-pointer">
          <CardBody className="flex flex-row items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Invoice Pending
              </p>
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase">
                12 Dokumen
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl group-hover:bg-rose-500 transition-colors">
              <ChevronRight className="text-white" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search Bar - Custom Industrial Style */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
          <input
            className="w-full h-14 pl-16 pr-6 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gray-200 font-bold text-gray-700 placeholder:text-gray-300 text-sm transition-all"
            placeholder="Cari transaksi, supplier, atau kategori..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="h-14 px-6 rounded-2xl font-black uppercase italic tracking-widest text-[10px] bg-gray-100"
            variant="flat"
          >
            <Calendar className="mr-2" size={18} /> Filter Tanggal
          </Button>
          <Button isIconOnly className="h-14 w-14 rounded-2xl bg-gray-100">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Expense List */}
      <div className="grid gap-4">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="size-20 rounded-3xl flex items-center justify-center bg-gray-50 text-gray-900 shadow-inner group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                <exp.icon size={32} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Chip
                    className="font-black text-[9px] uppercase tracking-tighter px-2 h-5 italic"
                    color={exp.color as any}
                    size="sm"
                    variant="flat"
                  >
                    {exp.category}
                  </Chip>
                  <span className="text-[10px] font-black text-gray-300 tracking-widest uppercase">
                    {exp.id}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 leading-none uppercase italic tracking-tighter">
                  {exp.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                    <Calendar className="text-rose-500" size={12} /> {exp.date}
                  </p>
                  <Chip
                    className="border-none text-[9px] font-black uppercase italic"
                    color={exp.status === "Proses" ? "warning" : "success"}
                    size="sm"
                    variant="dot"
                  >
                    {exp.status}
                  </Chip>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
              <p className="text-3xl font-black text-gray-900 tracking-tighter italic">
                -{formatIDR(exp.amount)}
              </p>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="text-gray-400"
                    radius="full"
                    variant="light"
                  >
                    <MoreVertical size={20} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Aksi Pengeluaran" variant="flat">
                  <DropdownItem key="detail">Lihat Detail</DropdownItem>
                  <DropdownItem key="edit">Edit Transaksi</DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    Hapus Catatan
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Tips */}
      <div className="bg-rose-500 text-white px-8 py-5 rounded-[2rem] flex items-center justify-between shadow-lg shadow-rose-200 animate-pulse cursor-pointer group hover:animate-none transition-all">
        <div className="flex items-center gap-4">
          <Zap className="fill-white size-6" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest italic">
              Peringatan Arus Kas
            </p>
            <p className="text-sm font-medium opacity-90">
              Pengeluaran bulan ini naik 5% dari bulan lalu. Periksa stok
              inventori!
            </p>
          </div>
        </div>
        <ChevronRight className="group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  );
}
