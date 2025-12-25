import {
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Target,
  ArrowRight,
  MoreHorizontal,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const incomeHistory = [
  {
    id: "TX-901",
    date: "25 Des 2025",
    customer: "Budi Santoso",
    type: "Servis Berkala",
    amount: 1250000,
    method: "QRIS",
    status: "Success",
  },
  {
    id: "TX-902",
    date: "25 Des 2025",
    customer: "Siska Putri",
    type: "Ganti Oli",
    amount: 450000,
    method: "Cash",
    status: "Success",
  },
  {
    id: "TX-903",
    date: "24 Des 2025",
    customer: "Hadi Jaya",
    type: "Overhaul Mesin",
    amount: 8500000,
    method: "Transfer",
    status: "Success",
  },
  {
    id: "TX-904",
    date: "24 Des 2025",
    customer: "Rian Ardi",
    type: "Tune Up",
    amount: 350000,
    method: "QRIS",
    status: "Success",
  },
];

export default function LaporanPendapatan() {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/20">
      {/* Header Laporan - Vibrant Light Green */}
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-10 text-white shadow-2xl shadow-emerald-100">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <TrendingUp className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-50">
                Performance Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
              Laporan Pendapatan
            </h1>
            <p className="text-emerald-50 font-medium opacity-90 italic">
              Analisis pemasukan dan pertumbuhan bengkel secara akurat.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-7 rounded-[2rem] font-black shadow-xl transition-all hover:scale-105 border-none">
              <Download className="mr-2 size-5" /> EXPORT EXCEL
            </Button>
          </div>
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-12 relative z-20">
        {[
          {
            label: "Total Pendapatan",
            val: 85450000,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Unit Servis",
            val: "124 Unit",
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Rata-rata Transaksi",
            val: 689000,
            icon: BarChart3,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Pertumbuhan",
            val: "+12.5%",
            icon: ArrowUpRight,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center text-center"
          >
            <div className={`${item.bg} ${item.color} p-4 rounded-2xl mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {item.label}
            </p>
            <p className="text-xl font-black text-slate-800">
              {typeof item.val === "number" ? formatIDR(item.val) : item.val}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Target & Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <PieChart className="text-emerald-500" /> Sumber Pendapatan
            </h3>
            <Button className="text-xs font-bold text-blue-600" variant="ghost">
              Lihat Detail
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                { name: "Jasa Servis", pct: 65, color: "bg-emerald-500" },
                { name: "Suku Cadang", pct: 25, color: "bg-blue-500" },
                { name: "Aksesoris", pct: 10, color: "bg-amber-500" },
              ].map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">{cat.name}</span>
                    <span className="text-slate-800">{cat.pct}%</span>
                  </div>
                  <Progress
                    className={`h-2 bg-slate-100 ${cat.color}`}
                    value={cat.pct}
                  />
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-[2rem] flex items-center justify-center border border-dashed border-slate-200">
              <p className="text-slate-400 text-xs font-medium italic">
                Grafik Area Chart Disini
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-[3rem] p-8 text-white shadow-xl shadow-blue-200">
          <Target className="size-12 mb-6 opacity-50" />
          <h3 className="text-2xl font-black mb-2 tracking-tight">
            Target Bulanan
          </h3>
          <p className="text-blue-100 text-sm mb-8">
            Anda sudah mencapai 85% dari target pendapatan Desember.
          </p>

          <div className="bg-white/10 rounded-[2rem] p-6 backdrop-blur-md border border-white/20 mb-8">
            <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">
              Pencapaian
            </p>
            <p className="text-3xl font-black mb-4 tracking-tighter">
              {formatIDR(85450000)}
            </p>
            <Progress className="h-3 bg-white/20" value={85} />
          </div>

          <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 rounded-2xl font-black text-xs uppercase tracking-widest">
            Sesuaikan Target <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Tabel Transaksi Terbaru */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">
            Transaksi Terbaru
          </h3>
          <div className="flex gap-2">
            <Button
              className="rounded-xl font-bold text-xs gap-2"
              variant="outline"
            >
              <Filter size={14} /> Filter
            </Button>
            <Button
              className="rounded-xl font-bold text-xs gap-2"
              variant="outline"
            >
              <Calendar size={14} /> Desember 2025
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Transaksi
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Metode
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Nominal
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {incomeHistory.map((trx) => (
                <tr
                  key={trx.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
                        {trx.customer.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {trx.customer}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {trx.type} • {trx.date}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] px-3">
                      {trx.method}
                    </Badge>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <p className="font-black text-emerald-600">
                      {formatIDR(trx.amount)}
                    </p>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                      {trx.id}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <Button
                      className="rounded-full text-slate-300"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
          <Button
            className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600"
            variant="ghost"
          >
            Lihat Semua Laporan Transaksi
          </Button>
        </div>
      </div>
    </div>
  );
}
