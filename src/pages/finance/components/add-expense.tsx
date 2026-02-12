import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X, Receipt } from "lucide-react";
import { useEffect, useRef } from "react";

import { ExpenseFormValues, ExpenseSchema } from "./schemas";

import InputNumber from "@/components/input-number";
import CustomDatePicker from "@/components/forms/date-picker";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getExpenseCategories } from "@/stores/features/expense/expense-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import FileUploader from "@/components/drop-zone";
import { uploadFile } from "@/utils/helpers/upload-file";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpenseModal({ isOpen, onClose }: Props) {
  const { categories } = useAppSelector((state) => state.expense);

  const hasFetched = useRef(false);
  const isLoading = useRef(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getExpenseCategories());
    }
  }, []);

  const { control, handleSubmit, reset } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (payload: ExpenseFormValues) => {
    isLoading.current = true;
    try {
      if (
        payload.attachment_path?.length > 0 &&
        payload.attachment_path[0] instanceof File
      ) {
        const photo = await uploadFile(payload.attachment_path[0]);

        payload.attachment_path = photo;
      }

      const { data } = await http.post("/expense", payload);

      notify(data.message);
      reset();
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      isLoading.current = false;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="outside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex gap-2 items-center">
            <Receipt className="text-rose-500" size={24} />
            Catat Pengeluaran Baru
          </ModalHeader>

          <ModalBody className="py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Deskripsi Transaksi */}
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Nama Transaksi / Deskripsi"
                    placeholder="Contoh: Listrik Bulanan Januari"
                  />
                )}
              />

              {/* Kategori */}
              <Controller
                control={control}
                name="category_id"
                render={({ field, fieldState }) => (
                  <Autocomplete
                    defaultItems={categories}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Kategori"
                    placeholder="Pilih Kategori"
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
              {/* Nominal */}
              <Controller
                control={control}
                name="amount"
                render={({ field, fieldState }) => (
                  <InputNumber
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Nominal (IDR)"
                    placeholder="0"
                    startContent="Rp"
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />

              {/* Tanggal */}
              <Controller
                control={control}
                name="date"
                render={({ field, fieldState }) => (
                  <CustomDatePicker
                    label="Tanggal Transaksi"
                    {...(field as any)}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                  />
                )}
              />
            </div>

            {/* Catatan Tambahan */}
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Catatan Tambahan (Opsional)"
                  placeholder="Keterangan lebih lanjut mengenai transaksi..."
                />
              )}
            />
            <Controller
              control={control}
              name="attachment_path"
              render={({ field }) => (
                <FileUploader
                  maxFiles={1}
                  value={field.value}
                  onFileSelect={field.onChange}
                />
              )}
            />
          </ModalBody>

          <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
            <Button
              startContent={<X size={18} />}
              variant="flat"
              onPress={onClose}
            >
              Batal
            </Button>
            <Button
              color="primary"
              isLoading={isLoading.current}
              radius="sm"
              startContent={!isLoading.current && <Save size={18} />}
              type="submit"
            >
              Simpan Transaksi
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
