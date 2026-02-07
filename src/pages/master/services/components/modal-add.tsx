import type { IService } from "@/utils/interfaces/IService";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  Input,
  Select,
  SelectItem,
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { Save, X } from "lucide-react";

import CategoryAdd from "./category-add";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getCategories,
  getService,
} from "@/stores/features/service/service-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import InputNumber from "@/components/input-number";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Nama layanan minimal 3 karakter"),
  code: z.string().min(3, "Kode wajib diisi"),
  price: z.number().min(1, "Harga harus diisi"),
  estimated_duration: z.number().min(1, "Durasi harus diisi"),
  difficulty: z.string().min(1, "Pilih tingkat kesulitan"),
  category_id: z.string().min(1, "Pilih kategori"),
  description: z.string().optional(),
  supplier_id: z.number().optional(),
});

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  detail?: IService;
  setDetail?: () => void;
}

export default function ModalAdd({ open, setOpen, detail, setDetail }: Props) {
  const { categories, query } = useAppSelector((state) => state.service);
  const { suppliers } = useAppSelector((state) => state.supplier);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { control, handleSubmit, setValue, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: { difficulty: "easy" },
  });

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSupplier({ pageSize: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (detail) {
      reset({
        id: detail.id,
        name: detail.name,
        code: detail.code,
        price: Number(detail.price),
        estimated_duration: detail.estimated_duration,
        difficulty: detail.difficulty,
        category_id: detail.category?.id?.toString(),
        description: detail.description || "",
        supplier_id: detail.supplier_id,
      });
    } else {
      reset({ difficulty: "easy", code: "SRV-" });
    }
  }, [detail, reset]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    http
      .post("/services", values)
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        reset();
        dispatch(getService(query));
        setDetail?.();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setOpen(false);
    setDetail?.();
    reset();
  };

  return (
    <Modal backdrop="blur" isOpen={open} size="3xl" onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-black uppercase">
            {detail?.id ? "Ubah Data Jasa" : "Tambah Jasa Baru"}
          </h2>
          <p className="text-tiny font-medium text-gray-400">
            Masukkan detail layanan jasa untuk katalog bengkel.
          </p>
        </ModalHeader>

        <ModalBody className="py-6">
          <form
            className="space-y-6"
            id="service-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Input
                    label="Nama Jasa"
                    placeholder="Contoh: Ganti Oli Mesin"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                  />
                )}
              />
              <Controller
                control={control}
                name="code"
                render={({ field, fieldState }) => (
                  <Input
                    label="Kode Jasa"
                    placeholder="SRV-001"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={control}
                name="price"
                render={({ field, fieldState }) => (
                  <InputNumber
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Harga"
                    labelPlacement="inside"
                    placeholder="0"
                    startContent={
                      <span className="text-gray-400 text-tiny">Rp</span>
                    }
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="estimated_duration"
                render={({ field, fieldState }) => (
                  <InputNumber
                    endContent={
                      <span className="text-gray-400 text-tiny">Menit</span>
                    }
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Estimasi Durasi"
                    labelPlacement="inside"
                    placeholder="0"
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="supplier_id"
                render={({ field, fieldState }) => (
                  <Autocomplete
                    defaultItems={suppliers?.data || []}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Supplier (Opsional)"
                    placeholder="Cari Supplier"
                    selectedKey={field.value}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="difficulty"
                render={({ field, fieldState }) => (
                  <Select
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Tingkat Kesulitan"
                    placeholder="pilih tingkat kesulitan"
                    selectedKeys={[field.value || ""]}
                    onSelectionChange={(key) =>
                      field.onChange(Array.from(key)[0])
                    }
                  >
                    <SelectItem
                      key="easy"
                      startContent={
                        <div className="w-2 h-2 rounded-full bg-success" />
                      }
                    >
                      Easy (Mudah)
                    </SelectItem>
                    <SelectItem
                      key="medium"
                      startContent={
                        <div className="w-2 h-2 rounded-full bg-warning" />
                      }
                    >
                      Medium (Sedang)
                    </SelectItem>
                    <SelectItem
                      key="hard"
                      startContent={
                        <div className="w-2 h-2 rounded-full bg-danger" />
                      }
                    >
                      Hard (Sulit)
                    </SelectItem>
                    <SelectItem
                      key="extreme"
                      startContent={
                        <div className="w-2 h-2 rounded-full bg-gray-900" />
                      }
                    >
                      Extreme (Sangat Sulit)
                    </SelectItem>
                  </Select>
                )}
              />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="category_id"
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        className="flex-1"
                        defaultItems={categories}
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                        label="Kategori"
                        placeholder="Pilih kategori"
                        selectedKey={field.value}
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

                  <CategoryAdd
                    onFinish={(val) =>
                      setValue("category_id", val.id.toString())
                    }
                  />
                </div>
              </div>
            </div>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  disableAnimation
                  disableAutosize
                  classNames={{ input: "h-24" }}
                  label="Deskripsi Layanan"
                  placeholder="Jelaskan detail apa saja yang dikerjakan..."
                  {...field}
                />
              )}
            />
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            startContent={<X size={18} />}
            variant="flat"
            onPress={handleClose}
          >
            Batal
          </Button>
          <Button
            color="primary"
            form="service-form"
            isLoading={isLoading}
            startContent={!isLoading && <Save size={18} />}
            type="submit"
          >
            {detail?.id ? "Simpan Perubahan" : "Simpan Jasa"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
