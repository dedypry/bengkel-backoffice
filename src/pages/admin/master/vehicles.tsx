import {
  Search,
  Car,
  User,
  Settings2,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  History,
  Fuel,
  Cpu,
  ShieldCheck,
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

const vehicles = [
  {
    id: "VH-001",
    plate: "B 1234 GHO",
    brand: "Toyota",
    model: "Avanza G",
    year: "2021",
    owner: "Budi Santoso",
    transmission: "Automatic",
    fuel: "Petrol",
    color: "Silver Metallic",
    lastService: "15 Des 2025",
  },
  {
    id: "VH-002",
    plate: "D 9999 RS",
    brand: "Honda",
    model: "Civic Turbo",
    year: "2023",
    owner: "Lani Wijaya",
    transmission: "CVT",
    fuel: "Petrol",
    color: "Rallye Red",
    lastService: "01 Nov 2025",
  },
  {
    id: "VH-003",
    plate: "F 4567 JK",
    brand: "Mitsubishi",
    model: "Xpander Ultimate",
    year: "2022",
    owner: "Rian Hidayat",
    transmission: "Manual",
    fuel: "Petrol",
    color: "Quartz White",
    lastService: "20 Okt 2025",
  },
];

export default function MasterVehicles() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Car className="size-6 text-primary" />
            Database Kendaraan
          </h1>
          <p className="text-sm text-slate-500">
            Kelola spesifikasi unit dan histori pengerjaan kendaraan.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="size-4" /> Tambah Unit Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Cari Plat Nomor, Tipe Mobil, atau Pemilik..."
          />
        </div>
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-primary/20">
          <option>Semua Brand</option>
          <option>Toyota</option>
          <option>Honda</option>
          <option>Mitsubishi</option>
        </select>
        <Button className="gap-2" variant="outline">
          <Settings2 className="size-4" /> Filter Lanjut
        </Button>
      </div>

      {/* Vehicle Grid/Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-xs uppercase font-bold text-slate-500">
              <th className="p-4">Identitas Kendaraan</th>
              <th className="p-4">Pemilik (Owner)</th>
              <th className="p-4">Spesifikasi</th>
              <th className="p-4">Update Terakhir</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles.map((vh) => (
              <tr
                key={vh.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-md font-mono font-black text-sm tracking-widest border-2 border-slate-700 shadow-sm">
                      {vh.plate}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">
                        {vh.brand} {vh.model}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {vh.year} • {vh.color}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="size-3.5 text-slate-400" />
                    {vh.owner}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      className="text-[10px] font-medium bg-slate-100 text-slate-600"
                      variant="secondary"
                    >
                      <Cpu className="size-3 mr-1" /> {vh.transmission}
                    </Badge>
                    <Badge
                      className="text-[10px] font-medium bg-slate-100 text-slate-600"
                      variant="secondary"
                    >
                      <Fuel className="size-3 mr-1" /> {vh.fuel}
                    </Badge>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <History className="size-3.5 text-slate-400" />
                    {vh.lastService}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="size-3" /> VERIFIED
                  </div>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="size-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Opsi Kendaraan</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2">
                        <History className="size-4" /> Riwayat Servis
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="size-4" /> Edit Data Unit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                        <Trash2 className="size-4" /> Hapus Kendaraan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-sm">
        <span className="text-slate-500 italic">
          Total 2,840 kendaraan terdaftar dalam sistem.
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Previous
          </Button>
          <Button size="sm" variant="outline">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
