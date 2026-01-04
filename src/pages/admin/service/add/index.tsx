import { Car, User, Wrench, ClipboardCheck, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { ServiceRegistrationSchema } from "./schemas/create-schema";

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
import CustomerSearch from "@/components/customer-search";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PendaftaranServis() {
  const { company } = useAppSelector((state) => state.auth);
  const { services, query } = useAppSelector((state) => state.service);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getService(query));
    }
  }, [company]);

  const form = useForm({
    resolver: zodResolver(ServiceRegistrationSchema),
  });

  return (
    <Form {...form}>
      <form action="">
        <div className="pb-20 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-end border-b pb-6">
            <div>
              <h3 className="font-bold ">Pendaftaran Servis Baru</h3>
              <p className="text-slate-500 text-sm">
                Input data kendaraan dan keluhan pelanggan untuk pembuatan Work
                Order.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                No. Antrean
              </span>
              <h2 className="text-primary">#A-124</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Section 1: Data Pemilik */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <User className="size-5" />
                  <h4>Informasi Pelanggan</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Pelanggan</FormLabel>
                        <FormControl>
                          <CustomerSearch
                            placeholder="Cari atau masukkan nama..."
                            value={field.value}
                            onChange={field.onChange}
                            onCustomer={(cus) => {
                              form.setValue("customer.id", cus.id);
                              form.setValue("customer.phone", cus.phone);
                              form.setValue("customer.email", cus.email!);
                              field.onChange(cus.name);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon / WA</FormLabel>
                        <FormControl>
                          <CustomerSearch
                            placeholder="Cari atau masukkan no hp..."
                            value={field.value}
                            onChange={field.onChange}
                            onCustomer={(cus) => {
                              form.setValue("customer.id", cus.id);
                              form.setValue("customer.name", cus.name);
                              form.setValue("customer.email", cus.email!);
                              field.onChange(cus.name);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Masukan Email valid" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Data Kendaraan */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <Car className="size-5" />
                  <h4>Detail Kendaraan</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicles.plate_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Polisi</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="uppercase font-bold text-lg"
                            placeholder="B 1234 ABC"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicles.brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merk</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Honda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicles.model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe / Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: BRIO Satya" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicles.year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahun</FormLabel>
                        <FormControl>
                          <Input placeholder="2023" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <h4>Keluhan & Jenis Servis</h4>
                </div>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Barang/Jasa</TableHead>
                        <TableHead>qty</TableHead>
                        <TableHead>Biaya</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                  <div className="text-right">
                    <Button>Tambah Barang/Jasa</Button>
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
      </form>
    </Form>
  );
}
