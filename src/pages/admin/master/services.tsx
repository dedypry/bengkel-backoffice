import {
  Clock,
  Plus,
  Search,
  Filter,
  Settings2,
  Zap,
  ShieldCheck,
  Award,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const services = [
  {
    id: "SRV-001",
    title: "Servis Berkala 10.000 KM",
    category: "Perawatan",
    price: 750000,
    duration: "120m",
    difficulty: "Menengah",
    status: "Aktif",
    popularity: 95,
    themeColor: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "SRV-002",
    title: "Tune Up & Scanner",
    category: "Mesin",
    price: 350000,
    duration: "60m",
    difficulty: "Sulit",
    status: "Aktif",
    popularity: 82,
    themeColor: "bg-rose-500",
    lightBg: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    id: "SRV-003",
    title: "Ganti Oli Mesin (Standard)",
    category: "Servis Cepat",
    price: 150000,
    duration: "30m",
    difficulty: "Mudah",
    status: "Aktif",
    popularity: 98,
    themeColor: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    id: "SRV-004",
    title: "Overhaul Transmisi Matik",
    category: "Perbaikan Berat",
    price: 2500000,
    duration: "3 Hari",
    difficulty: "Ekstrem",
    status: "Aktif",
    popularity: 15,
    themeColor: "bg-amber-500",
    lightBg: "bg-amber-50",
    textColor: "text-amber-600",
  },
];

export default function MasterJasaLight() {
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      {/* Header Cerah & Ceria */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary border border-slate-100 p-10 shadow-xl shadow-blue-100/50">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-blue-50 blur-3xl opacity-60" />
        <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-emerald-50 blur-3xl opacity-60" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100/50 px-4 py-2 rounded-2xl mb-4 border border-blue-200">
              <Zap className="size-4 text-blue-600 fill-blue-600" />
              <span className="text-xs font-black text-blue-700 uppercase tracking-widest">
                Katalog Layanan
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
              Jasa Bengkel
            </h1>
            <p className="text-white font-medium">
              Atur standarisasi harga dan estimasi waktu kerja tim.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 rounded-[2rem] font-black text-lg shadow-xl transition-all hover:scale-105">
            <Plus className="mr-2 size-6 stroke-[3]" /> TAMBAH JASA
          </Button>
        </div>
      </div>

      {/* Bar Pencarian Melayang */}
      <div className="relative -mt-12 mx-auto max-w-4xl z-30">
        <div className="bg-white p-3 rounded-3xl shadow-2xl shadow-slate-200/60 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-blue-400" />
            <Input
              className="h-14 pl-14 pr-6 rounded-2xl border-none bg-slate-50 font-bold text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-100"
              placeholder="Cari jasa servis..."
            />
          </div>
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Filter className="size-5" /> Filter
          </Button>
        </div>
      </div>

      {/* Grid Kartu Jasa */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div className="p-8">
              {/* Info Atas & Populeritas */}
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-4 rounded-2xl shadow-sm ${srv.lightBg} ${srv.textColor}`}
                >
                  <Settings2 className="size-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black italic">
                    <BarChart3 size={10} /> {srv.popularity}%
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 tracking-widest">
                    {srv.id}
                  </span>
                </div>
              </div>

              {/* Kategori & Judul */}
              <div className="space-y-2 mb-6">
                <Badge
                  className="border-slate-100 text-slate-400 text-[10px] px-2 py-0"
                  variant="outline"
                >
                  {srv.category}
                </Badge>
                <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  {srv.title}
                </h3>
              </div>

              {/* Detail Estimasi & Kesulitan */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center justify-center gap-1">
                    <Clock size={10} /> Durasi
                  </p>
                  <p className="text-sm font-black text-slate-700">
                    {srv.duration}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center justify-center gap-1">
                    <Award size={10} /> Sulit
                  </p>
                  <p className="text-sm font-black text-slate-700">
                    {srv.difficulty}
                  </p>
                </div>
              </div>

              {/* Panel Harga (Light Style) */}
              <div
                className={`p-6 rounded-3xl text-center border-2 border-dashed ${srv.lightBg} ${srv.textColor} border-current opacity-80 group-hover:opacity-100 transition-opacity`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                  Biaya Layanan
                </p>
                <p className="text-2xl font-black tracking-tighter">
                  {formatIDR(srv.price)}
                </p>
              </div>
            </div>

            {/* Footer Kartu */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex gap-2 mt-auto">
              <Button className="flex-1 h-12 rounded-xl font-black bg-white border border-slate-200 text-slate-500 hover:bg-slate-100">
                DETAIL
              </Button>
              <Button
                className={`flex-1 h-12 rounded-xl font-black text-white shadow-lg ${srv.themeColor} opacity-90 hover:opacity-100`}
              >
                EDIT JASA
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Jaminan Kualitas */}
      <div className="flex justify-center mt-12">
        <div className="bg-white px-8 py-5 rounded-[2rem] border border-blue-100 shadow-lg flex items-center gap-4">
          <div className="bg-blue-500 text-white p-2 rounded-xl shadow-blue-200 shadow-lg">
            <ShieldCheck size={20} />
          </div>
          <p className="text-sm font-bold text-slate-600 italic">
            Semua harga jasa terstandarisasi untuk menjamin kepuasan pelanggan.
          </p>
        </div>
      </div>
    </div>
  );
}
