import React from "react";
import {
  CalendarDays,
  Plus,
  Filter,
  MoreVertical,
  Sun,
  Moon,
  Sunset,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const shiftTypes = [
  {
    name: "Shift Pagi",
    time: "08:00 - 16:00",
    icon: Sun,
    color: "bg-amber-100 text-amber-600 border-amber-200",
  },
  {
    name: "Shift Siang",
    time: "12:00 - 20:00",
    icon: Sunset,
    color: "bg-orange-100 text-orange-600 border-orange-200",
  },
  {
    name: "Shift Full",
    time: "08:00 - 20:00",
    icon: Moon,
    color: "bg-violet-100 text-violet-600 border-violet-200",
  },
];

const weeklyShifts = [
  { day: "Senin", date: "22 Des", shifts: { pagi: 4, siang: 2, full: 1 } },
  { day: "Selasa", date: "23 Des", shifts: { pagi: 3, siang: 3, full: 1 } },
  { day: "Rabu", date: "24 Des", shifts: { pagi: 5, siang: 2, full: 0 } },
  {
    day: "Kamis",
    date: "25 Des",
    shifts: { pagi: 4, siang: 2, full: 2 },
    active: true,
  },
  { day: "Jumat", date: "26 Des", shifts: { pagi: 3, siang: 4, full: 1 } },
  { day: "Sabtu", date: "27 Des", shifts: { pagi: 6, siang: 2, full: 2 } },
  { day: "Minggu", date: "28 Des", shifts: { pagi: 2, siang: 2, full: 4 } },
];

const staffShifts = [
  {
    id: "EMP-001",
    name: "Agus Supriatna",
    role: "Mechanic",
    shift: "Shift Pagi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
  },
  {
    id: "EMP-002",
    name: "Siska Putri",
    role: "Front Office",
    shift: "Shift Pagi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska",
  },
  {
    id: "EMP-003",
    name: "Budi Hermawan",
    role: "Mechanic",
    shift: "Shift Siang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: "EMP-005",
    name: "Dedi Irawan",
    role: "Senior Mechanic",
    shift: "Shift Full",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi",
  },
];

export default function ShiftsPage() {
  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      {/* Header - Soft Violet Gradient */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-xl shadow-violet-100">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <CalendarDays className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Work Scheduling
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
              Jadwal Shift Tim
            </h1>
            <p className="text-violet-50 font-medium opacity-90 italic">
              &quot;Atur distribusi personil untuk pelayanan bengkel yang
              maksimal.&quot;
            </p>
          </div>
          <Button className="bg-white text-orange-600 hover:bg-amber-50 px-10 py-8 rounded-full font-black text-lg shadow-xl border-none transition-all hover:scale-105 active:scale-95 group">
            <Plus className="mr-2 size-6 group-hover:rotate-12 transition-transform" />{" "}
            BUAT JADWAL
          </Button>
        </div>
      </div>

      {/* Shift Types Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shiftTypes.map((type, i) => (
          <div
            key={i}
            className={`p-6 rounded-[2rem] border-2 flex items-center gap-4 bg-white shadow-sm ${type.color.split(" ")[2]}`}
          >
            <div
              className={`p-3 rounded-2xl ${type.color.split(" ")[0]} ${type.color.split(" ")[1]}`}
            >
              <type.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">{type.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {type.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Planner View */}

      {/* Staff Duty List Today */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              Personil Bertugas (Hari Ini)
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Kamis, 25 Desember 2025
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              className="rounded-xl border-slate-100 bg-slate-50 font-bold text-xs"
              placeholder="Cari nama..."
            />
            <Button
              className="rounded-xl border-slate-100 text-slate-400 hover:bg-slate-50"
              variant="outline"
            >
              <Filter size={18} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Karyawan
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Jabatan
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Penugasan Shift
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Jam Kerja
                </th>
                <th className="px-8 py-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staffShifts.map((staff) => {
                const type = shiftTypes.find((t) => t.name === staff.shift);

                return (
                  <tr
                    key={staff.id}
                    className="group hover:bg-violet-50/20 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-10 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                          <AvatarImage src={staff.avatar} />
                          <AvatarFallback>
                            {staff.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-black text-slate-800 text-sm">
                          {staff.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge
                        className="text-[10px] font-bold text-slate-400 uppercase border-none p-0"
                        variant="secondary"
                      >
                        {staff.role}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-black text-[9px] uppercase border ${type?.color}`}
                      >
                        {type && <type.icon size={12} />}
                        {staff.shift}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-600 text-sm">
                      {type?.time}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Button
                        className="rounded-xl text-slate-300 hover:text-violet-600"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreVertical size={20} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info - Resource Management */}
      <div className="bg-violet-50 border-2 border-dashed border-violet-200 p-8 rounded-[3rem] flex items-center gap-6">
        <div className="bg-white p-4 rounded-3xl shadow-lg shadow-violet-100 text-violet-500">
          <Info size={32} />
        </div>
        <div>
          <h4 className="text-lg font-black text-violet-900">
            Catatan Kapasitas Tim
          </h4>
          <p className="text-sm text-violet-700/80 font-medium italic">
            &quot;Hari Sabtu diprediksi akan ramai (Peak Day). Pastikan minimal
            ada 6 mekanik di Shift Pagi untuk menghindari antrian panjang.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
