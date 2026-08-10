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
import { useTranslation } from "react-i18next";

import { IVehicleItem } from "@/utils/interfaces/IMaster";
import InputNumber from "@/components/input-number";
import { useAppSelector } from "@/stores/hooks";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  data?: IVehicleItem;
  onRefresh?: () => void;
}

const vehileSchema = z.object({
  id: z.number().optional().nullable(),
  type: z.string("Type harus diisi"),
  merk: z.string("Merk harus diisi").min(1, "Merk harus diisi"),
  cc: z.number("CC harus diisi"),
  status: z.string().optional().nullable(),
});

type VehileFormSchema = z.infer<typeof vehileSchema>;

export default function ModalAdd({ open, setOpen, data, onRefresh }: Props) {
  const { t } = useTranslation();
  const { master: vehicles } = useAppSelector((state) => state.vehicle);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<VehileFormSchema>({
    resolver: zodResolver(vehileSchema),
    defaultValues: {
      ...(data as any),
    },
  });

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
        if (onRefresh) {
          onRefresh();
        }
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
            {data ? t("master.vehicles.modal.edit") : t("master.vehicles.modal.add")}
            {t("master.vehicles.modal.title_suffix")}
          </ModalHeader>
          <ModalBody>
            <Controller
              control={control}
              name="merk"
              render={({ field, fieldState }) => (
                <Autocomplete
                  defaultItems={Array.isArray(vehicles) ? vehicles : []}
                  errorMessage={fieldState.error?.message}
                  inputValue={field.value}
                  isInvalid={!!fieldState.error}
                  label={t("master.vehicles.modal.brand_label")}
                  listboxProps={{
                    emptyContent: t("master.vehicles.modal.not_found"),
                  }}
                  placeholder={t("master.vehicles.modal.brand_placeholder")}
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
                  label={t("master.vehicles.modal.type_label")}
                  placeholder={t("master.vehicles.modal.type_placeholder")}
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
                  label={t("master.vehicles.modal.cc_label")}
                  placeholder={t("master.vehicles.modal.cc_placeholder")}
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
              {t("common.close")}
            </Button>
            <Button color="primary" isLoading={loading} type="submit">
              {t("common.save")}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
