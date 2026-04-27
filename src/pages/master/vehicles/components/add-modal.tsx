import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { IVehicleItem } from "@/utils/interfaces/IMaster";
import InputNumber from "@/components/input-number";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getMasterVehicle } from "@/stores/features/vehicle/vehicle-action";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  data?: IVehicleItem;
}

const vehileSchema = z.object({
  id: z.number().optional().nullable(),
  type: z.string("Type harus diisi"),
  merk: z.string("Merk harus diisi").min(1, "Merk harus diisi"),
  cc: z.number("CC harus diisi"),
  status: z.string().optional().nullable(),
});

type VehileFormSchema = z.infer<typeof vehileSchema>;

export default function ModalAdd({ open, setOpen, data }: Props) {
  const { master: vehicles } = useAppSelector((state) => state.vehicle);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<VehileFormSchema>({
    resolver: zodResolver(vehileSchema),
    defaultValues: {
      ...(data as any),
    },
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      reset({ ...data, cc: Number(data.cc) } as any);
    } else {
      reset({
        merk: "",
        cc: 1.5,
        status: "active",
      });
    }
  }, [data]);

  function onSubmit(body: VehileFormSchema) {
    setLoading(true);

    http
      .post("/vehicle-master", body)
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        dispatch(getMasterVehicle());
      })
      .catch(notifyError)
      .finally(() => {
        setLoading(false);
      });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Mencegah form submit secara tidak sengaja
      e.preventDefault();

      const form = e.currentTarget.closest("form");

      if (!form) return;

      // Ambil semua elemen yang bisa di-focus (input, button, select)
      const index = Array.from(form.elements).indexOf(e.currentTarget as any);

      if (index > -1) {
        const nextElement = form.elements[index + 1] as HTMLElement;

        nextElement?.focus();
      }
    }
  };

  return (
    <Modal isOpen={open} scrollBehavior="outside" onOpenChange={setOpen}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {data ? "Edit" : "Tambah"} Data Master Kendaraan
          </ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="merk"
              render={({ field, fieldState }) => (
                <Autocomplete
                  defaultItems={vehicles}
                  errorMessage={fieldState.error?.message}
                  inputValue={field.value}
                  isInvalid={!!fieldState.error}
                  label="Merk Kendaraan"
                  listboxProps={{
                    emptyContent:
                      "Kendaraan tidak ditemukan, tekan Enter untuk tambah baru.",
                  }}
                  placeholder="Masukan merk kendaraan"
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  selectedKey={field.value}
                  onInputChange={(val) => field.onChange(val.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  onSelectionChange={(key) => {
                    if (key) {
                      field.onChange(String(key).toUpperCase());
                    }
                  }}
                >
                  {(item) => (
                    <AutocompleteItem key={item.type}>
                      {item.type}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  label="Tipe Kendaraan"
                  placeholder="Masukan Tipe Kendaraan"
                />
              )}
            />
            <Controller
              control={control}
              name="cc"
              render={({ field, fieldState }) => (
                <InputNumber
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  label="CC"
                  placeholder="Masukan CC"
                  value={field.value as any}
                  onInput={field.onChange}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={loading}
              variant="bordered"
              onPress={() => setOpen(false)}
            >
              Tutup
            </Button>
            <Button color="primary" isLoading={loading} type="submit">
              Simpan
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
