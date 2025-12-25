import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Car,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const customers = [
  {
    id: "CUST-001",
    name: "Budi Santoso",
    email: "budi.s@gmail.com",
    phone: "0812-3456-7890",
    address: "Jl. Merdeka No. 10, Jakarta",
    joinDate: "12 Jan 2024",
    totalVehicles: 2,
    status: "Active",
  },
  {
    id: "CUST-002",
    name: "Lani Wijaya",
    email: "lani.w@yahoo.com",
    phone: "0857-9988-1122",
    address: "Komp. Hijau Permai B3, Bekasi",
    joinDate: "05 Mar 2024",
    totalVehicles: 1,
    status: "Active",
  },
  {
    id: "CUST-003",
    name: "Hendra Kurniawan",
    email: "hendra.k@outlook.com",
    phone: "0813-1122-3344",
    address: "Apartemen Mediterania Unit 12A",
    joinDate: "20 Nov 2023",
    totalVehicles: 3,
    status: "Inactive",
  },
];

export default function MasterPelanggan() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="size-6 text-primary" />
            Database Pelanggan
          </h1>
          <p className="text-sm text-slate-500">
            Kelola informasi kontak dan profil pemilik kendaraan.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <UserPlus className="size-4" /> Tambah Pelanggan Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Cari nama, email, atau nomor telepon..."
          />
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            Status: Semua
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-xs uppercase font-bold text-slate-500">
              <th className="p-4">Profil Pelanggan</th>
              <th className="p-4">Kontak</th>
              <th className="p-4">Alamat</th>
              <th className="p-4 text-center">Unit Kendaraan</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`}
                      />
                      <AvatarFallback>
                        {customer.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-slate-800">
                        {customer.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {customer.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail className="size-3 text-slate-400" />{" "}
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Phone className="size-3 text-emerald-500" />{" "}
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-start gap-1 max-w-[200px]">
                    <MapPin className="size-3 text-slate-400 mt-1 shrink-0" />
                    <span className="text-xs text-slate-500 line-clamp-2">
                      {customer.address}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    <Car className="size-3" />
                    {customer.totalVehicles} Unit
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Badge
                    className={
                      customer.status === "Active"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "opacity-50"
                    }
                    variant={
                      customer.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {customer.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Opsi Pelanggan</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2">
                        <ExternalLink className="size-4" /> Detail & Riwayat
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="size-4" /> Edit Profil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                        <Trash2 className="size-4" /> Hapus Data
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900">
              Total Pelanggan Terdaftar
            </p>
            <p className="text-xs text-indigo-700">
              Meningkat 15% dibandingkan bulan lalu.
            </p>
          </div>
        </div>
        <h2 className="text-3xl font-black text-indigo-900 pr-4">1,402</h2>
      </div>
    </div>
  );
}
