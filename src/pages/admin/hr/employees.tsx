import React from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Briefcase,
  MoreVertical,
  Download,
  Filter,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const employees = [
  {
    id: "EMP-2025-001",
    name: "Agus Supriatna",
    role: "Senior Lead Mechanic",
    email: "agus.s@geminiauto.com",
    phone: "0812-3456-7890",
    joinDate: "12 Jan 2022",
    status: "Permanent",
    dept: "Workshop",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
  },
  {
    id: "EMP-2025-002",
    name: "Siska Putri",
    role: "Service Advisor",
    email: "siska.p@geminiauto.com",
    phone: "0857-1122-3344",
    joinDate: "05 Mar 2023",
    status: "Permanent",
    dept: "Front Office",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska",
  },
  {
    id: "EMP-2025-003",
    name: "Budi Hermawan",
    role: "Junior Mechanic",
    email: "budi.h@geminiauto.com",
    phone: "0899-8877-6655",
    joinDate: "20 Nov 2024",
    status: "Contract",
    dept: "Workshop",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      {/* Header - Vibrant Sky Blue */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-xl shadow-blue-100">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/20 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <Users className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Human Resources
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
              Database Karyawan
            </h1>
            <p className="text-blue-50 font-medium opacity-90 italic">
              &quot;Kelola informasi personil dan dokumen legalitas tim bengkel.&quot;
            </p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-8 rounded-full font-black text-lg shadow-xl border-none transition-all hover:scale-105 active:scale-95">
            <UserPlus className="mr-2 size-6 stroke-3" /> TAMBAH KARYAWAN
          </Button>
        </div>
      </div>

      {/* Stats Cards - Cerah & Clean */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Karyawan",
            val: "24 Orang",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Karyawan Tetap",
            val: "18 Orang",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Departemen",
            val: "4 Divisi",
            icon: Briefcase,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5"
          >
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-blue-400" />
          <Input
            className="h-14 pl-14 pr-6 rounded-2xl border-none bg-blue-50/30 font-bold text-slate-700 placeholder:text-blue-300"
            placeholder="Cari karyawan berdasarkan nama, ID, atau jabatan..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Filter size={18} /> Departemen
          </Button>
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50"
            variant="outline"
          >
            <Download size={18} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Karyawan
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Kontak
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Tipe
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Tanggal Masuk
                </th>
                <th className="px-8 py-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="group hover:bg-blue-50/30 transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-14 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback>
                          {emp.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-slate-800 text-lg leading-tight">
                          {emp.name}
                        </p>
                        <p className="text-xs font-bold text-blue-500 mt-1">
                          {emp.role}
                        </p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          {emp.dept}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Mail className="text-slate-300" size={14} />{" "}
                        {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Phone className="text-slate-300" size={14} />{" "}
                        {emp.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Badge
                      className={`rounded-lg px-3 py-1 font-black text-[9px] uppercase border-none
                      ${emp.status === "Permanent" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                    >
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-slate-700">
                      {emp.joinDate}
                    </p>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                      {emp.id}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button
                      className="rounded-full hover:bg-white hover:shadow-md text-slate-300 hover:text-blue-600"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreVertical size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
          <p className="text-xs font-bold text-slate-400">
            Menampilkan 3 dari 24 Karyawan
          </p>
          <div className="flex gap-2">
            <Button
              className="rounded-xl font-black text-xs px-6 py-4 border-slate-100"
              variant="outline"
            >
              SEBELUMNYA
            </Button>
            <Button className="rounded-xl font-black text-xs px-6 py-4 bg-blue-600 text-white shadow-lg shadow-blue-100">
              SELANJUTNYA
            </Button>
          </div>
        </div>
      </div>

      {/* Info Alert - Soft Blue */}
      <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-[2rem] flex items-center gap-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-500">
          <CheckCircle2 size={24} />
        </div>
        <p className="text-sm font-bold text-blue-800 italic">
          &quot;Pastikan semua dokumen kontrak karyawan telah diperbarui di sistem
          untuk kepatuhan administrasi.&quot;
        </p>
      </div>
    </div>
  );
}
