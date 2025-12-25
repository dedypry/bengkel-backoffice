import React from "react";
import {
  Clock,
  CalendarCheck,
  MapPin,
  UserCheck,
  UserX,
  Coffee,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const attendanceData = [
  {
    id: "EMP-001",
    name: "Agus Supriatna",
    role: "Senior Mechanic",
    checkIn: "07:55",
    checkOut: "17:05",
    status: "On Time",
    location: "Bengkel Utama",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
  },
  {
    id: "EMP-002",
    name: "Siska Putri",
    role: "Front Office",
    checkIn: "08:15",
    checkOut: "-",
    status: "Late",
    location: "Front Desk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska",
  },
  {
    id: "EMP-004",
    name: "Rian Hidayat",
    role: "Mechanic",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    location: "-",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rian",
  },
];

export default function AttendancePage() {
  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      {/* Header - Vibrant Emerald */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-xl shadow-emerald-100">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <Clock className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Live Monitoring
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
              Absensi Staf
            </h1>
            <p className="text-emerald-50 font-medium opacity-90 italic">
              &quot;Pantau kehadiran, ketepatan waktu, dan jam kerja tim Anda.&quot;
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-8 rounded-full font-black text-lg shadow-xl border-none transition-all">
              REKAP BULANAN
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Monitor Kehadiran Hari Ini */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Hadir",
            val: "21",
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Terlambat",
            val: "2",
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Izin/Sakit",
            val: "1",
            icon: Coffee,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Tanpa Keterangan",
            val: "0",
            icon: UserX,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4"
          >
            <div
              className={`${stat.bg} ${stat.color} size-12 rounded-2xl flex items-center justify-center`}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-slate-800">
                {stat.val}
                <span className="text-sm text-slate-300 ml-1">Staf</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Kontrol Kalender & Filter */}
      <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <Button
            className="text-emerald-600 hover:bg-white rounded-full"
            size="icon"
            variant="ghost"
          >
            <ChevronLeft />
          </Button>
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Kamis
            </span>
            <span className="text-sm font-black text-slate-800">
              25 Des 2025
            </span>
          </div>
          <Button
            className="text-emerald-600 hover:bg-white rounded-full"
            size="icon"
            variant="ghost"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-emerald-400" />
          <Input
            className="h-14 pl-14 pr-6 rounded-2xl border-none bg-emerald-50/30 font-bold text-slate-700"
            placeholder="Cari nama karyawan..."
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50"
            variant="outline"
          >
            <Filter className="mr-2" size={18} /> Filter
          </Button>
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50"
            variant="outline"
          >
            <Download size={18} />
          </Button>
        </div>
      </div>

      {/* Tabel Absensi */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Karyawan
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Masuk
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Keluar
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Lokasi
                </th>
                <th className="px-8 py-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceData.map((att) => (
                <tr
                  key={att.id}
                  className="group hover:bg-emerald-50/30 transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-12 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={att.avatar} />
                        <AvatarFallback>
                          {att.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-slate-800 leading-tight">
                          {att.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {att.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-black text-slate-700">
                      {att.checkIn}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-black text-slate-700">
                      {att.checkOut}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <Badge
                      className={`rounded-lg px-3 py-1 font-black text-[9px] uppercase border-none
                      ${
                        att.status === "On Time"
                          ? "bg-emerald-100 text-emerald-600"
                          : att.status === "Late"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {att.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MapPin className="text-emerald-400" size={12} />{" "}
                      {att.location}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button
                      className="rounded-xl text-slate-300 hover:text-emerald-600 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
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
      </div>

      {/* Info Legend - Ringkasan Peraturan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
          <div className="bg-emerald-500 text-white p-4 rounded-3xl shadow-lg shadow-emerald-100">
            <CalendarCheck size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-800">
              Review Kehadiran
            </h4>
            <p className="text-xs text-slate-500 font-medium italic">
              &quot;Semua staf mekanik hadir tepat waktu hari ini. Berikan
              apresiasi saat briefing!&quot;
            </p>
          </div>
        </div>
        <div className="bg-amber-50 border-2 border-dashed border-amber-200 p-8 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl text-amber-600">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-900">
                Perlu Verifikasi
              </h4>
              <p className="text-[10px] font-bold text-amber-700 uppercase">
                2 Karyawan lupa check-out kemarin
              </p>
            </div>
          </div>
          <Button className="bg-amber-600 text-white font-black text-[10px] rounded-xl px-6">
            PERIKSA
          </Button>
        </div>
      </div>
    </div>
  );
}
