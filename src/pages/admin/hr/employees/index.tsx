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
import HeaderAction from "@/components/header-action";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/utils/helpers/global";

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
      <HeaderAction
        actionIcon={UserPlus}
        actionTitle="Tambah Karyawan"
        leadIcon={Users}
        subtitle="Kelola informasi personil dan dokumen legalitas timbengkel."
        title="Database Karyawan"
        onAction={() => {}}
      />

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
          <Card key={i} className=" shadow-lg shadow-gray-100">
            <CardContent className="flex gap-5 items-center">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <CardAction>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-800">{stat.val}</p>
              </CardAction>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <Card className="shadow-lg shadow-gray-200">
        <CardContent className="flex gap-2">
          <div className="flex-1 flex gap-2 relative">
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
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="shadow-gray-100 shadow-lg">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Tanggal Masuk</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="size-14 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-slate-800 text-mg leading-tight">
                          {emp.name}
                        </p>
                        <p className="text-xs font-bold text-blue-500 mt-1">
                          {emp.role}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {emp.dept}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Mail className="text-slate-500" size={14} />{" "}
                        {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Phone className="text-slate-500" size={14} />{" "}
                        {emp.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-lg px-3 py-1 font-black text-[9px] uppercase border-none
                      ${emp.status === "Permanent" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-black text-slate-700">
                      {emp.joinDate}
                    </p>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {emp.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="rounded-full hover:bg-white hover:shadow-md text-slate-300 hover:text-blue-600"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreVertical size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Alert - Soft Blue */}
      <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-[2rem] flex items-center gap-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-500">
          <CheckCircle2 size={24} />
        </div>
        <p className="text-sm font-bold text-blue-800 italic">
          &quot;Pastikan semua dokumen kontrak karyawan telah diperbarui di
          sistem untuk kepatuhan administrasi.&quot;
        </p>
      </div>
    </div>
  );
}
