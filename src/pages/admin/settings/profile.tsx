/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  User,
  TicketPercent,
  ShieldCheck,
  Camera,
  Plus,
  ChevronRight,
  Save,
  Gift,
  Timer,
  Tag,
  Store,
  MapPin,
  Smartphone,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsProfile() {
  return (
    <div className="space-y-10 pb-20 px-4 bg-slate-50/20">
      {/* Header Azure Blue */}
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-10 text-white shadow-2xl shadow-blue-100">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
            Pengaturan
          </h1>
          <p className="text-blue-50 font-medium opacity-90 italic">
            &quot;Kelola profil bengkel dan strategi promosi Anda.&quot;
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12 relative z-20">
        {/* Kolom Kiri: Profil & Keamanan */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card Profil */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border-2 border-blue-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <User size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                Profil Bengkel
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="relative group mx-auto md:mx-0">
                <Avatar className="size-40 border-8 border-slate-50 shadow-xl">
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=GeminiAuto" />
                  <AvatarFallback className="font-black text-4xl">
                    GA
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Camera size={20} />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nama Bengkel
                  </label>
                  <Input
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                    defaultValue="Gemini Auto Service"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email Bisnis
                  </label>
                  <Input
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                    defaultValue="contact@geminiauto.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Alamat Lengkap
                  </label>
                  <Input
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                    defaultValue="Jl. Raya Industri No. 123, Bekasi Barat"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card Pengaturan Promo (FITUR BARU) */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50  border-2 border-blue-100">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                  <TicketPercent size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    Manajemen Promo
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    Buat penawaran menarik untuk pelanggan.
                  </p>
                </div>
              </div>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-black px-6 shadow-lg shadow-pink-100">
                <Plus className="mr-2 size-4" /> PROMO BARU
              </Button>
            </div>

            <div className="space-y-4">
              {/* Item Promo 1 */}
              <div className="group p-6 rounded-[2.5rem] border-2 border-dashed border-pink-100 hover:border-pink-300 transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="size-16 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-600 font-black text-xl">
                    <Gift size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                        Gajian Seru Desember
                      </h4>
                      <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[9px]">
                        AKTIF
                      </Badge>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Tag size={12} /> Diskon 20% Jasa
                      </span>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Timer size={12} /> Sisa 5 Hari
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={true} />
                  <Button className="rounded-full" size="icon" variant="ghost">
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>

              {/* Item Promo 2 */}
              <div className="group p-6 rounded-[2.5rem] border-2 border-slate-50 hover:border-slate-200 transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="size-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400">
                    <Store size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-400 text-lg uppercase tracking-tight">
                      Grand Opening Promo
                    </h4>
                    <p className="text-xs font-bold text-slate-300 italic">
                      Berakhir pada 20 Nov 2025
                    </p>
                  </div>
                </div>
                <Badge
                  className="text-slate-300 border-slate-200 uppercase font-black"
                  variant="outline"
                >
                  Expired
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Sidebar Info & Simpan */}
        <div className="space-y-8">
          {/* Quick Actions Card */}
          <div className="bg-blue-50/50 rounded-[3rem] p-10 border-2 border-blue-100 shadow-xl shadow-blue-100/50 relative overflow-hidden">
            {/* Dekorasi lingkaran untuk tekstur background */}
            <div className="absolute -left-10 -bottom-10 size-40 bg-white/40 rounded-full blur-2xl" />

            <div className="relative z-10">
              <h3 className="text-xl font-black mb-8 text-blue-800 flex items-center gap-2">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <ShieldCheck className="text-blue-600" size={20} />
                </div>
                Informasi Akun
              </h3>

              <div className="space-y-4">
                {[
                  {
                    icon: Smartphone,
                    label: "Verifikasi WhatsApp",
                    val: "Terhubung",
                    color: "text-emerald-600",
                    bgColor: "bg-white",
                  },
                  {
                    icon: ShieldCheck,
                    label: "Status Langganan",
                    val: "Premium Pro",
                    color: "text-amber-600",
                    bgColor: "bg-white",
                  },
                  {
                    icon: MapPin,
                    label: "Regional",
                    val: "Jawa Barat",
                    color: "text-blue-600",
                    bgColor: "bg-white",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${item.bgColor} ${item.color} shadow-sm`}
                      >
                        <item.icon size={18} strokeWidth={3} />
                      </div>
                      <span className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-black tracking-tight ${item.color}`}
                    >
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tombol Simpan dengan gradasi biru cerah */}
              <Button className="w-full mt-8 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-[1.5rem] py-8 font-black text-sm shadow-lg shadow-blue-200 border-none transition-all hover:scale-[1.02] active:scale-95">
                <Save className="mr-2 size-5 stroke-3" /> SIMPAN PERUBAHAN
              </Button>
            </div>
          </div>

          {/* Tips Promo Card */}
          <div className="bg-amber-50 rounded-[3rem] p-8 border border-amber-100 flex flex-col items-center text-center">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-500 mb-4 animate-bounce">
              <Zap size={32} />
            </div>
            <h4 className="text-lg font-black text-amber-900 mb-2">
              Tips Promo!
            </h4>
            <p className="text-sm text-amber-700/80 font-medium">
              Promo yang menawarkan <strong>Gratis Cek 21 Titik</strong>{" "}
              biasanya meningkatkan jumlah kunjungan pelanggan hingga 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
