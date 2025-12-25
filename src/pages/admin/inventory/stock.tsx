import {
  Search,
  Plus,
  Package,
  AlertCircle,
  Filter,
  ArrowUpDown,
  Edit3,
  Trash2,
  History,
  MoreHorizontal,
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

const inventoryData = [
  {
    id: "SPR-001",
    name: "Oli Shell Helix HX7 1L",
    category: "Pelumas",
    stock: 45,
    minStock: 10,
    unit: "Botol",
    price: 95000,
  },
  {
    id: "SPR-002",
    name: "Kampas Rem Depan Avanza",
    category: "Sparepart",
    stock: 4,
    minStock: 5,
    unit: "Set",
    price: 150000,
  },
  {
    id: "SPR-003",
    name: "Filter Udara Honda Jazz",
    category: "Sparepart",
    stock: 0,
    minStock: 3,
    unit: "Pcs",
    price: 75000,
  },
  {
    id: "SPR-004",
    name: "Busi NGK Iridium",
    category: "Aksesoris",
    stock: 24,
    minStock: 12,
    unit: "Pcs",
    price: 45000,
  },
];

export default function StokBarang() {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="size-6 text-primary" />
            Inventaris Sparepart
          </h1>
          <p className="text-sm text-slate-500">
            Kelola stok, harga, dan kategori barang bengkel Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" size="sm" variant="outline">
            <History className="size-4" /> Log Stok
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20" size="sm">
            <Plus className="size-4" /> Tambah Barang
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Total Item
            </p>
            <p className="text-xl font-bold text-slate-900">
              1,240{" "}
              <span className="text-xs font-normal text-slate-400 font-mono">
                SKU
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm border-l-4 border-l-amber-500 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Stok Menipis
            </p>
            <p className="text-xl font-bold text-amber-600">
              12{" "}
              <span className="text-xs font-normal opacity-70 italic">
                Perlu Order
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <ArrowUpDown size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Nilai Inventaris
            </p>
            <p className="text-xl font-bold text-slate-900">
              {formatIDR(145000000)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Table Area */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Cari nama barang atau kode SKU..."
            />
          </div>
          <div className="flex gap-2">
            <SelectCategory />
            <Button size="icon" variant="outline">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Info Barang</th>
              <th className="p-4 text-center">Stok</th>
              <th className="p-4">Kategori</th>
              <th className="p-4 text-right">Harga Jual</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventoryData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
                    {item.id}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="font-semibold text-slate-700">
                    {item.stock}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">
                      {item.unit}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 italic">
                    Min. {item.minStock}
                  </div>
                </td>
                <td className="p-4">
                  <Badge
                    className="font-medium text-[10px] uppercase"
                    variant="secondary"
                  >
                    {item.category}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <div className="font-bold text-slate-900">
                    {formatIDR(item.price)}
                  </div>
                </td>
                <td className="p-4 text-center">
                  {item.stock === 0 ? (
                    <Badge
                      className="text-[10px] animate-pulse"
                      variant="destructive"
                    >
                      Kosong
                    </Badge>
                  ) : item.stock <= item.minStock ? (
                    <Badge className="bg-amber-500 text-[10px] hover:bg-amber-600">
                      Menipis
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500 text-[10px] hover:bg-emerald-600">
                      Aman
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="size-8" size="icon" variant="ghost">
                        <MoreHorizontal className="size-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer gap-2">
                        <Edit3 className="size-4" /> Edit Barang
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2">
                        <Plus className="size-4" /> Tambah Stok
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer gap-2">
                        <Trash2 className="size-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Komponen Pembantu untuk UI yang lebih clean
function SelectCategory() {
  return (
    <div className="flex p-1 bg-slate-100 rounded-lg">
      <button className="px-3 py-1 text-xs font-bold rounded-md bg-white shadow-sm">
        Semua
      </button>
      <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">
        Sparepart
      </button>
      <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">
        Oli
      </button>
    </div>
  );
}
