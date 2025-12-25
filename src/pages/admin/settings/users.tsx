import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  MoreHorizontal,
  Mail,
  Trash2,
  UserCog,
  ChevronRight,
  Filter,
  Download,
  Circle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  {
    id: "USR-001",
    name: "Agus Admin",
    email: "agus.admin@bengkel.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2 Menit yang lalu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
    color: "emerald",
  },
  {
    id: "USR-002",
    name: "Siska Kasir",
    email: "siska.billing@bengkel.com",
    role: "Cashier",
    status: "Active",
    lastLogin: "1 Jam yang lalu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska",
    color: "blue",
  },
  {
    id: "USR-003",
    name: "Doni Gudang",
    email: "doni.parts@bengkel.com",
    role: "Inventory",
    status: "Offline",
    lastLogin: "2 Hari yang lalu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Doni",
    color: "amber",
  },
];

export default function UserManagementTable() {
  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      {/* Header Cerah - Mint Gradient */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-xl shadow-emerald-100">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <Users className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Tim Operasional
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
              Management User
            </h1>
            <p className="text-emerald-50 font-medium opacity-90 italic">
              &quot;Kelola akses dan otoritas tim bengkel dalam satu
              tabel.&quot;
            </p>
          </div>
          <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-10 py-8 font-black text-lg shadow-xl rounded-full transition-all hover:scale-105 border-none">
            <UserPlus className="mr-2 size-6 stroke-3" /> TAMBAH USER
          </Button>
        </div>
      </div>

      {/* Kontrol & Filter Melayang */}
      <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-emerald-400" />
          <Input
            className="h-14 pl-14 pr-6 rounded-2xl border-none bg-emerald-50/30 font-bold text-slate-700 placeholder:text-emerald-300"
            placeholder="Cari tim berdasarkan nama atau email..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Filter size={18} /> Role
          </Button>
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Download size={18} /> Export
          </Button>
        </div>
      </div>

      {/* Tabel Utama Berwarna Cerah */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                User Profile
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Role & Authority
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Status
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Last Activity
              </th>
              <th className="px-8 py-6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="group hover:bg-emerald-50/30 transition-all"
              >
                {/* Kolom User */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="font-black text-xs">
                        {user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-black text-slate-800 leading-none mb-1">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <Mail className="text-emerald-400" size={10} />{" "}
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Kolom Role */}
                <td className="px-8 py-6">
                  <Badge
                    className={`rounded-xl px-4 py-1.5 border-emerald-100 bg-emerald-50 text-emerald-600 font-black text-[9px] uppercase tracking-wider`}
                    variant="outline"
                  >
                    <ShieldCheck className="mr-1.5" size={12} /> {user.role}
                  </Badge>
                </td>

                {/* Kolom Status */}
                <td className="px-8 py-6 text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.status === "Active" ? "text-emerald-500 bg-emerald-50" : "text-slate-400 bg-slate-50"}`}
                  >
                    <Circle fill="currentColor" size={8} /> {user.status}
                  </div>
                </td>

                {/* Kolom Last Activity */}
                <td className="px-8 py-6 text-right">
                  <p className="text-xs font-bold text-slate-600">
                    {user.lastLogin}
                  </p>
                  <p className="text-[10px] font-black text-slate-300 uppercase mt-0.5 tracking-widest">
                    {user.id}
                  </p>
                </td>

                {/* Kolom Aksi */}
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      className="size-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                      size="icon"
                      variant="ghost"
                    >
                      <UserCog size={18} />
                    </Button>
                    <Button
                      className="size-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 size={18} />
                    </Button>
                    <Button
                      className="size-10 rounded-xl text-slate-300"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal size={20} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Tabel - Pagination Info */}
        <div className="p-6 bg-slate-50/50 flex justify-between items-center border-t border-slate-50">
          <p className="text-xs font-bold text-slate-400 italic">
            Menampilkan {users.length} dari {users.length} pengguna terdaftar.
          </p>
          <Button
            className="text-xs font-black text-emerald-600 gap-2 hover:bg-emerald-50 rounded-xl"
            variant="ghost"
          >
            Lihat Selengkapnya <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
