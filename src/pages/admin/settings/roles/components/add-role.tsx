import type { IGroupedPermissions, IRole } from "@/utils/interfaces/IRole";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  Alert,
} from "@mui/joy";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import PermissionTable from "./permission-table";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import Modal from "@/components/modal";
import { useAppDispatch } from "@/stores/hooks";
import { getRole } from "@/stores/features/role/role-action";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  data?: IRole;
}

// 1. Skema Validasi Zod
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

  useEffect(() => {
    http
      .get("/permissions")
      .then(({ data }) => {
        setPermission(data);
      })
      .catch((err) => notifyError(err));
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // 3. Reset form saat modal dibuka atau saat data edit masuk
  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        name: data.name,
        description: data.description,
      });
      setSelectedIds(data.permissions.map((e) => e.id));
    } else {
      reset({ name: "", description: "" });
    }
  }, [data, reset, open]);

  const onSubmit = async (formData: FormData) => {
    if (selectedIds.length === 0) {
      setError("Permission Tidak Boleh Kosong");

      return;
    }
    setLoading(true);
    const payload = {
      ...formData,
      permissionId: selectedIds,
    };

    try {
      http
        .post("/roles", payload)
        .then(({ data }) => {
          setOpen(false);
          reset();
          setSelectedIds([]);
          notify(data.message);
          dispatch(getRole());
        })
        .catch((err) => notifyError(err))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      description="Isi informasi role untuk mengatur hak akses pengguna."
      isLoading={loading}
      open={open}
      size="full"
      title={data ? "Edit Role" : "Tambah Role Baru"}
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      onSave={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-3 gap-4 relative">
        <div className="sticky top-32">
          <Stack spacing={2.5} sx={{ mt: 2 }}>
            {/* Input Nama Role */}
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormControl error={!!errors.name}>
                  <FormLabel>Nama Role</FormLabel>
                  <Input {...field} placeholder="Contoh: Owner" />
                  {errors.name && (
                    <FormHelperText>{errors.name.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Input Deskripsi */}
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <FormControl error={!!errors.description}>
                  <FormLabel>Deskripsi</FormLabel>
                  <Textarea
                    {...field}
                    minRows={3}
                    placeholder="Jelaskan tanggung jawab role ini..."
                  />
                  {errors.description && (
                    <FormHelperText>
                      {errors.description.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            {error && <Alert color="danger">{error}</Alert>}
          </Stack>
        </div>
        <div className="col-span-2">
          {permissions && (
            <PermissionTable
              data={permissions}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
