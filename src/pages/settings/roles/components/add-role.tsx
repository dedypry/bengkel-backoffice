import type { IGroupedPermissions, IRole } from "@/utils/interfaces/IRole";

import { useEffect, useState } from "react";
import { Input, Textarea, Alert, Divider, Chip } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldAlert, Info, KeyRound } from "lucide-react";

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
    http
      .get("/permissions")
      .then(({ data }) => setPermission(data))
      .catch(notifyError);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-2">
        {/* Kolom Kiri: Metadata (Sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4 space-y-6">
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gray-900 p-2 rounded-xl text-white">
                  <Info size={18} />
                </div>
                <h4 className="text-sm font-black uppercase italic tracking-widest text-gray-800">
                  Identitas Role
                </h4>
              </div>

              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    classNames={{
                      label:
                        "font-bold text-gray-700 uppercase text-[11px] tracking-widest",
                    }}
                    errorMessage={errors.name?.message}
                    isInvalid={!!errors.name}
                    label="Nama Role"
                    labelPlacement="outside"
                    placeholder="Contoh: Kepala Mekanik"
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
                        "font-bold text-gray-700 uppercase text-[11px] tracking-widest",
                    }}
                    label="Deskripsi Tanggung Jawab"
                    labelPlacement="outside"
                    minRows={4}
                    placeholder="Jelaskan cakupan wewenang role ini..."
                    variant="bordered"
                  />
                )}
              />

              <Divider />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400 italic">
                    Total Hak Akses
                  </span>
                  <Chip
                    className="font-black italic"
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    {selectedIds.length} Selected
                  </Chip>
                </div>
                {error && (
                  <Alert
                    classNames={{ base: "rounded-2xl" }}
                    color="danger"
                    icon={<ShieldAlert size={18} />}
                    title="Akses Ditolak"
                    variant="flat"
                  >
                    {error}
                  </Alert>
                )}
              </div>
            </div>

            <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 hidden lg:block">
              <div className="flex gap-3">
                <KeyRound className="text-rose-500 shrink-0" size={20} />
                <p className="text-[11px] text-rose-700 font-medium italic">
                  Perubahan pada permission akan berdampak langsung pada semua
                  pengguna yang memiliki role ini. Mohon lakukan verifikasi
                  sebelum menyimpan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Matriks Permission */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h4 className="text-sm font-black uppercase italic tracking-widest text-gray-800">
                Matriks Hak Akses
              </h4>
              <Chip
                className="font-bold border-none"
                color="success"
                size="sm"
                variant="dot"
              >
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
          </div>
        </div>
      </div>
    </Modal>
  );
}
