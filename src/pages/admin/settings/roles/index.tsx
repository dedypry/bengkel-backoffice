import type { IRole } from "@/utils/interfaces/IRole";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  Sheet,
  Input,
  IconButton,
  Chip,
  Card,
} from "@mui/joy";
import { Edit, Search, Trash2, UserPlus2, Users2 } from "lucide-react";

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
  const [role, setRole] = useState<IRole>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRole());
  }, []);

  function handleDelete(id: number) {
    http
      .delete(`/roles/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getRole());
      })
      .catch((err) => notifyError(err));
  }

  return (
    <Box sx={{ pb: 10 }}>
      <AddRole data={role} open={open} setOpen={setOpen} />
      {/* Header Section */}
      <HeaderAction
        actionIcon={UserPlus2}
        actionTitle="Tambah Role Baru"
        leadIcon={Users2}
        subtitle="Kelola hak akses dan peran pengguna dalam sistem bengkel."
        title="Pengaturan Role"
        onAction={() => setOpen(true)}
      />

      {/* Filter Card */}
      <Card sx={{ my: 4, boxShadow: "sm" }}>
        <Input
          placeholder="Cari nama role atau slug..."
          startDecorator={<Search />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Table Section */}
      <Sheet
        sx={{
          width: "100%",
          overflow: "auto",
          minHeight: 0,
          boxShadow: "sm",
        }}
      >
        <Table
          hoverRow
          stickyHeader
          aria-label="roles table"
          sx={{
            "--TableCell-paddingX": "1.5rem",
            "--TableCell-paddingY": "1rem",
            "& thead th": { bgcolor: "background.surface" },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 200 }}>Nama Role</th>
              <th style={{ width: 150 }}>Slug</th>
              <th>Deskripsi</th>
              <th style={{ width: 150 }}>Diperbarui Oleh</th>
              <th style={{ width: 120, textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography fontWeight="bold" level="title-sm">
                    {row.name}
                  </Typography>
                </td>
                <td>
                  <Chip color="neutral" size="sm" variant="soft">
                    {row.slug}
                  </Chip>
                </td>
                <td>
                  <Typography
                    level="body-sm"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {row.description}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">{"-"}</Typography>
                </td>
                <td>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      color="neutral"
                      size="sm"
                      variant="soft"
                      onClick={() => {
                        setRole(row);
                        setOpen(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="danger"
                      size="sm"
                      variant="soft"
                      onClick={() => confirmSweat(() => handleDelete(row.id))}
                    >
                      <Trash2 fontSize="small" />
                    </IconButton>
                  </Box>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "3rem" }}
                >
                  <Typography color="neutral">
                    Tidak ada role ditemukan.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
