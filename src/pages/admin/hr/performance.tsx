import React from "react";
import {
  TrendingUp,
  Star,
  Award,
  Filter,
  ChevronRight,
  Zap,
  ThumbsUp,
  AlertCircle,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const performanceData = [
  {
    id: "EMP-001",
    name: "Agus Supriatna",
    role: "Senior Mechanic",
    rating: 4.9,
    completedTasks: 145, // Unit mobil yang diservis bulan ini
    onTimeRate: 98,
    kpiScore: 95,
    status: "Excellent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
  },
  {
    id: "EMP-003",
    name: "Budi Hermawan",
    role: "Junior Mechanic",
    rating: 4.5,
    completedTasks: 110,
    onTimeRate: 85,
    kpiScore: 82,
    status: "Good",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: "EMP-005",
    name: "Dedi Irawan",
    role: "Mechanic",
    rating: 3.8,
    completedTasks: 85,
    onTimeRate: 70,
    kpiScore: 65,
    status: "Need Improvement",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi",
  },
];

export default function PerformancePage() {
  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      {/* Header - Vibrant Amber Gradient */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-xl shadow-amber-100">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <Award className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Talent Management
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase text-white">
              Penilaian Kinerja
            </h1>
            <p className="text-amber-50 font-medium opacity-90 italic">
              &quot;Analisis produktivitas dan evaluasi kualitas kerja tim bengkel.&quot;
            </p>
          </div>
          <Button className="bg-white text-orange-600 hover:bg-amber-50 px-10 py-8 rounded-full font-black text-lg shadow-xl border-none transition-all hover:scale-105 active:scale-95 group">
            <Trophy className="mr-2 size-6 group-hover:rotate-12 transition-transform" />{" "}
            RANKING TIM
          </Button>
        </div>
      </div>

      {/* Top 3 Performers Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {performanceData.slice(0, 3).map((staff, index) => (
          <div
            key={staff.id}
            className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden group hover:border-amber-300 transition-all"
          >
            <div className="absolute top-0 right-0 bg-amber-500 text-white px-6 py-2 rounded-bl-[2rem] font-black italic">
              #{index + 1}
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="size-24 border-4 border-amber-50 shadow-lg">
                  <AvatarImage src={staff.avatar} />
                  <AvatarFallback>{staff.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md text-amber-500">
                  <Star fill="currentColor" size={16} />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {staff.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {staff.role}
                </p>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                <div className="text-center border-r border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Servis Selesai
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    {staff.completedTasks} Unit
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    KPI Score
                  </p>
                  <p className="text-lg font-black text-emerald-600">
                    {staff.kpiScore}%
                  </p>
                </div>
              </div>

              <div className="w-full space-y-2 pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400 tracking-widest">
                    Kepuasan Pelanggan
                  </span>
                  <span className="text-amber-600">{staff.rating}/5.0</span>
                </div>
                <Progress
                  className="h-2 bg-slate-50 text-amber-500"
                  value={(staff.rating / 5) * 100}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Detailed Evaluation */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <TrendingUp className="text-orange-500" /> Detail Evaluasi Karyawan
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              className="rounded-xl border-slate-100 bg-slate-50 font-bold text-xs w-full md:w-64"
              placeholder="Cari nama..."
            />
            <Button
              className="rounded-xl border-slate-100 text-slate-400"
              variant="outline"
            >
              <Filter size={18} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Karyawan
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  On-Time Rate
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Rekomendasi
                </th>
                <th className="px-8 py-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {performanceData.map((staff) => (
                <tr
                  key={staff.id}
                  className="group hover:bg-slate-50 transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-slate-100 rounded-full overflow-hidden">
                        <img alt={staff.name} src={staff.avatar} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">
                          {staff.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {staff.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-sm font-black ${staff.onTimeRate >= 90 ? "text-emerald-500" : "text-amber-500"}`}
                      >
                        {staff.onTimeRate}%
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${staff.onTimeRate >= 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${staff.onTimeRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Badge
                      className={`rounded-lg px-3 py-1 font-black text-[9px] uppercase border-none
                      ${
                        staff.status === "Excellent"
                          ? "bg-emerald-100 text-emerald-600"
                          : staff.status === "Good"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {staff.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      {staff.status === "Excellent" ? (
                        <>
                          <Zap className="text-amber-500" size={14} /> Promosi /
                          Bonus
                        </>
                      ) : staff.status === "Good" ? (
                        <>
                          <ThumbsUp className="text-blue-500" size={14} />{" "}
                          Pertahankan
                        </>
                      ) : (
                        <>
                          <AlertCircle className="text-rose-500" size={14} />{" "}
                          Training Tambahan
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button
                      className="rounded-xl text-slate-300 hover:text-orange-500"
                      size="icon"
                      variant="ghost"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Card */}
      <div className="bg-primary rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-300">
        <div className="flex items-center gap-6">
          <div className="size-20 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
            <Award size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Bonus Performa Siap!
            </h3>
            <p className="text-slate-400 font-medium italic">
              &quot;Ada 3 karyawan dengan skor di atas 90% yang berhak menerima
              insentif bulan ini.&quot;
            </p>
          </div>
        </div>
        <Button className="bg-white text-slate-900 hover:bg-amber-400 hover:text-white px-10 py-8 rounded-2xl font-black text-lg transition-all border-none">
          PROSES BONUS <TrendingUp className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
