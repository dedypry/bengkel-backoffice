import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Archive, DollarSign, Info, MapPin, Package } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const productSchema = z.object({
  code: z.string().min(1, "Kode produk wajib diisi"),
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  category_id: z.number().min(1, "Pilih kategori"),
  supplier_id: z.number().optional(),
  purchase_price: z.number().min(0),
  sell_price: z.number().min(0),
  stock: z.number().min(0),
  min_stock: z.number().min(0),
  unit: z.string().min(1, "Satuan wajib diisi"),
  location: z.string().optional(),
  is_active: z.boolean(),
  image: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ICategory {
  id: number;
  name: string;
}

interface Props {
  initialData?: any;
  categories: ICategory[]; // Pastikan categories dilempar lewat props
}

export default function FormStock({ initialData, categories = [] }: Props) {
  // 2. Definisikan default values secara eksplisit di luar agar tipe terdeteksi sempurna
  const defaultValues: ProductFormValues = {
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    category_id: initialData?.category_id ? Number(initialData.category_id) : 0,
    supplier_id: initialData?.supplier_id
      ? Number(initialData.supplier_id)
      : undefined,
    purchase_price: initialData?.purchase_price
      ? Number(initialData.purchase_price)
      : 0,
    sell_price: initialData?.sell_price ? Number(initialData.sell_price) : 0,
    stock: initialData?.stock ? Number(initialData.stock) : 0,
    min_stock: initialData?.min_stock ? Number(initialData.min_stock) : 0,
    unit: initialData?.unit ?? "Pcs",
    location: initialData?.location ?? "",
    is_active: initialData?.is_active ?? true,
    image: initialData?.image ?? "",
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues,
  });

  // 3. Tambahkan useEffect reset agar saat initialData (mode edit) berubah, form terupdate
  useEffect(() => {
    if (initialData) {
      form.reset(defaultValues);
    }
  }, [initialData]);

  const onSubmit = (data: ProductFormValues) => {
    console.log("Data Produk Terpilih:", data);
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* SECTION 1: INFORMASI DASAR */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Package className="size-5" />
                <h2 className="text-lg font-semibold tracking-tight">
                  Informasi Dasar
                </h2>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode / SKU</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="OLI-001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Contoh: Oli Toyota Motor Oil 10W-40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        defaultValue={field.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Satuan</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Pcs / Liter / Botol"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <MapPin className="size-3" /> Lokasi Rak
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Gudang A / Rak 1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECTION 2: HARGA & INVENTORI */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <DollarSign className="size-5" />
                <h2 className="text-lg font-semibold tracking-tight">
                  Harga & Inventori
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="purchase_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Beli</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
                          Rp
                        </span>
                        <FormControl>
                          <Input
                            className="pl-9 bg-white"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sell_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Jual</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
                          Rp
                        </span>
                        <FormControl>
                          <Input
                            className="pl-9 bg-emerald-50 border-emerald-200"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stok Awal</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white font-bold"
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
                  name="min_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-rose-600">
                        Stok Minimum
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white border-rose-200"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECTION 3: KETERANGAN TAMBAHAN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Info className="size-5" />
                  <h2 className="text-lg font-semibold tracking-tight">
                    Deskripsi
                  </h2>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-30 bg-white"
                          placeholder="Masukkan detail spesifikasi produk atau catatan lainnya..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Archive className="size-5" />
                  <h2 className="text-lg font-semibold tracking-tight">
                    Pengaturan
                  </h2>
                </div>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Status Produk
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Aktifkan untuk menampilkan di POS
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                  type="submit"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
