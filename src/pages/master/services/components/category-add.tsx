import type { IServiceCategory } from "@/utils/interfaces/IService";

import { PlusIcon, Tag, AlignLeft, Save, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  onFinish?: (val: IServiceCategory) => void;
}

export default function CategoryAdd({ onFinish }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { control, handleSubmit, reset } = useForm<CategoryFormValues>({
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
          color="primary"
          variant="shadow"
          onPress={() => setIsOpen(true)}
        >
          <PlusIcon size={18} />
        </Button>
      </Tooltip>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="md"
        onOpenChange={handleClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-black uppercase">Tambah Kategori</h3>
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
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Input
                    label="Nama Kategori"
                    placeholder="Contoh: Mesin, Kelistrikan..."
                    startContent={<Tag className="text-gray-400" size={16} />}
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Textarea
                    classNames={{
                      input: "min-h-[100px]",
                    }}
                    label="Deskripsi"
                    placeholder="Penjelasan singkat mengenai kategori ini..."
                    startContent={
                      <AlignLeft className="text-gray-400 mt-1" size={16} />
                    }
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                  />
                )}
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              startContent={<X size={16} />}
              variant="flat"
              onPress={handleClose}
            >
              Batal
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              startContent={!isLoading && <Save size={16} />}
              onPress={() => handleSubmit(onSubmit)()}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
