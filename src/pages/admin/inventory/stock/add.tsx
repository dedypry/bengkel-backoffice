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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getCategories,
  getUoms,
} from "@/stores/features/product/product-action";
import Combobox from "@/components/ui/combobox";
import InputNumber from "@/components/ui/input-number";
import FileUploader from "@/components/drop-zone";

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
  uom_id: z.number(),
  location: z.string().optional(),
  is_active: z.boolean(),
  images: z.any().array(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Props {
  initialData?: any;
}

export default function FormStock({ initialData }: Props) {
  const { company } = useAppSelector((state) => state.auth);
  const { categories, categoryQuery, uoms } = useAppSelector(
    (state) => state.product,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories(categoryQuery));
    dispatch(getUoms());
  }, [company]);

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
    uom_id: initialData?.unit ?? 1,
    location: initialData?.location ?? "",
    is_active: initialData?.is_active ?? true,
    images: initialData?.images ?? [],
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
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto Produk</FormLabel>
                    <FormControl>
                      <FileUploader
                        className="pb-5"
                        value={field.value as any}
                        onFileSelect={(files) => field.onChange(files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Combobox
                        items={categories.map((e) => ({
                          label: e.name,
                          value: e.id,
                        }))}
                        placeholder="Pilih Kategori"
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uom_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Satuan</FormLabel>
                      <FormControl>
                        <Combobox
                          items={uoms.map((e) => ({
                            label: e.name,
                            value: e.id,
                          }))}
                          placeholder="Pcs / Liter / Botol"
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
                      <FormControl>
                        <InputNumber
                          prefix="Rp."
                          value={field.value}
                          onInput={field.onChange}
                        />
                      </FormControl>
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
                      <FormControl>
                        <InputNumber
                          prefix="Rp."
                          value={field.value}
                          onInput={field.onChange}
                        />
                      </FormControl>
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
                        <InputNumber
                          value={field.value}
                          onInput={field.onChange}
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
                        <InputNumber
                          value={field.value}
                          onInput={field.onChange}
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
                  className="w-full shadow-lg shadow-primary/20"
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
