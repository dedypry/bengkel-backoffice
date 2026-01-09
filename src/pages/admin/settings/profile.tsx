import { Store, Tag, Save, Percent, Settings, Trash2 } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputNumber from "@/components/ui/input-number";

const companySchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "Nama cabang wajib diisi"),
    logo_url: z.any().optional(),
    email: z.string().email("Format email tidak valid"),
    phone_number: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^[0-9]+$/, "Hanya boleh berisi angka"),
    fax: z.string().optional().or(z.literal("")),
    npwp: z.string().optional().or(z.literal("")),
    is_ppn: z.boolean(),
    ppn: z.number().optional(),
    is_discount_birth_day: z.boolean(),
    total_discount_birth_day: z.number(),
  })
  .refine(
    (data) => {
      // Jika is_ppn true, maka ppn tidak boleh undefined atau null
      if (data.is_ppn) {
        return data.ppn !== undefined && data.ppn !== null;
      }

      return true;
    },
    {
      message: "Nilai PPN wajib diisi jika PPN aktif",
      path: ["ppn"], // Pesan error akan muncul di field ppn
    },
  );

type CompanyFormValues = z.infer<typeof companySchema>;

export default function WorkshopSettings() {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      logo_url: "",
      email: "",
      phone_number: "",
      fax: "",
      npwp: "",
      is_ppn: false,
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {};

  return (
    <Form {...form}>
      <form
        className="flex space-y-5 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <UploadAvatar
                          buttonTitle="Upload Logo"
                          field={field}
                          isInvalid={!!form.formState.errors.logo_url}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4 pt-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Cabang</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            {...field}
                            placeholder="Contoh: Cabang Jakarta Pusat"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon</FormLabel>
                        <FormControl>
                          <Input
                            id="phone_number"
                            {...field}
                            placeholder="082..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            {...field}
                            placeholder="admin@cabang.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="npwp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NPWP (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            id="fax"
                            {...field}
                            placeholder="admin@cabang.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            id="fax"
                            {...field}
                            placeholder="admin@cabang.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-25"
                          id="address"
                          placeholder="Jl. Raya Utama No. 123..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* --- PENGATURAN PROMO & PAJAK --- */}
            <div className="space-y-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[#168BAB]">
                    <Percent className="size-5" />
                    <CardTitle>Pajak & Biaya</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="is_ppn"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="flex justify-between items-center">
                              <div className="space-y-0.5">
                                <Label>Aktifkan PPN</Label>
                                <p className="text-[10px] text-muted-foreground">
                                  Tambahkan pajak pada total tagihan
                                </p>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="ppn"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <InputNumber
                              className="pr-8"
                              disabled={!form.watch("is_ppn")}
                              placeholder="Masukan nilai pajak"
                              value={field.value}
                              onInput={field.onChange}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[#168BAB]">
                    <Tag className="size-5" />
                    <CardTitle>Promo Ulang Tahun</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_discount_birth_day"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="flex justify-between items-center">
                            <div className="space-y-0.5">
                              <Label>Diskon Global Aktif</Label>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_discount_birth_day"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="italic">
                          Default Kode Promo
                        </FormLabel>
                        <FormControl>
                          <InputNumber
                            placeholder="Masukan Nilai Promo"
                            value={field.value}
                            onInput={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-[11px] text-slate-500 italic">
                    *Promo yang dikonfigurasi di sini akan muncul sebagai
                    pilihan default di halaman kasir.
                  </p>
                </CardContent>
              </Card>
              <Button className="w-full" type="submit">
                {" "}
                <Save /> Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
