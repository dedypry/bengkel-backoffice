import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { usePermission } from "@/components/use-permission";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

const schema = z.object({
  pic_id: z.number().nullable(),
  sa_id: z.number().nullable(),
});

type TSupervisorForm = z.output<typeof schema>;

export default function EditSupervisorInfo() {
  const { detail: data } = useAppSelector((state) => state.wo);
  const { list: employes } = useAppSelector((state) => state.employe);
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermission();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  const canUpdate = hasPermission("wo.update");

  const { control, reset, handleSubmit } = useForm<TSupervisorForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      pic_id: null,
      sa_id: null,
    },
  });

  useEffect(() => {
    if (!open || hasFetched.current) return;

    hasFetched.current = true;
    dispatch(getEmploye({ page: 1, pageSize: 500 }));

    setTimeout(() => {
      hasFetched.current = false;
    }, 1000);
  }, [open, dispatch]);

  useEffect(() => {
    if (!open || !data) return;

    reset({
      pic_id: data.pic_id ?? null,
      sa_id: data.sa_id ?? null,
    });
  }, [open, data, reset]);

  if (!canUpdate || ["cancel", "closed"].includes(data?.status || "")) {
    return null;
  }

  const onSubmit = (values: TSupervisorForm) => {
    if (!data?.id) return;

    setIsLoading(true);
    http
      .patch(`/work-order/pic-sa/${data.id}`, values)
      .then(({ data: response }) => {
        notify(response.message);
        dispatch(getWoDetail(data.id));
        setOpen(false);
      })
      .catch((error) => notifyError(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Modal isOpen={open} size="2xl" onOpenChange={setOpen}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <div className="flex items-center gap-2 text-primary font-bold">
                <Users className="size-5" />
                <h5 className="font-bold">Edit Supervisor</h5>
              </div>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Controller
                control={control}
                name="pic_id"
                render={({ field }) => (
                  <Autocomplete
                    defaultItems={employes?.data || []}
                    label="PIC Service"
                    labelPlacement="outside"
                    placeholder="Pilih PIC Service"
                    selectedKey={field.value ? String(field.value) : null}
                    onSelectionChange={(key) =>
                      field.onChange(key ? Number(key) : null)
                    }
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
              <Controller
                control={control}
                name="sa_id"
                render={({ field }) => (
                  <Autocomplete
                    defaultItems={employes?.data || []}
                    label="Service Advisor"
                    labelPlacement="outside"
                    placeholder="Pilih Service Advisor"
                    selectedKey={field.value ? String(field.value) : null}
                    onSelectionChange={(key) =>
                      field.onChange(key ? Number(key) : null)
                    }
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={() => setOpen(false)}>
                Batal
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                startContent={!isLoading ? <Save size={16} /> : undefined}
                type="submit"
              >
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Button
        isIconOnly
        color="warning"
        size="sm"
        variant="light"
        onPress={() => setOpen(true)}
      >
        <Edit size={18} />
      </Button>
    </>
  );
}
