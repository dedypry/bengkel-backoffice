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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const expenses = [
  {
    id: "EXP-8801",
    title: "Restock Oli Shell Helix",
    category: "Inventory",
    amount: 4500000,
    date: "24 Des 2025",
    status: "Selesai",
    theme: "blue",
    icon: ShoppingCart,
  },
  {
    id: "EXP-8802",
    title: "Gaji Mekanik (Desember)",
    category: "Gaji/Payroll",
    amount: 12400000,
    date: "25 Des 2025",
    status: "Proses",
    theme: "purple",
    icon: Users,
  },
  {
    id: "EXP-8803",
    title: "Tagihan Listrik & Air",
    category: "Utilitas",
    amount: 1200000,
    date: "20 Des 2025",
    status: "Selesai",
    theme: "amber",
    icon: Zap,
  },
  {
    id: "EXP-8804",
    title: "Beli Toolkit Kunci Pas",
    category: "Alat Bengkel",
    amount: 850000,
    date: "15 Des 2025",
    status: "Selesai",
    theme: "rose",
    icon: Receipt,
  },
];

export default function FinancePage() {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-20 px-4">
      {/* Header Finance dengan Gradasi Soft */}
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-10 text-white shadow-2xl shadow-rose-200">
        {/* Tambahkan background dekorasi agar gradasi lebih 'hidup' */}
        <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              {/* Pastikan Lucide React sudah terinstall untuk icon TrendingDown */}
              <TrendingDown className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest ">
                Manajemen Arus Kas
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase ">
              Catatan Pengeluaran
            </h1>
            <p className="text-rose-50 font-medium opacity-90 italic">
              Pantau setiap rupiah yang keluar untuk operasional bengkel.
            </p>
          </div>

          <Button className="bg-white text-rose-600 hover:bg-rose-50 px-10 py-8 rounded-[2rem] font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 border-none">
            <Plus className="mr-2 size-6 stroke-[3]" /> CATAT PENGELUARAN
          </Button>
        </div>
      </div>

      {/* Ringkasan Budget (Statistik Cerah) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 flex items-center gap-5">
          <div className="bg-rose-100 p-4 rounded-3xl text-rose-600 shadow-inner">
            <ArrowDownCircle size={32} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Keluar (Bulan Ini)
            </p>
            <p className="text-2xl font-black text-slate-800">
              {formatIDR(18950000)}
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <PieChart className="text-blue-500" size={14} /> Budget
              Operasional
            </p>
            <span className="text-xs font-black text-blue-600">75%</span>
          </div>
          <Progress className="h-3 bg-slate-100" value={75} />
          <p className="text-[9px] font-bold text-slate-400 italic text-right">
            Sisa Budget: {formatIDR(5000000)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Invoice Pending
            </p>
            <p className="text-2xl font-black text-indigo-700 underline decoration-indigo-200">
              12 Dokumen
            </p>
          </div>
          <ChevronRight className="text-indigo-300" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-rose-400" />
          <Input
            className="w-full h-14 pl-14 pr-6 rounded-2xl border-none bg-rose-50/30 font-bold text-slate-700 placeholder:text-rose-300"
            placeholder="Cari transaksi, supplier, atau kategori..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Calendar size={18} /> Pilih Tanggal
          </Button>
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Filter size={18} /> Kategori
          </Button>
        </div>
      </div>

      {/* List Pengeluaran */}
      <div className="space-y-4">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="group bg-white rounded-[2rem] border-2 border-slate-50 p-6 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div
                className={`size-16 rounded-[1.5rem] flex items-center justify-center bg-${exp.theme}-50 text-${exp.theme}-600 shadow-sm group-hover:scale-110 transition-transform`}
              >
                <exp.icon size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    className={`bg-${exp.theme}-500 text-white border-none font-black text-[9px] uppercase`}
                  >
                    {exp.category}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-300 tracking-widest">
                    {exp.id}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-tight">
                  {exp.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar size={12} /> {exp.date}
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-end justify-between w-full md:w-auto gap-4">
              <p className="text-2xl font-black text-rose-600 tracking-tighter">
                -{formatIDR(exp.amount)}
              </p>
              <div className="flex items-center gap-3">
                <Badge
                  className={`rounded-lg py-1 px-3 border-slate-100 font-bold text-xs ${exp.status === "Proses" ? "text-amber-500 bg-amber-50" : "text-emerald-500 bg-emerald-50"}`}
                  variant="outline"
                >
                  {exp.status}
                </Badge>
                <Button
                  className="rounded-full hover:bg-slate-100"
                  size="icon"
                  variant="ghost"
                >
                  <MoreVertical className="text-slate-400" size={20} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Tips */}
      <div className="flex justify-center mt-10">
        <div className="bg-rose-50 border border-rose-100 px-8 py-4 rounded-3xl flex items-center gap-4 animate-bounce">
          <Zap className="text-rose-500 fill-rose-500 size-5" />
          <p className="text-xs font-black text-rose-700 uppercase tracking-tight">
            Tips: Pengeluaran bulan ini naik 5% dari bulan lalu!
          </p>
        </div>
      </div>
    </div>
  );
}
