import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Archive, DollarSign, Info, MapPin, Package, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Textarea,
  Switch,
  Card,
  CardBody,
  Divider,
  Select,
  SelectItem,
} from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getCategories,
  getUoms,
} from "@/stores/features/product/product-action";
import InputNumber from "@/components/input-number"; // Asumsi tetap gunakan custom input
import FileUploader from "@/components/drop-zone";
import { uploadFile } from "@/utils/helpers/upload-file";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

const productSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Kode produk wajib diisi"),
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  category_id: z.coerce.number().min(1, "Pilih kategori"),
  purchase_price: z.number().min(0),
  sell_price: z.number().min(0),
  stock: z.number().min(0),
  min_stock: z.number().min(0),
  uom_id: z.coerce.number().min(1, "Pilih satuan"),
  location: z.string().optional(),
  is_active: z.boolean(),
  images: z.any().array(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function FormAddStock({ initialData }: { initialData?: any }) {
  const { company } = useAppSelector((state) => state.auth);
  const { categories, uoms } = useAppSelector((state) => state.product);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategories({}));
    dispatch(getUoms());
  }, [company, dispatch]);

  const { control, reset, handleSubmit } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_active: true,
      images: [],
      uom_id: 1,
      category_id: 0,
      stock: 0,
      min_stock: 0,
      purchase_price: 0,
      sell_price: 0,
    },
  } as any);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        category_id: Number(initialData.category_id),
        uom_id: Number(initialData.uom_id),
      });
    }
  }, [initialData]);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const images = await Promise.all(
        data.images.map((e: any) =>
          e instanceof File
            ? uploadFile(
                e,
                `products/${company?.name.toLowerCase().replace(/\s/g, "_")}`,
              )
            : e,
        ),
      );

      const payload = { ...data, images };
      const response = await http.post("/products", payload);

      notify(response.data.message);
      navigate("/inventory/stock");
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="border border-gray-200" shadow="none">
        <CardBody className="p-6 space-y-8">
          {/* SECTION 1: INFORMASI DASAR */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-gray-800">
              <Package className="size-5" />
              <h2 className="text-lg font-black tracking-tight uppercase italic">
                Informasi Dasar
              </h2>
            </div>
            <Divider className="bg-gray-100" />

            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <div className="space-y-2">
                  <p className="text-tiny font-bold text-gray-500 uppercase">
                    Foto Produk
                  </p>
                  <FileUploader
                    value={field.value}
                    onFileSelect={field.onChange}
                  />
                </div>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                control={control}
                name="code"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Kode / SKU"
                    labelPlacement="outside"
                    placeholder="OLI-001"
                    variant="bordered"
                  />
                )}
              />
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    className="md:col-span-2"
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Nama Produk"
                    labelPlacement="outside"
                    placeholder="Contoh: Oli Toyota Motor Oil 10W-40"
                    variant="bordered"
                  />
                )}
              />

              <Controller
                control={control}
                name="category_id"
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Kategori"
                    labelPlacement="outside"
                    placeholder="Pilih Kategori"
                    selectedKeys={field.value ? [field.value.toString()] : []}
                    variant="bordered"
                  >
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} textValue={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="uom_id"
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Satuan"
                    labelPlacement="outside"
                    placeholder="Pcs / Liter"
                    selectedKeys={field.value ? [field.value.toString()] : []}
                    variant="bordered"
                  >
                    {uoms.map((uom) => (
                      <SelectItem key={uom.id} textValue={uom.name}>
                        {uom.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="location"
                render={({ field, fieldState }) => (
                  <Input
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Lokasi Rak"
                    labelPlacement="outside"
                    placeholder="Gudang A / Rak 1"
                    startContent={
                      <MapPin className="text-gray-400" size={16} />
                    }
                    variant="bordered"
                    {...field}
                  />
                )}
              />
            </div>
          </section>

          {/* SECTION 2: HARGA & INVENTORI */}
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-gray-500 font-bold">
              <DollarSign className="size-5" />
              <h2 className="text-lg tracking-tight uppercase italic">
                Harga & Inventori
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Controller
                control={control}
                name="purchase_price"
                render={({ field }) => (
                  <InputNumber
                    label="Harga Beli"
                    prefix="Rp."
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="sell_price"
                render={({ field }) => (
                  <InputNumber
                    label="Harga Jual"
                    prefix="Rp."
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="stock"
                render={({ field }) => (
                  <InputNumber
                    label="Stok Awal"
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="min_stock"
                render={({ field }) => (
                  <InputNumber
                    label=" Stok Minimum"
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />
            </div>
          </section>

          {/* SECTION 3: DESKRIPSI & PENGATURAN */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Info className="size-5" />
                <h2 className="text-lg font-black tracking-tight uppercase italic">
                  Deskripsi
                </h2>
              </div>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    minRows={4}
                    placeholder="Masukkan detail spesifikasi produk..."
                    variant="bordered"
                  />
                )}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-500">
                <Archive className="size-5" />
                <h2 className="text-lg font-black tracking-tight uppercase italic">
                  Pengaturan
                </h2>
              </div>
              <Card className="bg-gray-50 border border-gray-100" shadow="none">
                <CardBody className="flex flex-row items-center justify-between p-4">
                  <div className="flex flex-col">
                    <p className="text-small font-bold">Status Produk</p>
                    <p className="text-tiny text-gray-400 font-medium">
                      Aktifkan untuk POS
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="is_active"
                    render={({ field }) => (
                      <Switch
                        color="success"
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </CardBody>
              </Card>

              <Button
                fullWidth
                color="primary"
                isLoading={isLoading}
                startContent={!isLoading && <Save size={20} />}
                type="submit"
              >
                SIMPAN PRODUK
              </Button>
            </div>
          </section>
        </CardBody>
      </Card>
    </form>
  );
}
