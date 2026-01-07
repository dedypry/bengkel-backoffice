import type z from "zod";

import {
  Car,
  User,
  Wrench,
  ClipboardCheck,
  Save,
  ClipboardList,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { ServiceRegistrationSchema } from "./schemas/create-schema";
import ModalAddService from "./components/modal-add-service";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePicker } from "@/components/date-picker";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import {
  setWoService,
  setWoSparepart,
} from "@/stores/features/work-order/wo-slice";
import { Card, CardContent } from "@/components/ui/card";
import { calculateTotalEstimation } from "@/utils/helpers/global";
import InputNumber from "@/components/ui/input-number";

export default function PendaftaranServis() {
  const { company } = useAppSelector((state) => state.auth);
  const { query } = useAppSelector((state) => state.service);
  const { services, sparepart } = useAppSelector((state) => state.wo);
  const [isEdit, setEdit] = useState(false);
  const dispatch = useAppDispatch();

  const servicePrice = services.reduce(
    (sum, e) => sum + Number(e.price || 0) * Number(e.qty || 0),
    0,
  );
  const sparepartPrice = sparepart.reduce(
    (sum, e) => sum + Number(e.price || 0) * Number(e.qty || 0),
    0,
  );

  useEffect(() => {
    if (company) {
      dispatch(getService(query));
    }
  }, [company]);

  const form = useForm({
    resolver: zodResolver(ServiceRegistrationSchema),
    defaultValues: {
      priority: "normal",
      customer: {
        birth_date: new Date().toISOString(),
      },
    },
  });

  const isVehicleDisable = !!form.watch("vehicles.id") && !isEdit;
  const estimation = calculateTotalEstimation(services);

  const onSubmit = (data: z.infer<typeof ServiceRegistrationSchema>) => {
    console.log("DATA", data);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("draft_wo", JSON.stringify(form.getValues()));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [form.watch()]);

  useEffect(() => {
    const savedData = localStorage.getItem("draft_wo");

    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, []);

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
                              console.log("CUS", cus);
                              form.setValue("customer.id", cus.id);
                              form.setValue("customer.phone", cus.phone);
                              form.setValue("customer.email", cus.email!);
                              field.onChange(cus.name);
                              if (cus?.vehicles && cus?.vehicles?.length > 0) {
                                form.setValue("vehicles", cus.vehicles[0]);
                              }
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
                              if (cus?.vehicles && cus?.vehicles?.length > 0) {
                                form.setValue("vehicles", cus.vehicles[0]);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer.birth_date"
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
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Car className="size-5" />
                    <h4>Detail Kendaraan</h4>
                  </div>

                  <div className="flex items-center gap-2 ">
                    {isVehicleDisable && (
                      <Button
                        className="bg-amber-600 hover:bg-amber-500"
                        size="sm"
                        type="button"
                        onClick={() => setEdit(true)}
                      >
                        <Edit />
                        Ubah Data
                      </Button>
                    )}
                    {!!form.watch("vehicles.id") && (
                      <Button size="sm">
                        <Plus />
                        Kendaraan Baru
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`vehicles.plate_number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                          No. Polisi (Nopol)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="uppercase font-mono"
                            disabled={isVehicleDisable}
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
                    name={`vehicles.brand`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                          Merk
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isVehicleDisable}
                            placeholder="Contoh: Honda"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`vehicles.model`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                          Tipe / Model
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isVehicleDisable}
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
                    name={`vehicles.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                          Tahun
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isVehicleDisable}
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
                    name={`vehicles.vin_number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                          Nomor Rangka (VIN)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="font-mono uppercase"
                            disabled={isVehicleDisable}
                            placeholder="Masukkan No. Rangka"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`vehicles.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                          Warna
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isVehicleDisable}
                            placeholder="Hitam Metalic"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="current_km"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">
                          KM Terakhir
                        </FormLabel>
                        <FormControl>
                          <InputNumber
                            placeholder="Hitam Metalic"
                            value={(field.value || 0) as any}
                            onInput={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Baris 2: Spesifikasi Teknis (Detail) */}
                  <div className="md:col-span-3 mt-2">
                    <h4 className="text-xs font-semibold mb-4 flex items-center gap-2 text-primary border-b pb-2">
                      <ClipboardList className="size-4" /> Spesifikasi Teknis
                      Kendaraan (Optional)
                    </h4>

                    {/* Layout Grid diubah menjadi maksimal 3 kolom pada layar besar agar Input tidak gepeng */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                      {/* Kelompok: Mesin & Tenaga */}
                      <FormField
                        control={form.control}
                        name={`vehicles.engine_capacity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                              Kapasitas Mesin (CC)
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isVehicleDisable}
                                placeholder="Contoh: 1500"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicles.fuel_type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                              Bahan Bakar
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isVehicleDisable}
                                placeholder="Pertalite / Solar / Dex"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicles.transmission_type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                              Tipe Transmisi
                            </FormLabel>
                            <Select
                              defaultValue={field.value}
                              disabled={isVehicleDisable}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Transmisi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MT">Manual (MT)</SelectItem>
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
                        name={`vehicles.engine_number`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                              Nomor Mesin
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="font-mono uppercase"
                                disabled={isVehicleDisable}
                                placeholder="Masukkan No. Mesin"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicles.tire_size`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-medium text-muted-foreground uppercase">
                              Ukuran Ban & Velg
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isVehicleDisable}
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
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicles.plate_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Polisi</FormLabel>
                        <FormControl>
                          <VehiclesOption
                            {...field}
                            className="uppercase font-bold text-lg"
                            items={vehicles}
                            placeholder="B 1234 ABC"
                            onSelect={(val) => {
                              form.setValue("vehicles", val as any);
                            }}
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
                </div> */}
              </div>

              {/* Section 3: Keluhan & Layanan */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                    <Wrench className="size-5" />
                    <h4>Keluhan & Jenis Servis</h4>
                  </div>
                  <div className="text-right">
                    <ModalAddService />
                  </div>
                </div>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Barang/Jasa</TableHead>
                        <TableHead className="text-center">qty</TableHead>
                        <TableHead className="text-end">Biaya</TableHead>
                        <TableHead className="text-end">Total</TableHead>
                        <TableHead className="text-end"> </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sparepart.length > 0 && (
                        <TableRow className="bg-gray-200">
                          <TableCell className="font-semibold">
                            Sparepart
                          </TableCell>
                          <TableCell className="text-end" colSpan={4}>
                            <Button
                              className="bg-rose-700 hover:bg-rose-600"
                              size="sm"
                              onClick={() => dispatch(setWoSparepart([]))}
                            >
                              <Trash2 />
                              Hapus Semua
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}

                      {sparepart.map((item, i) => (
                        <TableRow key={`spt-${i}`}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{item.name}</span>
                              <span className="text-gray-400 text-xs">
                                {item.code}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {formatNumber(Number(item.qty || 0))}
                          </TableCell>
                          <TableCell className="text-end">
                            {formatIDR(Number(item.sell_price))}
                          </TableCell>
                          <TableCell className="text-end">
                            {formatIDR(
                              Number(item.qty || 0) * Number(item.sell_price),
                            )}
                          </TableCell>
                          <TableCell className="text-end">
                            <button>
                              <Trash2 className="size-4 text-red-600" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {services.length > 0 && (
                        <TableRow className="bg-gray-200">
                          <TableCell className="font-semibold">Jasa</TableCell>
                          <TableCell className="text-end" colSpan={4}>
                            <Button
                              className="bg-rose-700 hover:bg-rose-600"
                              size="sm"
                              onClick={() => dispatch(setWoService([]))}
                            >
                              <Trash2 />
                              Hapus Semua
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      {services.map((item, i) => (
                        <TableRow key={`spt-${i}`}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{item.name}</span>
                              <span className="text-gray-400 text-xs">
                                {item.code}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {formatNumber(Number(item.qty || 0))}
                          </TableCell>
                          <TableCell className="text-end">
                            {formatIDR(Number(item.price))}
                          </TableCell>
                          <TableCell className="text-end">
                            {formatIDR(
                              Number(item.qty || 0) * Number(item.price),
                            )}
                          </TableCell>
                          <TableCell className="text-end">
                            <button>
                              <Trash2 className="size-4 text-red-600" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

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
            <div>
              <div className="space-y-6 sticky top-32">
                <Card>
                  <CardContent>
                    <h3 className="font-bold border-b border-white/10 pb-3 flex items-center gap-2">
                      <ClipboardCheck className="size-5" />
                      Ringkasan Order
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between opacity-80">
                        <span>Estimasi Waktu</span>
                        <span className="font-semibold">
                          {estimation.readable_format}
                        </span>
                      </div>
                      <div className="flex justify-between opacity-80">
                        <span>Total Sparepart</span>
                        <span>{formatIDR(sparepartPrice)}</span>
                      </div>
                      <div className="flex justify-between opacity-80">
                        <span>Total Jasa</span>
                        <span>{formatIDR(servicePrice)}</span>
                      </div>
                      <div className="flex justify-between opacity-80">
                        <span>Estimasi Harga</span>
                        <span className="font-semibold">
                          {formatIDR(servicePrice + sparepartPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center opacity-80">
                        <span className="flex-1">Prioritas</span>

                        <div>
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih Prioritas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">
                                        Rendah
                                      </SelectItem>
                                      <SelectItem value="normal">
                                        Normal
                                      </SelectItem>
                                      <SelectItem value="hight">
                                        Tinggi
                                      </SelectItem>
                                      <SelectItem value="urgent">
                                        Urgent
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-5 shadow-lg"
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
                    >
                      <Save className="mr-2 size-4" />
                      Simpan Work Order
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Tips:</strong> Pastikan Anda telah memeriksa
                      barang berharga di dalam kendaraan sebelum memulai servis.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
