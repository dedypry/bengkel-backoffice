import {
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
import { useEffect } from "react";

import { IVehicleItem } from "@/utils/interfaces/IMaster";
import InputNumber from "@/components/input-number";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  data?: IVehicleItem;
}

const vehileSchema = z.object({
  id: z.number().optional().nullable(),
  type: z.string("Type harus diisi"),
  merk: z.string("Merk harus diisi"),
  cc: z.number("CC harus diisi"),
  status: z.boolean().optional().nullable(),
});

type VehileFormSchema = z.infer<typeof vehileSchema>;

export default function ModalAdd({ open, setOpen, data }: Props) {
  const { control, handleSubmit, reset } = useForm<VehileFormSchema>({
    resolver: zodResolver(vehileSchema),
    defaultValues: {
      ...(data as any),
    },
  });

  useEffect(() => {
    if (data) {
      reset(data as any);
    }
  }, [data]);

  function onSubmit() {}

  return (
    <Modal isOpen={open} scrollBehavior="outside" onOpenChange={setOpen}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Data Master Kendaraan</ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Input
                  {...field}
                  description="Jika anda mengubah type, maka type yang sama akan ikut berubah"
                  label="Type"
                  placeholder="Masukan Type"
                />
              )}
            />
            <Controller
              control={control}
              name="merk"
              render={({ field }) => (
                <Input {...field} label="Merk" placeholder="Masukan Merk" />
              )}
            />
            <Controller
              control={control}
              name="cc"
              render={({ field }) => (
                <InputNumber
                  label="CC"
                  placeholder="Masukan CC"
                  value={field.value as any}
                  onInput={field.onChange}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Simpan</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
