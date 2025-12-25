import {
  Wrench,
  Star,
  Phone,
  Zap,
  Plus,
  ChevronRight,
  Activity,
  Award,
  Clock,
  Search,
  Filter,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const mechanics = [
  {
    id: "MK-001",
    name: "Agus Supriatna",
    level: "Senior Lead",
    specialty: "Mesin & Transmisi",
    status: "Sibuk",
    efficiency: 92,
    score: 98,
    rating: 4.9,
    experience: "8 Tahun",
    theme: "blue",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
  },
  {
    id: "MK-002",
    name: "Budi Hermawan",
    level: "Teknisi",
    specialty: "Kelistrikan & AC",
    status: "Tersedia",
    efficiency: 85,
    score: 88,
    rating: 4.8,
    experience: "5 Tahun",
    theme: "purple",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: "MK-003",
    name: "Samsul Bahri",
    level: "Teknisi",
    specialty: "Kaki-kaki & Ban",
    status: "Istirahat",
    efficiency: 78,
    score: 82,
    rating: 4.7,
    experience: "3 Tahun",
    theme: "orange",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samsul",
  },
];

const statusStyles = {
  Tersedia: "bg-emerald-500 text-white shadow-emerald-200",
  Sibuk: "bg-rose-500 text-white shadow-rose-200",
  Istirahat: "bg-amber-500 text-white shadow-amber-200",
  Cuti: "bg-slate-400 text-white shadow-slate-200",
};

const themeStyles = {
  blue: "border-blue-100 bg-blue-50/50 text-blue-600",
  purple: "border-purple-100 bg-purple-50/50 text-purple-600",
  orange: "border-orange-100 bg-orange-50/50 text-orange-600",
};

export default function MasterMekanikPencarian() {
  return (
    <div className="space-y-8 pb-20 px-4">
      {/* Header Eksklusif */}
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-10 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ">
            <div>
              <Badge className="bg-amber-500 text-slate-900 font-black mb-4 px-4 py-1 rounded-full">
                🏆 MEKANIK TERBAIK BULAN INI
              </Badge>
              <div className="flex items-center gap-6">
                <Avatar className="size-24 border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  <AvatarImage src={mechanics[0].avatar} />
                </Avatar>
                <div>
                  <h1 className="text-4xl font-black tracking-tight">
                    {mechanics[0].name}
                  </h1>
                  <p className="text-indigo-300 font-bold uppercase text-sm tracking-widest flex items-center gap-2 mt-1">
                    <Award className="size-4" /> Skor Performa:{" "}
                    {mechanics[0].score}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Unit Selesai",
                  val: "347",
                  icon: Target,
                  color: "text-blue-400",
                },
                {
                  label: "Avg Rating",
                  val: "4.8",
                  icon: Star,
                  color: "text-amber-400",
                },
                {
                  label: "Efisiensi",
                  val: "89%",
                  icon: Zap,
                  color: "text-emerald-400",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-md rounded-3xl p-4 border border-white/10 text-center"
                >
                  <s.icon className={`size-5 mx-auto mb-2 ${s.color}`} />
                  <p className="text-2xl font-black leading-none">{s.val}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Button className="bg-white text-indigo-600 hover:bg-slate-100 px-10 py-8 rounded-[2rem] font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 group">
            <Plus className="mr-2 size-6 stroke-[3] group-hover:rotate-90 transition-transform" />
            TEKNISI BARU
          </Button>
        </div>
      </div>

      {/* Control Center: Pencarian & Filter */}

      <div className="relative -mt-12 mx-auto max-w-5xl z-30">
        <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white shadow-2xl flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-indigo-500" />
            <Input
              className="w-full h-14 pl-14 pr-6 rounded-2xl border-none bg-indigo-50/50 focus-visible:ring-2 focus-visible:ring-indigo-400 font-bold text-slate-700 placeholder:text-indigo-300 transition-all"
              placeholder="Cari mekanik (nama, spesialisasi, atau ID)..."
            />
          </div>
          <div className="flex gap-3">
            <Button
              className="h-14 px-6 rounded-2xl border-indigo-100 bg-white text-indigo-600 font-bold hover:bg-indigo-50 gap-2"
              variant="outline"
            >
              <Filter className="size-5" />
              Filter Status
            </Button>
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 cursor-pointer hover:bg-indigo-700 transition-all">
              <Activity className="size-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Cepat */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {["Total: 12", "Tersedia: 8", "Sibuk: 3", "Istirahat: 1"].map(
          (stat, i) => (
            <Badge
              key={i}
              className="px-6 py-2 rounded-full font-black text-xs bg-white border border-slate-100 text-slate-600 shadow-sm"
              variant="secondary"
            >
              {stat}
            </Badge>
          ),
        )}
      </div>

      {/* Grid Kartu Mekanik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
        {mechanics.map((mec) => (
          <div
            key={mec.id}
            className="group relative bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden"
          >
            {/* Status Badge */}
            <div className="absolute top-8 right-8 z-20">
              <Badge
                className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border-none shadow-xl ${statusStyles[mec.status as keyof typeof statusStyles]}`}
              >
                {mec.status}
              </Badge>
            </div>

            <div className="p-10 pt-12">
              {/* Profile Section */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-4">
                  <div
                    className={`absolute inset-0 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity bg-indigo-600`}
                  />
                  <Avatar className="size-28 rounded-[2.5rem] border-8 border-white shadow-2xl relative z-10 transition-transform group-hover:scale-110 duration-500">
                    <AvatarImage src={mec.avatar} />
                    <AvatarFallback className="font-black text-2xl tracking-tighter">
                      {mec.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {mec.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 bg-slate-50 px-4 py-1 rounded-full border border-slate-100">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-black text-slate-700 text-sm">
                    {mec.rating}
                  </span>
                  <span className="text-slate-300 font-light">|</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {mec.id}
                  </span>
                </div>
              </div>

              {/* Box Spesialisasi Berwarna */}
              <div
                className={`rounded-[2rem] p-5 mb-8 border transition-all group-hover:scale-105 ${themeStyles[mec.theme as keyof typeof themeStyles]}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm">
                    <Wrench className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      Keahlian Utama
                    </p>
                    <p className="text-sm font-black italic">{mec.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Experience & Level */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex flex-col items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <Award className="size-4 text-indigo-500 mb-1" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    Level
                  </span>
                  <span className="text-xs font-black text-slate-700">
                    {mec.level}
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <Clock className="size-4 text-indigo-500 mb-1" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    Kerja
                  </span>
                  <span className="text-xs font-black text-slate-700">
                    {mec.experience}
                  </span>
                </div>
              </div>

              {/* Efficiency Progress */}
              <div className="space-y-4 bg-indigo-50/30 p-5 rounded-[2rem] border border-indigo-50">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="size-4 fill-current text-indigo-500" />{" "}
                    Efisiensi
                  </span>
                  <span className="text-sm font-black text-indigo-700">
                    {mec.efficiency}%
                  </span>
                </div>
                <Progress
                  className="h-3 rounded-full bg-white border border-indigo-100"
                  value={mec.efficiency}
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
              <Button
                className="size-14 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm"
                variant="ghost"
              >
                <Phone className="size-6" />
              </Button>
              <Button className="flex-1 h-14 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 text-lg group/btn">
                PROFIL{" "}
                <ChevronRight className="ml-2 size-5 group-hover/btn:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
