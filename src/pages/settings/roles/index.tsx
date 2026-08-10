import type { IRole } from "@/utils/interfaces/IRole";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Tooltip,
  Card,
  CardBody,
  CardHeader,
  Alert,
} from "@heroui/react";
import { Edit, Search, Trash2, UserPlus2, Users2 } from "lucide-react";

import AddRole from "./components/add-role";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getRole } from "@/stores/features/role/role-action";
import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";

export default function RolesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { roles } = useAppSelector((state) => state.role);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | undefined>();
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getRole());
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [dispatch]);

  const handleDelete = (id: number) => {
    http
      .delete(`/roles/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getRole());
      })
      .catch((err) => notifyError(err));
  };

  const onEdit = (role: IRole) => {
    setSelectedRole(role);
    setOpen(true);
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <AddRole
        data={selectedRole}
        open={open}
        setOpen={(val) => {
          setOpen(val);
          if (!val) setSelectedRole(undefined);
        }}
      />

      <HeaderAction
        actionIcon={UserPlus2}
        actionTitle={t("settings.roles.add")}
        leadIcon={Users2}
        subtitle={t("settings.roles.subtitle")}
        title={t("settings.roles.title")}
        onAction={() => setOpen(true)}
      />

      <Card>
        <CardHeader className="flex justify-end">
          <div>
            <Input
              isClearable
              placeholder={t("settings.roles.search_placeholder")}
              startContent={<Search className="text-gray-400" size={18} />}
              value={searchTerm}
              variant="bordered"
              onValueChange={setSearchTerm}
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table
            isHeaderSticky
            removeWrapper
            aria-label={t("settings.roles.table_aria")}
          >
            <TableHeader>
              <TableColumn>{t("settings.roles.col_name")}</TableColumn>
              <TableColumn>{t("settings.roles.col_slug")}</TableColumn>
              <TableColumn>{t("settings.roles.col_description")}</TableColumn>
              <TableColumn>{t("settings.roles.col_security")}</TableColumn>
              <TableColumn align="center">
                {t("settings.roles.col_actions")}
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={t("settings.roles.empty")}>
              {filteredRoles.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">
                      {row.slug}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-gray-500 max-w-xs line-clamp-2 italic font-medium">
                      {row.description || t("settings.roles.no_description")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="border-none font-black text-[9px] uppercase italic"
                      color={row.slug === "super-admin" ? "danger" : "success"}
                      variant="dot"
                    >
                      {row.slug === "super-admin"
                        ? t("settings.roles.system_core")
                        : t("settings.roles.active_role")}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center justify-center gap-2">
                      <Tooltip
                        content={t("settings.roles.edit_role")}
                        delay={1000}
                      >
                        <Button
                          isIconOnly
                          className="text-gray-400 hover:text-gray-900"
                          size="sm"
                          variant="light"
                          onPress={() => onEdit(row)}
                        >
                          <Edit size={18} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        color="danger"
                        content={t("settings.roles.delete_role")}
                      >
                        <Button
                          isIconOnly
                          className="text-gray-300 hover:text-rose-500"
                          size="sm"
                          variant="light"
                          onPress={() =>
                            confirmSweat(() => handleDelete(row.id))
                          }
                        >
                          <Trash2 size={18} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Alert
        classNames={{
          description: "text-xs text-gray-500 italic",
          iconWrapper: "text-warning",
        }}
        description={t("settings.roles.tips_desc")}
        title={t("common.tips")}
      />
    </div>
  );
}
