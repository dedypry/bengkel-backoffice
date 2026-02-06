import type { IServiceCategory } from "@/utils/interfaces/IService";

import { PlusIcon, Tag, AlignLeft, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Tooltip,
} from "@heroui/react";

import { http } from "@/utils/libs/axios";
import { notifyError, notify } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getCategories } from "@/stores/features/service/service-action";

const categorySchema = z.object({
  name: z.string().min(3, "Nama kategori minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  onFinish?: (val: IServiceCategory) => void;
}

export default function CategoryAdd({ onFinish }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setLoading(true);
    http
      .post("/services/categories", values)
      .then(({ data }) => {
        notify("Kategori berhasil ditambahkan");
        dispatch(getCategories());
        if (onFinish) onFinish(data);
        handleClose();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <Tooltip content="Tambah Kategori Baru" placement="top">
        <Button
          isIconOnly
          className="shrink-0 bg-gray-800 text-white shadow-lg hover:bg-gray-700 h-10 w-10 min-w-10"
          onPress={() => setIsOpen(true)}
        >
          <PlusIcon size={18} />
        </Button>
      </Tooltip>

      <Modal
        backdrop="blur"
        classNames={{
          base: "border border-gray-100",
          header: "border-b-[1px] border-gray-100",
          footer: "border-t-[1px] border-gray-100",
        }}
        isOpen={isOpen}
        size="md"
        onOpenChange={handleClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-black uppercase italic tracking-tight">
              Tambah Kategori
            </h3>
            <p className="text-tiny font-medium text-gray-400">
              Buat grup baru untuk layanan servis Anda.
            </p>
          </ModalHeader>

          <ModalBody className="py-6">
            <form
              className="space-y-6"
              id="category-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Nama Kategori"
                labelPlacement="outside"
                placeholder="Contoh: Mesin, Kelistrikan..."
                startContent={<Tag className="text-gray-400" size={16} />}
                variant="bordered"
                {...register("name")}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
              />

              <Textarea
                label="Deskripsi"
                labelPlacement="outside"
                placeholder="Penjelasan singkat mengenai kategori ini..."
                startContent={
                  <AlignLeft className="text-gray-400 mt-1" size={16} />
                }
                variant="bordered"
                {...register("description")}
                classNames={{
                  input: "min-h-[100px]",
                }}
                errorMessage={errors.description?.message}
                isInvalid={!!errors.description}
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              className="font-bold uppercase italic tracking-widest text-tiny"
              color="danger"
              startContent={<X size={16} />}
              variant="flat"
              onPress={handleClose}
            >
              Batal
            </Button>
            <Button
              className="bg-gray-900 text-white font-black uppercase italic tracking-widest px-6"
              form="category-form"
              isLoading={isLoading}
              startContent={!isLoading && <Save size={16} />}
              type="submit"
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
