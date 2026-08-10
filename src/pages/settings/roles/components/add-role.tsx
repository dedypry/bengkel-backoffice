import type { IGroupedPermissions, IRole } from "@/utils/interfaces/IRole";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { TFunction } from "i18next";
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

const createRoleSchema = (t: TFunction) =>
  z.object({
    id: z.number().optional(),
    name: z.string().min(3, t("settings.roles.validation_name_min")),
    description: z.string().optional(),
  });

type FormData = z.infer<ReturnType<typeof createRoleSchema>>;

export default function AddRole({ open, setOpen, data }: Props) {
  const { t } = useTranslation();
  const [permissions, setPermission] = useState<IGroupedPermissions>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const roleSchema = useMemo(() => createRoleSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roleSchema),
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
      setSelectedIds((data.permissions || []).map((e) => e.id));
      setError("");
    } else if (open) {
      reset({ name: "", description: "" });
      setSelectedIds([]);
      setError("");
    }
  }, [data, reset, open]);

  const onSubmit = async (formData: FormData) => {
    if (selectedIds.length === 0) {
      setError(t("settings.roles.validation_permission_min"));

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
      description={t("settings.roles.add_modal_desc")}
      isLoading={loading}
      open={open}
      size="full"
      title={
        data
          ? t("settings.roles.add_modal_edit")
          : t("settings.roles.add_modal_create")
      }
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      onSave={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-0">
            <Card className="border border-gray-200">
              <CardBody className="space-y-6 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gray-500 p-2 rounded-sm text-white">
                    <Info size={18} />
                  </div>
                  <h4 className="text-sm font-black uppercase text-gray-500">
                    {t("settings.roles.role_identity")}
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
                      label={t("settings.roles.role_name")}
                      placeholder={t("settings.roles.role_name_placeholder")}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label={t("settings.roles.role_description")}
                      minRows={4}
                      placeholder={t(
                        "settings.roles.role_description_placeholder",
                      )}
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
                    description={`${selectedIds.length}${t("settings.roles.permissions_granted")}`}
                    title={t("settings.roles.config_status")}
                  />
                  {error && (
                    <Alert
                      classNames={{ base: "rounded-sm" }}
                      color="danger"
                      icon={<ShieldAlert size={18} />}
                      title={t("settings.roles.access_denied")}
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
              title={t("settings.roles.permission_warning")}
              variant="flat"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="border border-gray-200 overflow-hidden shadow-sm">
            <CardBody className="p-4">
              <div className="border-b pb-2 border-gray-200 flex items-center justify-between">
                <h4 className="text-sm font-black uppercase  text-gray-500">
                  {t("settings.roles.permission_matrix")}
                </h4>
                <Chip color="success" size="sm" variant="dot">
                  {t("settings.roles.system_live")}
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
