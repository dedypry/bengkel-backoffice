import type { ICompany } from "@/utils/interfaces/IUser";

import { Store, Tag, Save, Percent, Settings, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Input, Select, Textarea, Option } from "@mui/joy";
import { useEffect, useState } from "react";
import React from "react";

import {
  companySchema,
  type CompanyFormValues,
} from "./schemas/profile-schema";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import HeaderAction from "@/components/header-action";
import UploadAvatar from "@/components/upload-avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputNumber from "@/components/ui/input-number";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { http } from "@/utils/libs/axios";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { FaxMask, NpwpMask, PhoneMask } from "@/utils/mask/mask";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getCity, getDistrict } from "@/stores/features/region/region-action";

export default function WorkshopSettings() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

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
      is_discount_birth_day: false,
      type_discount_birth_day: "percentage",
      max_discount_birth_day: 0,
    },
  });

  useEffect(() => {
    getCompany();
  }, []);

  function getCompany() {
    if (user) {
      http
        .get<ICompany>(`/companies/${user.company_id}`)
        .then(({ data }) => {
          form.setValue("id", data.id);
          form.setValue("name", data.name);
          form.setValue("logo_url", data.logo_url);
          form.setValue("email", data.email!);
          form.setValue("phone_number", data.phone_number!);
          form.setValue("fax", data.fax!);
          form.setValue("npwp", data.npwp!);
          form.setValue("is_ppn", data.is_ppn!);
          form.setValue("is_discount_birth_day", data.is_discount_birth_day!);
          form.setValue(
            "max_discount_birth_day",
            Number(data.max_discount_birth_day || 0),
          );
          form.setValue(
            "total_discount_birth_day",
            Number(data.total_discount_birth_day || 0),
          );
          form.setValue("ppn", Number(data.ppn || 0));
          if (data.address) {
            form.setValue("address", data.address);
            if (data.address.province_id) {
              dispatch(getCity(data.address.province_id));
            }
            if (data.address.city_id) {
              dispatch(getDistrict(data.address.city_id));
            }
          }
        })
        .catch((err) => notifyError(err));
    }
  }

  const onSubmit = async (data: CompanyFormValues) => {
    setLoading(true);
    if (data.logo_url && data.logo_url instanceof File) {
      const logo = await uploadFile(data.logo_url);

      form.setValue("logo_url", logo);
      data.logo_url = logo;
    }

    http
      .patch("/companies", data)
      .then(({ data }) => {
        notify(data.message);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Form {...form}>
      <form
        className="flex space-y-5 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-6">
          <HeaderAction
            actionContent={
              <Button
                color="danger"
                startDecorator={<Trash2 />}
                onClick={() => confirmSweat(() => {})}
              >
                Hapus Bengkel
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
                            error={!!form.formState.errors.name}
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
                            error={!!form.formState.errors.phone_number}
                            id="phone_number"
                            {...field}
                            placeholder="082..."
                            slotProps={{ input: { component: PhoneMask } }}
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
                            error={!!form.formState.errors.email}
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
                            error={!!form.formState.errors.npwp}
                            id="fax"
                            {...field}
                            placeholder="Masukan NPWP"
                            slotProps={{ input: { component: NpwpMask } }}
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
                            error={!!form.formState.errors.fax}
                            id="fax"
                            {...field}
                            placeholder="Masukan No. FAX"
                            slotProps={{ input: { component: FaxMask } }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="address.province_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <FormControl>
                          <Province
                            value={field.value!}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota</FormLabel>
                        <FormControl>
                          <City
                            value={field.value!}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.district_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <FormControl>
                          <District
                            value={field.value!}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-25"
                          id="address"
                          placeholder="Jl. Raya Utama No. 123..."
                          value={field.value ?? ""}
                          onChange={field.onChange}
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
                        <FormLabel className="italic">Jumlah Promo</FormLabel>
                        <FormControl>
                          <InputNumber
                            endDecorator={
                              <React.Fragment>
                                <Divider orientation="vertical" />
                                <Select
                                  slotProps={{
                                    listbox: {
                                      variant: "outlined",
                                    },
                                  }}
                                  sx={{
                                    mr: -1.5,
                                    "&:hover": { bgcolor: "transparent" },
                                  }}
                                  value={form.watch("type_discount_birth_day")}
                                  variant="plain"
                                  onChange={(_, value) =>
                                    form.setValue(
                                      "type_discount_birth_day",
                                      value!,
                                    )
                                  }
                                >
                                  <Option value="percentage">%</Option>
                                  <Option value="value">Rp</Option>
                                </Select>
                              </React.Fragment>
                            }
                            placeholder="Masukan Nilai Promo"
                            value={field.value}
                            onInput={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("type_discount_birth_day") === "percentage" && (
                    <FormField
                      control={form.control}
                      name="max_discount_birth_day"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Maksimal Promo</FormLabel>
                          <FormControl>
                            <InputNumber
                              startDecorator="Rp"
                              value={field.value}
                              onInput={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <p className="text-[11px] text-slate-500 italic">
                    *Promo yang dikonfigurasi di sini akan muncul sebagai
                    pilihan default di halaman kasir.
                  </p>
                </CardContent>
              </Card>
              <Button
                fullWidth
                disabled={loading}
                startDecorator={<Save />}
                type="submit"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
