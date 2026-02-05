import type { ICustomer } from "@/utils/interfaces/IUser";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CarFront,
  ChevronLeft,
  ClipboardList,
  FormIcon,
  Plus,
  SaveIcon,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { customerSchema } from "./schemas/create-schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getCity, getDistrict } from "@/stores/features/region/region-action";
import { DatePicker } from "@/components/date-picker";

interface Props {
  data?: ICustomer;
}
export default function CustomerFormPage({ data }: Props) {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      customer_type: "personal",
      nik_ktp: "",
      credit_limit: "0",
      vehicles: [{ plate_number: "", brand: "", model: "", year: "" }],
      profile: {
        birth_date: new Date().toISOString(),
      },
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("id", data.id);
      form.setValue("name", data.name);
      form.setValue("phone", data.phone);
      form.setValue("email", data.email!);
      form.setValue("customer_type", data.customer_type);
      form.setValue("nik_ktp", data.nik_ktp || "");
      form.setValue("credit_limit", data.credit_limit.toString());
      form.setValue("notes", data.notes || "");
      form.setValue("profile.id", data?.profile?.id);
      form.setValue("profile.address", data?.profile?.address);
      form.setValue("profile.province_id", data?.profile?.province_id);
      form.setValue("profile.city_id", data?.profile?.city_id);
      form.setValue("profile.district_id", data?.profile?.district_id);
      form.setValue("profile.birth_date", data?.profile?.birth_date);
      form.setValue("vehicles", data?.vehicles || []);

      if (data.profile?.province_id) {
        dispatch(getCity(data.profile?.province_id));
        dispatch(getDistrict(data.profile?.city_id));
      }
    }
  }, [data]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    http
      .post("/customers", data)
      .then(({ data }) => {
        notify(data.message);
        navigate("/master/customers");
        form.reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  const ActionButton = () => (
    <div className="flex gap-3">
      <Button
        disabled={isLoading}
        variant="outline"
        onClick={() => navigate(-1)}
      >
        Batal
      </Button>
      <Button
        className="gap-2"
        disabled={isLoading}
        onClick={form.handleSubmit(onSubmit)}
      >
        <SaveIcon className="size-4" />{" "}
        {isLoading
          ? "Menyimpan..."
          : data
            ? "Ubah Pelanggan"
            : "Simpan Pelanggan"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Tombol Kembali & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
            <ChevronLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {data ? "Ubah Data Pelanggan" : "Data Pelanggan Baru"}
            </h1>
            <p className="text-muted-foreground">
              {data
                ? "Perbarui informasi detail pelanggan dan kendaraan yang sudah terdaftar."
                : "Lengkapi formulir di bawah untuk mendaftarkan pelanggan dan kendaraan baru."}
            </p>
          </div>
        </div>
        <ActionButton />
      </div>

      <Form {...form}>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* KOLOM KIRI: Informasi Kontak (2/3 Width) */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>
                  Identitas utama pelanggan untuk keperluan administrasi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama pelanggan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. WhatsApp / Telepon</FormLabel>
                        <FormControl>
                          <Input placeholder="0812..." {...field} />
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
                        <FormLabel>Alamat Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="contoh@mail.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="profile.province_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <FormControl>
                          <Province
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profile.city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota</FormLabel>
                        <FormControl>
                          <City value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profile.district_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <FormControl>
                          <District
                            value={field.value}
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
                  name="profile.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-25"
                          placeholder="Alamat rumah atau kantor..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* KOLOM KANAN: Pengaturan Akun (1/3 Width) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Klasifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Pelanggan</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="personal">Perorangan</SelectItem>
                          <SelectItem value="corporate">Perusahaan</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nik_ktp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK (KTP)</FormLabel>
                      <FormControl>
                        <Input placeholder="16 digit NIK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profile.birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <FormControl>
                        <DatePicker
                          setValue={field.onChange}
                          value={new Date(field.value as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Catatan Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Informasi khusus mengenai pelanggan ini (misal: pelanggan VIP, rekanan instansi, dll)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="md:col-span-3">
            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <CarFront className="size-5 text-primary" />
                    Data Kendaraan
                  </CardTitle>
                  <CardDescription>
                    Tambahkan satu atau lebih kendaraan milik pelanggan.
                  </CardDescription>
                </div>
                <Button
                  className="gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({ plate_number: "", brand: "", model: "", year: "" })
                  }
                >
                  <Plus className="size-4" /> Tambah Kendaraan
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border bg-muted/30">
                      <div className="md:col-span-3">
                        <h4 className="text-xs font-semibold mb-4 flex items-center gap-2 text-primary border-b pb-2">
                          <FormIcon className="size-4" /> Form Kendaraan{" "}
                          {index + 1}
                        </h4>
                        <Separator />
                      </div>
                      {/* Tombol Hapus - Hanya muncul jika kendaraan > 1 */}
                      {fields.length > 1 && (
                        <Button
                          className="absolute -top-2 -right-2 bg-white border shadow-sm hover:text-destructive h-8 w-8 rounded-full"
                          size="icon"
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}

                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.plate_number`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                              No. Polisi (Nopol)
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="uppercase font-mono"
                                placeholder="B 1234 ABC"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.brand`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                              Merk
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Honda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.model`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                              Tipe / Model
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contoh: BRIO Satya"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                              Tahun
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="2023"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.vin_number`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                              Nomor Rangka (VIN)
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="font-mono uppercase"
                                placeholder="Masukkan No. Rangka"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.color`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                              Warna
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Hitam Metalic" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {/* Baris 2: Spesifikasi Teknis (Detail) */}
                      <div className="md:col-span-3 mt-2">
                        <h4 className="text-xs font-semibold mb-4 flex items-center gap-2 text-primary border-b pb-2">
                          <ClipboardList className="size-4" /> Spesifikasi
                          Teknis Kendaraan (Optional)
                        </h4>

                        {/* Layout Grid diubah menjadi maksimal 3 kolom pada layar besar agar Input tidak gepeng */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                          {/* Kelompok: Mesin & Tenaga */}
                          <FormField
                            control={form.control}
                            name={`vehicles.${index}.engine_capacity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                                  Kapasitas Mesin (CC)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Contoh: 1500"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vehicles.${index}.fuel_type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                                  Bahan Bakar
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Pertalite / Solar / Dex"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vehicles.${index}.transmission_type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                                  Tipe Transmisi
                                </FormLabel>
                                <Select
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih Transmisi" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MT">
                                      Manual (MT)
                                    </SelectItem>
                                    <SelectItem value="AT">
                                      Automatic (AT)
                                    </SelectItem>
                                    <SelectItem value="CVT">CVT</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          {/* Kelompok: Identitas Legal */}

                          <FormField
                            control={form.control}
                            name={`vehicles.${index}.engine_number`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                                  Nomor Mesin
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="font-mono uppercase"
                                    placeholder="Masukkan No. Mesin"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vehicles.${index}.tire_size`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                                  Ukuran Ban & Velg
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Contoh: 185/65 R15"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

                {form.formState.errors.vehicles?.root && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.vehicles.root.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
      <div className="flex justify-end">
        <ActionButton />
      </div>
    </div>
  );
}
