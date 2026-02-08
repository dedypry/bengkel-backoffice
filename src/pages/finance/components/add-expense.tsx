import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X, Receipt } from "lucide-react";

import { ExpenseFormValues, ExpenseSchema } from "./schemas";

import InputNumber from "@/components/input-number";
import CustomDatePicker from "@/components/forms/date-picker";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpenseModal({ isOpen, onClose }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      console.log("Data Pengeluaran:", data);
      // Panggil API di sini
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
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
                  <Select
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Kategori"
                    placeholder="Pilih Kategori"
                  >
                    <SelectItem key="operasional" textValue="Operasional">
                      Operasional
                    </SelectItem>
                    <SelectItem key="gaji" textValue="Gaji Karyawan">
                      Gaji Karyawan
                    </SelectItem>
                    <SelectItem key="part" textValue="Pembelian Part">
                      Pembelian Part
                    </SelectItem>
                  </Select>
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
              isLoading={isSubmitting}
              radius="sm"
              startContent={!isSubmitting && <Save size={18} />}
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
