import {
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Box,
  Download,
  ArrowRight,
  Archive,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const bestSellers = [
  {
    id: "PRD-001",
    name: "Oli Shell Helix HX7 10W-40",
    category: "Pelumas",
    sold: 154,
    revenue: 69300000,
    stock: 12,
    trend: "+12%",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=oil",
    color: "amber",
  },
  {
    id: "PRD-002",
    name: "Kampas Rem Depan Avanza",
    category: "Brake System",
    sold: 89,
    revenue: 22250000,
    stock: 5,
    trend: "+8%",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=brake",
    color: "orange",
  },
  {
    id: "PRD-003",
    name: "Filter Udara Racing XL",
    category: "Filter",
    sold: 45,
    revenue: 6750000,
    stock: 25,
    trend: "-3%",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=filter",
    color: "blue",
  },
];

export default function LaporanBarangTerlaris() {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/20">
      {/* Header Vibrant - Amber Gradient */}
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-10 text-white shadow-2xl shadow-amber-100">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <Archive className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-50">
                Inventory Analytics
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase text-white">
              Barang Terlaris
            </h1>
            <p className="text-amber-50 font-medium opacity-90 italic">
              &quot;Analisis perputaran stok dan produk yang paling diminati
              pelanggan.&quot;
            </p>
          </div>
          <Button className="bg-white text-orange-600 hover:bg-amber-50 px-10 py-8 rounded-[2rem] font-black text-lg shadow-2xl transition-all hover:scale-105 border-none">
            <Download className="mr-2 size-6" /> LAPORAN STOK
          </Button>
        </div>
      </div>

      {/* Top 3 Best Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-12 relative z-20">
        {bestSellers.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-white hover:border-orange-200 transition-all flex flex-col relative overflow-hidden"
          >
            {/* Rank Badge */}
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-2 rounded-bl-3xl font-black italic">
              #{index + 1}
            </div>

            <div className="mb-6 bg-slate-50 size-20 rounded-3xl flex items-center justify-center border border-slate-100">
              <Box className="size-10 text-orange-500" />
            </div>

            <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">
              {item.name}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              {item.category}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">
                  Terjual
                </span>
                <span className="text-xl font-black text-slate-800">
                  {item.sold} Unit
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Omzet</span>
                <span className="text-lg font-black text-emerald-600">
                  {formatIDR(item.revenue)}
                </span>
              </div>
            </div>

            <div className="mt-auto p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase">
                  Sisa Stok
                </p>
                <p
                  className={`text-lg font-black ${item.stock < 10 ? "text-rose-500" : "text-slate-700"}`}
                >
                  {item.stock} Pcs
                </p>
              </div>
              {item.stock < 10 && (
                <Badge className="bg-rose-500 text-white animate-pulse border-none">
                  RESTOK!
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Statistik & Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Chart Area Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <TrendingUp className="text-orange-500" /> Tren Penjualan Barang
            </h3>
            <div className="flex gap-2">
              <Badge className="bg-orange-100 text-orange-600 border-none font-bold">
                Mingguan
              </Badge>
              <Badge
                className="text-slate-400 border-slate-200"
                variant="outline"
              >
                Bulanan
              </Badge>
            </div>
          </div>

          <div className="h-64 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="size-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 font-bold italic">
                Visualisasi Grafik Penjualan Barang
              </p>
            </div>
          </div>
        </div>

        {/* Kategori Terlaris */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-800 mb-8">
            Kategori Terpopuler
          </h3>
          <div className="space-y-6 flex-grow">
            {[
              { name: "Oli & Pelumas", pct: 85, color: "bg-amber-500" },
              { name: "Suku Cadang Mesin", pct: 60, color: "bg-orange-500" },
              { name: "Sistem Pengereman", pct: 45, color: "bg-rose-500" },
              { name: "Aksesoris", pct: 20, color: "bg-blue-500" },
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                  <span className="text-slate-500">{cat.name}</span>
                  <span className="text-slate-800">{cat.pct}%</span>
                </div>
                <Progress
                  className={`h-2.5 bg-slate-50 ${cat.color}`}
                  value={cat.pct}
                />
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-10 rounded-2xl font-black text-orange-600 hover:bg-orange-50 group"
            variant="ghost"
          >
            LIHAT SEMUA KATEGORI{" "}
            <ArrowRight className="ml-2 size-4 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Alert Stok Menipis */}
      <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="size-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-200">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-rose-800 leading-tight">
              Peringatan Stok Menipis!
            </h4>
            <p className="text-sm text-rose-600 font-medium">
              Ada 5 item fast-moving yang stoknya di bawah batas minimum.
            </p>
          </div>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700 text-white font-black px-10 py-7 rounded-2xl shadow-lg shadow-rose-100">
          ORDER BARANG SEKARANG
        </Button>
      </div>
    </div>
  );
}
