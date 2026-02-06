import type { IService } from "@/utils/interfaces/IService";

import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Nama layanan minimal 3 karakter"),
  code: z.string().min(3, "Kode wajib diisi"),
  price: z.string().min(1, "Harga harus diisi"),
  estimated_duration: z.string().min(1, "Durasi harus diisi"),
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
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
        price: detail.price.toString(),
        estimated_duration: detail.estimated_duration?.toString(),
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
    <Modal
      backdrop="blur"
      classNames={{
        base: "border border-gray-100 shadow-2xl",
        header: "border-b-[1px] border-gray-100",
        footer: "border-t-[1px] border-gray-100",
      }}
      isOpen={open}
      size="3xl"
      onOpenChange={handleClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-black uppercase italic tracking-tight">
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
              <Input
                label="Nama Jasa"
                labelPlacement="outside"
                placeholder="Contoh: Ganti Oli Mesin"
                variant="bordered"
                {...register("name")}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
              />
              <Input
                label="Kode Jasa"
                labelPlacement="outside"
                placeholder="SRV-001"
                variant="bordered"
                {...register("code")}
                errorMessage={errors.code?.message}
                isInvalid={!!errors.code}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Harga"
                labelPlacement="outside"
                placeholder="0"
                startContent={
                  <span className="text-gray-400 text-tiny">Rp</span>
                }
                type="number"
                variant="bordered"
                {...register("price")}
                errorMessage={errors.price?.message}
                isInvalid={!!errors.price}
              />
              <Input
                endContent={
                  <span className="text-gray-400 text-tiny">Menit</span>
                }
                label="Estimasi Durasi"
                labelPlacement="outside"
                placeholder="0"
                type="number"
                variant="bordered"
                {...register("estimated_duration")}
                errorMessage={errors.estimated_duration?.message}
                isInvalid={!!errors.estimated_duration}
              />
              <Autocomplete
                defaultItems={suppliers?.data || []}
                label="Supplier (Opsional)"
                labelPlacement="outside"
                placeholder="Cari Supplier"
                selectedKey={watch("supplier_id")?.toString()}
                variant="bordered"
                onSelectionChange={(key) =>
                  setValue("supplier_id", Number(key))
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.id} textValue={item.name}>
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                errorMessage={errors.difficulty?.message}
                isInvalid={!!errors.difficulty}
                label="Tingkat Kesulitan"
                labelPlacement="outside"
                selectedKeys={[watch("difficulty") || ""]}
                variant="bordered"
                onChange={(e) => setValue("difficulty", e.target.value)}
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

              <div className="flex flex-col gap-2">
                <div className="flex items-end gap-2">
                  <Select
                    className="flex-1"
                    errorMessage={errors.category_id?.message}
                    isInvalid={!!errors.category_id}
                    label="Kategori"
                    labelPlacement="outside"
                    placeholder="Pilih kategori"
                    selectedKeys={[watch("category_id") || ""]}
                    variant="bordered"
                    onChange={(e) => setValue("category_id", e.target.value)}
                  >
                    {categories.map((cat) => (
                      <SelectItem key={cat.id.toString()} textValue={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <CategoryAdd
                    onFinish={(val) =>
                      setValue("category_id", val.id.toString())
                    }
                  />
                </div>
              </div>
            </div>

            <Textarea
              disableAnimation
              disableAutosize
              classNames={{ input: "h-24" }}
              label="Deskripsi Layanan"
              labelPlacement="outside"
              placeholder="Jelaskan detail apa saja yang dikerjakan..."
              variant="bordered"
              {...register("description")}
            />
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            className="font-bold uppercase italic tracking-widest text-tiny"
            color="danger"
            startContent={<X size={18} />}
            variant="flat"
            onPress={handleClose}
          >
            Batal
          </Button>
          <Button
            className="bg-gray-900 text-white font-black uppercase italic tracking-widest px-8"
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
