import {
  Plus,
  Search,
  Layers,
  Edit3,
  Trash2,
  MoreVertical,
  Package,
  ChevronRight,
  Tags,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  {
    id: 1,
    name: "Pelumas & Oli",
    slug: "pelumas-oli",
    itemCount: 45,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Suku Cadang Mesin",
    slug: "sparepart-mesin",
    itemCount: 128,
    color: "bg-red-500",
  },
  {
    id: 3,
    name: "Ban & Velg",
    slug: "ban-velg",
    itemCount: 32,
    color: "bg-slate-800",
  },
  {
    id: 4,
    name: "Aksesoris",
    slug: "aksesoris",
    itemCount: 64,
    color: "bg-emerald-500",
  },
  {
    id: 5,
    name: "Sistem Pengereman",
    slug: "pengereman",
    itemCount: 12,
    color: "bg-amber-500",
  },
];

export default function KategoriProduk() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tags className="size-6 text-primary" />
            Kategori Produk
          </h1>
          <p className="text-sm text-slate-500">
            Kelola pengelompokan produk untuk mempermudah pencarian stok.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="size-4" /> Tambah Kategori
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input className="pl-10" placeholder="Cari nama kategori..." />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 px-2">
          <Layers className="size-4" />
          <span>
            Total: <strong>{categories.length}</strong> Kategori
          </span>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group bg-white rounded-2xl border p-5 hover:border-primary/50 hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Dekorasi Aksen Warna */}
            <div
              className={`absolute top-0 right-0 w-2 h-full ${cat.color} opacity-20`}
            />

            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl ${cat.color} text-white shadow-lg`}
              >
                <Package size={20} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="size-8" size="icon" variant="ghost">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Edit3 size={14} /> Edit Kategori
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
                    <Trash2 size={14} /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono italic">
                /{cat.slug}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Total Produk
                </span>
                <span className="text-lg font-black text-slate-700">
                  {cat.itemCount}
                </span>
              </div>
              <Button
                className="rounded-full group-hover:bg-primary group-hover:text-white transition-colors"
                size="sm"
                variant="secondary"
              >
                Detail <ChevronRight className="ml-1" size={14} />
              </Button>
            </div>
          </div>
        ))}

        {/* Empty / Add New Card State */}
        <button className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-primary/50 hover:text-primary transition-all gap-2 min-h-[180px]">
          <div className="p-3 bg-slate-50 rounded-full">
            <Plus size={24} />
          </div>
          <span className="font-bold text-sm">Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
        <div className="text-amber-600">
          <Layers size={20} />
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Catatan Pengelola:</strong> Menghapus kategori yang masih
          memiliki produk aktif akan menyebabkan produk tersebut masuk ke
          kategori <i>&quot;Tanpa Kategori&quot;</i>. Pastikan kategori kosong
          sebelum dihapus.
        </p>
      </div>
    </div>
  );
}
