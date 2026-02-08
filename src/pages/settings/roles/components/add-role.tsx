import type { IGroupedPermissions, IRole } from "@/utils/interfaces/IRole";

import { useEffect, useRef, useState } from "react";
import {
  Input,
  Textarea,
  Alert,
  Divider,
  Chip,
  Card,
  CardBody,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldAlert, Info } from "lucide-react";

import PermissionTable from "./permission-table";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getRole } from "@/stores/features/role/role-action";
import Modal from "@/components/modal";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  data?: IRole;
}

const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Nama role minimal 3 karakter"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddRole({ open, setOpen, data }: Props) {
  const [permissions, setPermission] = useState<IGroupedPermissions>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      http
        .get("/permissions")
        .then(({ data }) => setPermission(data))
        .catch(notifyError);

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (data && open) {
      reset({ id: data.id, name: data.name, description: data.description });
      setSelectedIds(data.permissions.map((e) => e.id));
      setError("");
    } else if (open) {
      reset({ name: "", description: "" });
      setSelectedIds([]);
      setError("");
    }
  }, [data, reset, open]);

  const onSubmit = async (formData: FormData) => {
    if (selectedIds.length === 0) {
      setError("Anda harus memilih minimal satu permission untuk role ini.");

      return;
    }

    setLoading(true);
    const payload = { ...formData, permissionId: selectedIds };

    http
      .post("/roles", payload)
      .then(({ data }) => {
        setOpen(false);
        notify(data.message);
        dispatch(getRole());
      })
      .catch(notifyError)
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      description="Konfigurasikan tingkat akses keamanan untuk setiap modul bengkel."
      isLoading={loading}
      open={open}
      size="full"
      title={data ? "Update Role Security" : "Daftarkan Role Baru"}
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      onSave={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Metadata (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-0">
            <Card className="border border-gray-200">
              <CardBody className="space-y-6 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gray-500 p-2 rounded-sm text-white">
                    <Info size={18} />
                  </div>
                  <h4 className="text-sm font-black uppercase text-gray-500">
                    Identitas Role
                  </h4>
                </div>

                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label="Nama Role"
                      placeholder="Contoh: Kepala Mekanik"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Deskripsi Tanggung Jawab"
                      minRows={4}
                      placeholder="Jelaskan cakupan wewenang role ini..."
                    />
                  )}
                />

                <Divider />

                <div className="space-y-3">
                  <Alert
                    classNames={{
                      title: "text-xs font-semibold text-gray-400",
                      description: "font-bold text-gray-700",
                    }}
                    color="warning"
                    description={`${selectedIds.length} Hak Akses Diberikan`}
                    title=" Status Konfigurasi"
                  />
                  {/* <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-400">
                      Total Hak Akses
                    </span>
                    <Chip color="primary" size="sm" variant="flat">
                      {selectedIds.length} Terpilih
                    </Chip>
                  </div> */}
                  {error && (
                    <Alert
                      classNames={{ base: "rounded-sm" }}
                      color="danger"
                      icon={<ShieldAlert size={18} />}
                      title="Akses Ditolak"
                      variant="flat"
                    >
                      {error}
                    </Alert>
                  )}
                </div>
              </CardBody>
            </Card>

            <Alert
              hideIcon
              className="hidden lg:block mt-2"
              classNames={{
                title: "text-xs",
                mainWrapper: "flex flex-row items-center gap-2",
              }}
              color="danger"
              title={`Perubahan pada permission akan berdampak langsung pada semua
                pengguna yang memiliki role ini. Mohon lakukan verifikasi
                sebelum menyimpan.`}
              variant="flat"
            />
          </div>
        </div>

        {/* Kolom Kanan: Matriks Permission */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 overflow-hidden shadow-sm">
            <CardBody className="p-4">
              <div className="border-b pb-2 border-gray-200 flex items-center justify-between">
                <h4 className="text-sm font-black uppercase  text-gray-500">
                  Matriks Hak Akses
                </h4>
                <Chip color="success" size="sm" variant="dot">
                  System Live
                </Chip>
              </div>
              <div className="p-4">
                {permissions && (
                  <PermissionTable
                    data={permissions}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Modal>
  );
}
