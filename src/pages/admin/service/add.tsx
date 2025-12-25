import { Car, User, Wrench, ClipboardCheck, Save, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PendaftaranServis() {
  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Pendaftaran Servis Baru
          </h1>
          <p className="text-slate-500">
            Input data kendaraan dan keluhan pelanggan untuk pembuatan Work
            Order.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            No. Antrean
          </span>
          <p className="text-3xl font-black text-primary">#A-124</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Data Pemilik */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold">
              <User className="size-5" />
              <h2>Informasi Pelanggan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Nama Pelanggan</Label>
                <div className="relative">
                  <Input
                    className="pr-10"
                    id="customer"
                    placeholder="Cari atau masukkan nama..."
                  />
                  <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon / WA</Label>
                <Input id="phone" placeholder="0812..." type="tel" />
              </div>
            </div>
          </div>

          {/* Section 2: Data Kendaraan */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold">
              <Car className="size-5" />
              <h2>Detail Kendaraan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nomor Polisi</Label>
                <Input
                  className="uppercase font-bold text-lg"
                  placeholder="B 1234 ABC"
                />
              </div>
              <div className="space-y-2">
                <Label>Merk / Tipe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kendaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avanza">Toyota Avanza</SelectItem>
                    <SelectItem value="xpander">Mitsubishi Xpander</SelectItem>
                    <SelectItem value="civic">Honda Civic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kilometer (KM)</Label>
                <Input placeholder="Contoh: 50000" type="number" />
              </div>
            </div>
          </div>

          {/* Section 3: Keluhan & Layanan */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold">
              <Wrench className="size-5" />
              <h2>Keluhan & Jenis Servis</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Layanan</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Ganti Oli", "Tune Up", "Servis Rutin", "Rem & Kaki"].map(
                    (service) => (
                      <Button
                        key={service}
                        className="text-xs py-1 h-auto hover:bg-primary hover:text-white"
                        variant="outline"
                      >
                        {service}
                      </Button>
                    ),
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi Keluhan</Label>
                <Textarea
                  className="min-h-30"
                  placeholder="Contoh: Rem bunyi saat diinjak, AC tidak dingin..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Ringkasan & Action */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-bold border-b border-white/10 pb-3 flex items-center gap-2">
              <ClipboardCheck className="size-5" />
              Ringkasan Order
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between opacity-80">
                <span>Estimasi Waktu</span>
                <span>2 - 3 Jam</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Prioritas</span>
                <span className="text-amber-400">Normal</span>
              </div>
              <div className="pt-3 border-t border-white/10 space-y-2">
                <Label className="text-xs">Pilih Mekanik (Opsional)</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Auto Assign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budi">Budi (Mekanik A)</SelectItem>
                    <SelectItem value="agus">Agus (Mekanik B)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-red-600 text-white font-bold h-12 shadow-lg shadow-primary/20">
              <Save className="mr-2 size-4" />
              Simpan Work Order
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Tips:</strong> Pastikan Anda telah memeriksa barang
              berharga di dalam kendaraan sebelum memulai servis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
