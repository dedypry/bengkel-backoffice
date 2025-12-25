import {
  Trophy,
  Star,
  Zap,
  BarChart3,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Timer,
  Award,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const performanceData = [
  {
    rank: 1,
    name: "Agus Supriatna",
    role: "Senior Lead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
    jobs: 142,
    rating: 4.9,
    efficiency: 96,
    onTime: 98,
    status: "Excellent",
  },
  {
    rank: 2,
    name: "Budi Hermawan",
    role: "Technician",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    jobs: 118,
    rating: 4.8,
    efficiency: 89,
    onTime: 92,
    status: "Great",
  },
  {
    rank: 3,
    name: "Samsul Bahri",
    role: "Technician",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samsul",
    jobs: 95,
    rating: 4.7,
    efficiency: 82,
    onTime: 85,
    status: "Good",
  },
];

export default function LaporanPerformaMekanik() {
  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/20">
      {/* Header Vibrant - Purple Blue Gradient */}
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-10 text-white shadow-2xl shadow-indigo-100">
        <div className="absolute -right-10 -bottom-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <Award className="size-4 text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Analytics Center
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
              Performa Mekanik
            </h1>
            <p className="text-indigo-50 font-medium opacity-90 italic">
              Pantau produktivitas dan kualitas pengerjaan tim teknisi.
            </p>
          </div>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-7 rounded-[2rem] font-black shadow-xl transition-all border-none">
            <Download className="mr-2 size-5" /> UNDUH LAPORAN
          </Button>
        </div>
      </div>

      {/* Podium Mekanik Terbaik (Top 3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-12 relative z-20">
        {performanceData.map((mec) => (
          <div
            key={mec.rank}
            className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/60 border-2 border-transparent hover:border-indigo-100 transition-all flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div
                className={`absolute -top-4 -left-4 size-10 rounded-full flex items-center justify-center font-black text-white shadow-lg z-20 
                ${mec.rank === 1 ? "bg-amber-400" : "bg-slate-300"}`}
              >
                {mec.rank}
              </div>
              <Avatar className="size-28 border-4 border-white shadow-2xl">
                <AvatarImage src={mec.avatar} />
                <AvatarFallback className="font-black text-xl">
                  {mec.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-1">
              {mec.name}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              {mec.role}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                  Unit Selesai
                </p>
                <p className="text-xl font-black text-slate-800">{mec.jobs}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                  Rating
                </p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <p className="text-xl font-black text-slate-800">
                    {mec.rating}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-slate-400">Efisiensi Kerja</span>
                  <span className="text-indigo-600">{mec.efficiency}%</span>
                </div>
                <Progress className="h-2 bg-slate-100" value={mec.efficiency} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-slate-400">Ketepatan Waktu</span>
                  <span className="text-emerald-600">{mec.onTime}%</span>
                </div>
                <Progress className="h-2 bg-slate-100" value={mec.onTime} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Metrics Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kualitas Kerja Section */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Kualitas & Kepuasan
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Data berdasarkan feedback pelanggan 30 hari terakhir.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500 font-black">
                  5★
                </div>
                <p className="text-sm font-bold text-slate-700">
                  Pujian Kepuasan Sempurna
                </p>
              </div>
              <p className="text-lg font-black text-slate-800">88%</p>
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-500 font-black italic">
                  !
                </div>
                <p className="text-sm font-bold text-slate-700">
                  Komplain Perbaikan Ulang
                </p>
              </div>
              <p className="text-lg font-black text-slate-800">2%</p>
            </div>
          </div>
        </div>

        {/* Kecepatan Kerja Section */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl">
              <Timer size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Kecepatan Pengerjaan
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Analisis durasi vs estimasi waktu jasa.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100">
              <Zap className="size-6 text-blue-500 mb-3" />
              <p className="text-3xl font-black text-blue-700 tracking-tighter">
                -15m
              </p>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">
                Lebih Cepat/Unit
              </p>
            </div>
            <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
              <UserCheck className="size-6 text-indigo-500 mb-3" />
              <p className="text-3xl font-black text-indigo-700 tracking-tighter">
                92%
              </p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                Selesai Hari H
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
            <BarChart3 className="text-slate-400" size={18} />
            <p className="text-xs text-slate-500 font-medium italic">
              Tim Anda bekerja 12% lebih efisien dibanding bulan lalu.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info Call to Action */}
      <div className="bg-white border-2 border-dashed border-indigo-200 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="size-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Trophy size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-800 leading-tight">
              Berikan Reward untuk Tim!
            </h4>
            <p className="text-sm text-slate-400 font-medium">
              Agus Supriatna berhak mendapatkan bonus performa bulan ini.
            </p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-indigo-100 flex items-center gap-2">
          PROSES BONUS <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
