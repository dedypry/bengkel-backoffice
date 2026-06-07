import type { IAttendanceDevice } from "@/utils/interfaces/IAttendance";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
} from "@heroui/react";
import { z } from "zod";
import { Cpu, Info, Save, X } from "lucide-react";

import config from "@/config/api";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getAttendanceDevices } from "@/stores/features/attendance/attendance-action";

const schema = z.object({
  serial_number: z.string().min(1, "Serial number wajib diisi"),
  name: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  device?: IAttendanceDevice | null;
  onClose?: () => void;
}

export default function DeviceModal({
  open,
  setOpen,
  device,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const serverUrl = `${config.api}/iclock/cdata`;

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serial_number: "",
      name: "",
      location: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (open && device) {
      reset({
        serial_number: device.serial_number,
        name: device.name || "",
        location: device.location || "",
        is_active: device.is_active,
      });
    } else if (open) {
      reset({
        serial_number: "",
        name: "",
        location: "",
        is_active: true,
      });
    }
  }, [device, open]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    reset();
  };

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    http
      .post("/attendances/devices", data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getAttendanceDevices());
        handleClose();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={open}
      scrollBehavior="outside"
      size="2xl"
      onOpenChange={handleClose}
    >
      <form id="device-form" onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-sm bg-primary/10 text-primary">
              <Cpu size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black uppercase">
                {device?.id ? "Ubah Mesin Absensi" : "Daftarkan Mesin Absensi"}
              </h2>
              <p className="text-tiny font-medium text-gray-400">
                Mesin fingerprint/face yang mendukung protokol ADMS.
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm flex gap-3">
              <Info className="text-blue-500 shrink-0" size={18} />
              <div className="text-xs text-blue-700 space-y-1">
                <p className="font-bold uppercase">Cara menghubungkan mesin</p>
                <p>
                  Pada menu <b>Comm / Cloud Server (ADMS)</b> di mesin, isi
                  alamat server berikut lalu aktifkan domain name:
                </p>
                <code className="block bg-white px-2 py-1 rounded border border-blue-100 break-all">
                  {serverUrl}
                </code>
                <p>
                  Serial Number harus sama persis dengan SN yang tertera pada
                  mesin. Punch yang masuk otomatis terhubung ke karyawan via PIN
                  / NIK.
                </p>
              </div>
            </div>

            <Controller
              control={control}
              name="serial_number"
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  label="Serial Number (SN)"
                  labelPlacement="inside"
                  placeholder="Mis. CGXX204860333"
                  value={field.value}
                  variant="faded"
                  onValueChange={field.onChange}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    label="Nama Mesin"
                    labelPlacement="inside"
                    placeholder="Mesin Lobby"
                    value={field.value || ""}
                    variant="faded"
                    onValueChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <Input
                    label="Lokasi"
                    labelPlacement="inside"
                    placeholder="Pintu Masuk"
                    value={field.value || ""}
                    variant="faded"
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm border border-gray-100">
                  <span className="text-sm font-bold text-gray-600 uppercase">
                    Mesin Aktif
                  </span>
                  <Switch
                    color="success"
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              startContent={<X size={18} />}
              variant="flat"
              onPress={handleClose}
            >
              Batal
            </Button>
            <Button
              color="primary"
              isLoading={loading}
              startContent={!loading && <Save size={18} />}
              type="submit"
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
