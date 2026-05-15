import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Boxes,
  ChevronRight,
  DollarSign,
  Info,
  MapPin,
  Package,
  PlusSquare,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Textarea,
  Switch,
  Card,
  CardBody,
  Divider,
  BreadcrumbItem,
  Breadcrumbs,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";

import ModalAddCategory from "../categories/components/add-category";

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
import { IProductCategory } from "@/utils/interfaces/IProduct";
import { setCategories } from "@/stores/features/product/product-slice";

const productSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Kode produk wajib diisi"),
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional().nullable(),
  category_id: z.coerce
    .number({ message: "Pilih kategori" })
    .min(1, "Pilih kategori"),
  main_category_id: z.coerce
    .number({ message: "Pilih Main kategori" })
    .min(1, "Pilih Main kategori"),
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
  const [modalAddCat, setModalAddCat] = useState(false);
  const [subCategories, setSubCategories] = useState<IProductCategory[]>([]);
  const [initialCategoryData, setInitialCategoryData] = useState<any>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;

      dispatch(getCategories({}));
      dispatch(getUoms());

      const timer = setTimeout(() => {
        hasFetched.current = false;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [company, dispatch]);

  const { control, reset, handleSubmit, setValue, watch } =
    useForm<ProductFormValues>({
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
        description: "",
      },
    } as any);

  useEffect(() => {
    if (initialData) {
      const mainCatId =
        initialData.category?.parent_id || initialData.category_id;

      if (mainCatId) {
        const find = categories.find((e) => e.id === mainCatId);

        if (find) {
          setSubCategories(find.children);
        } else {
          if (initialData.category) {
            formatCategories();
          }
        }
      }

      reset({
        ...initialData,
        main_category_id: mainCatId,
        images: (initialData.images || []).map((e: any) => e.path),
        category_id: Number(initialData.category_id),
        uom_id: Number(initialData.uom_id),
        purchase_price: Number(initialData.purchase_price || 0),
        sell_price: Number(initialData.sell_price || 0),
        ...(!initialData.category?.parent_id && {
          category_id: "",
        }),
      });
    }
  }, [initialData, categories]);

  function formatCategories() {
    const cat = [
      {
        ...initialData.category.parent,
        children: [
          {
            ...initialData.category,
            parent: undefined,
          },
        ],
      },
    ];
    const existingIds = new Set(categories.map((c) => c.id));
    const newCategories = (cat as IProductCategory[]).filter(
      (c) => !existingIds.has(c.id),
    );

    dispatch(setCategories([...categories, ...newCategories]));
  }

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

      const payload: any = { ...data, images };

      delete payload.main_category_id;
      const response = await http.post("/products", payload);

      notify(response.data.message);
      navigate("/inventory/stock");
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  const mainCategory = categories.find(
    (e) => e.id == watch("main_category_id"),
  );

  return (
    <>
      <ModalAddCategory
        initialData={initialCategoryData}
        open={modalAddCat}
        setOpen={setModalAddCat}
        onClose={(val) => {
          if (val?.children && val?.children.length > 0) {
            setSubCategories(val?.children);
            setValue("category_id", val?.children[0]?.id);
          }
          if (val?.id) {
            setValue("main_category_id", val?.id);
          }

          dispatch(getCategories({}));
        }}
      />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Breadcrumbs
          className="pt-5"
          itemClasses={{ item: "text-gray-500 font-medium" }}
          separator={<ChevronRight size={14} />}
        >
          <BreadcrumbItem
            href="/inventory/stock"
            startContent={<Package size={14} />}
          >
            Inventory
          </BreadcrumbItem>
          <BreadcrumbItem startContent={<Boxes size={14} />}>
            Spareparts
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent>
            {initialData ? "Edit" : "Tambah"} Stok
          </BreadcrumbItem>
        </Breadcrumbs>

        <Card>
          <CardBody className="p-6 space-y-8">
            {/* SECTION 1: INFORMASI DASAR */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-800">
                <Package className="size-5" />
                <h2 className="text-lg font-black  uppercase ">
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
                      placeholder="OLI-001"
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
                      placeholder="Contoh: Oli Toyota Motor Oil 10W-40"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="main_category_id"
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      defaultItems={categories}
                      endContent={
                        <Button
                          isIconOnly
                          color="success"
                          size="sm"
                          variant="light"
                          onPress={() => setModalAddCat(true)}
                        >
                          <PlusSquare />{" "}
                        </Button>
                      }
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Main Kategori"
                      placeholder="Pilih Kategori"
                      selectedKey={field.value?.toString()}
                      onSelectionChange={(val) => {
                        if (val != String(field.value)) {
                          setValue("category_id", undefined as any);
                        }
                        field.onChange(val);
                        if (val) {
                          const find = categories.find((e) => e.id == val);

                          if (find) {
                            setSubCategories(find.children);
                          }
                        }
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem
                          key={item.id}
                          isReadOnly={!!item.deleted_at}
                          textValue={item.name}
                        >
                          {item.name}{" "}
                          {!!item.deleted_at && (
                            <span className="text-xs text-gray-400 hover:text-red-500">
                              (Sudah Dihapus)
                            </span>
                          )}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      defaultItems={subCategories}
                      endContent={
                        <Button
                          isIconOnly
                          color="success"
                          size="sm"
                          variant="light"
                          onPress={() => {
                            setInitialCategoryData({
                              id: Number(watch("main_category_id")),
                              name: mainCategory?.name,
                              description: mainCategory?.description,
                              is_active: true,
                              children: [
                                ...(mainCategory?.children &&
                                mainCategory?.children.length > 0
                                  ? mainCategory?.children
                                  : [{ name: "" }]),
                              ],
                            });
                            setModalAddCat(true);
                          }}
                        >
                          <PlusSquare />{" "}
                        </Button>
                      }
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Kategori"
                      placeholder="Pilih Kategori"
                      selectedKey={field.value?.toString()}
                      onSelectionChange={(val) => {
                        field.onChange(val);
                        if (val) {
                          const find = categories.find((e) => e.id == val);

                          if (find) {
                            setSubCategories(find.children);
                          }
                        }
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id} textValue={item.name}>
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />

                <Controller
                  control={control}
                  name="uom_id"
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      defaultItems={uoms}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Satuan"
                      placeholder="Pcs / Liter"
                      selectedKey={field.value?.toString()}
                      onSelectionChange={field.onChange}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id} textValue={item.name}>
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
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
                      placeholder="Gudang A / Rak 1"
                      startContent={
                        <MapPin className="text-gray-400" size={16} />
                      }
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
                <h2 className="text-lg  uppercase ">Harga & Inventori</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Controller
                  control={control}
                  name="purchase_price"
                  render={({ field }) => (
                    <InputNumber
                      label="Harga Beli"
                      labelPlacement="inside"
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
                      labelPlacement="inside"
                      prefix="Rp."
                      value={field.value as any}
                      onInput={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="stock"
                  render={({ field, fieldState }) => (
                    <InputNumber
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Stok Awal"
                      labelPlacement="inside"
                      value={field.value as any}
                      onInput={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="min_stock"
                  render={({ field, fieldState }) => (
                    <InputNumber
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Stok Minimum"
                      labelPlacement="inside"
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
                  <h2 className="text-lg font-black  uppercase ">Deskripsi</h2>
                </div>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      minRows={4}
                      placeholder="Masukkan detail spesifikasi produk..."
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-500">
                  <Archive className="size-5" />
                  <h2 className="text-lg font-black  uppercase ">Pengaturan</h2>
                </div>
                <Card
                  className="bg-gray-50 border border-gray-100"
                  shadow="none"
                >
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
    </>
  );
}
