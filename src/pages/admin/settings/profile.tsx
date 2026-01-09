import { Store, Tag, Save, Percent, Settings, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import HeaderAction from "@/components/header-action";
import UploadAvatar from "@/components/upload-avatar";
import { Button } from "@/components/ui/button";

export default function WorkshopSettings() {
  return (
    <div className="space-y-6">
      <HeaderAction
        actionContent={
          <Button variant="destructive">
            <Trash2 /> Hapus Bengkel
          </Button>
        }
        leadIcon={Settings}
        subtitle="Kelola identitas bengkel dan kebijakan promo."
        title="Pengaturan Bengkel"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* --- FORM PROFILE BENGKEL --- */}
        <Card className="md:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#168BAB]">
              <Store className="size-5" />
              <CardTitle>Profil Bengkel</CardTitle>
            </div>
            <CardDescription>
              Informasi ini akan muncul pada struk pembayaran pelanggan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadAvatar
              buttonTitle="Upload Logo"
              value={[]}
              onChange={() => {}}
            />
            <div className="grid grid-cols-2 gap-4 pt-5">
              <div className="space-y-2">
                <Label htmlFor="workshop_name">Nama Bengkel</Label>
                <Input
                  className="focus-visible:ring-[#168BAB]"
                  id="workshop_name"
                  placeholder="Contoh: Maju Jaya Motor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon / WA</Label>
                <Input
                  className="focus-visible:ring-[#168BAB]"
                  id="phone"
                  placeholder="0812..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                className="min-h-25 focus-visible:ring-[#168BAB]"
                id="address"
                placeholder="Jl. Raya Utama No. 123..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer_note">Pesan di Struk (Footer)</Label>
              <Input
                className="focus-visible:ring-[#168BAB]"
                id="footer_note"
                placeholder="Terima kasih telah mempercayai kami"
              />
            </div>
          </CardContent>
        </Card>

        {/* --- PENGATURAN PROMO & PAJAK --- */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#168BAB]">
                <Percent className="size-5" />
                <CardTitle className="text-lg">Pajak & Biaya</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aktifkan PPN</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Tambahkan pajak pada total tagihan
                  </p>
                </div>
                <Switch />
              </div>
              <div className="relative">
                <Input
                  className="pr-8 focus-visible:ring-[#168BAB]"
                  placeholder="11"
                  type="number"
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#168BAB]">
                <Tag className="size-5" />
                <CardTitle className="text-lg">Sistem Promo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Diskon Global Aktif</Label>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Default Kode Promo</Label>
                <Input
                  className="uppercase focus-visible:ring-[#168BAB]"
                  placeholder="PROMOBENGKEL"
                />
              </div>
              <p className="text-[11px] text-slate-500 italic">
                *Promo yang dikonfigurasi di sini akan muncul sebagai pilihan
                default di halaman kasir.
              </p>
            </CardContent>
          </Card>
          <Button className="w-full">
            {" "}
            <Save /> Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
