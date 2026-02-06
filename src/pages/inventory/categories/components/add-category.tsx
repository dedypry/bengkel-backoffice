import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  Switch,
  Card,
  CardBody,
} from "@heroui/react";
import { Tags, Power } from "lucide-react";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/product/product-action";

const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Nama kategori minimal 3 karakter"),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  initialData?: any;
}

export default function ModalAddCategory({
  open,
  setOpen,
  initialData,
}: Props) {
  const { categoryQuery } = useAppSelector((state) => state.product);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset(initialData || { name: "", description: "", is_active: true });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    http
      .post("/products/categories", data)
      .then(({ data }) => {
        notify(data.message);
        reset();
        setOpen(false);
        dispatch(getCategories(categoryQuery));
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "border border-gray-100 shadow-2xl",
        header: "border-b border-gray-50",
        footer: "border-t border-gray-50",
      }}
      isOpen={open}
      size="lg"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3 items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Tags className="size-5 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-small text-gray-500 font-black uppercase italic tracking-tight">
                  {initialData ? "Ubah Kategori" : "Tambah Kategori Baru"}
                </span>
                <span className="text-[10px] font-medium text-gray-400 normal-case tracking-normal">
                  Atur pengelompokan item inventaris Anda
                </span>
              </div>
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      classNames={{
                        label:
                          "text-tiny font-bold text-gray-500 uppercase tracking-wider",
                        inputWrapper:
                          "border-gray-200 group-data-[focus=true]:border-gray-800",
                      }}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label="Nama Kategori"
                      labelPlacement="outside"
                      placeholder="Contoh: Mesin, Interior, atau Body"
                      variant="bordered"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      classNames={{
                        label:
                          "text-tiny font-bold text-gray-500 uppercase tracking-wider",
                        inputWrapper:
                          "border-gray-200 group-data-[focus=true]:border-gray-800",
                      }}
                      label="Deskripsi (Opsional)"
                      labelPlacement="outside"
                      minRows={3}
                      placeholder="Jelaskan jenis produk dalam kategori ini..."
                      variant="bordered"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="is_active"
                  render={({ field }) => (
                    <Card
                      className="bg-gray-50 border border-gray-100"
                      shadow="none"
                    >
                      <CardBody className="flex flex-row items-center justify-between p-4">
                        <div className="flex gap-3 items-center">
                          <div
                            className={`p-2 rounded-full ${field.value ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"}`}
                          >
                            <Power size={16} />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-small font-bold text-gray-800">
                              Status Kategori
                            </p>
                            <p className="text-tiny text-gray-400 font-medium">
                              {field.value
                                ? "Muncul di pilihan produk"
                                : "Disembunyikan dari sistem"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          color="success"
                          isSelected={field.value}
                          size="sm"
                          onValueChange={field.onChange}
                        />
                      </CardBody>
                    </Card>
                  )}
                />
              </form>
            </ModalBody>

            <ModalFooter>
              <Button
                className="font-bold text-gray-500"
                variant="light"
                onPress={onClose}
              >
                Batal
              </Button>
              <Button
                color="primary"
                form="category-form"
                isLoading={isLoading}
                onPress={() => handleSubmit(onSubmit)()}
              >
                {initialData ? "PERBARUI" : "SIMPAN KATEGORI"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
