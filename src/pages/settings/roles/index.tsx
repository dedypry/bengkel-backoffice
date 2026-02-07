import type { IRole } from "@/utils/interfaces/IRole";

import { useEffect, useState } from "react";
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
} from "@heroui/react";
import {
  Edit,
  Search,
  Trash2,
  UserPlus2,
  Users2,
  ShieldCheck,
} from "lucide-react";

import AddRole from "./components/add-role";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getRole } from "@/stores/features/role/role-action";
import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { roles } = useAppSelector((state) => state.role);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | undefined>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRole());
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
        actionTitle="Tambah Role"
        leadIcon={Users2}
        subtitle="Kelola hak akses dan peran pengguna dalam sistem bengkel secara hierarkis."
        title="Pengaturan Role"
        onAction={() => setOpen(true)}
      />

      {/* HeroUI Table */}
      <Card>
        <CardHeader className="flex justify-end">
          <div>
            <Input
              isClearable
              placeholder="Cari nama role atau slug..."
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
            aria-label="Tabel Role dan Hak Akses"
          >
            <TableHeader>
              <TableColumn>NAMA ROLE</TableColumn>
              <TableColumn>SLUG / IDENTIFIER</TableColumn>
              <TableColumn>DESKRIPSI</TableColumn>
              <TableColumn>STATUS KEAMANAN</TableColumn>
              <TableColumn align="center">AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Tidak ada role yang ditemukan"}>
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
                      {row.description || "Tidak ada deskripsi tersedia."}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="border-none font-black text-[9px] uppercase italic"
                      color={row.slug === "super-admin" ? "danger" : "success"}
                      variant="dot"
                    >
                      {row.slug === "super-admin"
                        ? "System Core"
                        : "Active Role"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center justify-center gap-2">
                      <Tooltip content="Edit Role" delay={1000}>
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
                      <Tooltip color="danger" content="Hapus Role">
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

      {/* Policy Tip */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm flex items-center gap-4">
        <div className="size-10 bg-white rounded-sm shadow-sm flex items-center justify-center">
          <ShieldCheck className="text-rose-500" size={20} />
        </div>
        <p className="text-xs text-gray-500 font-medium italic">
          <strong className="text-gray-900 uppercase tracking-widest">
            Tips:
          </strong>{" "}
          Pastikan setiap role memiliki hak akses minimum (Principle of Least
          Privilege) untuk menjaga keamanan data bengkel.
        </p>
      </div>
    </div>
  );
}
