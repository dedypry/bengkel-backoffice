import type { ISupplier } from "@/utils/interfaces/ISupplier";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  IconButton,
  Table,
  Sheet,
  Chip,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Divider,
  CardContent,
  Card,
} from "@mui/joy";
import {
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
} from "lucide-react";

import AddModal from "./components/add-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setSupplierQuery } from "@/stores/features/supplier/supplier-slice";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";

export default function SupplierList() {
  const { suppliers, supplierQuery } = useAppSelector(
    (state) => state.supplier,
  );
  const { company } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [supplier, seSupplier] = useState<ISupplier>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getSupplier(supplierQuery));
    }
  }, [supplierQuery, company]);

  function handleDelete(id: number) {
    http
      .delete(`/suppliers/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getSupplier(supplierQuery));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div>
      <AddModal open={open} setOpen={setOpen} supplier={supplier} />
      {/* Header Section */}
      <HeaderAction
        actionIcon={Plus}
        actionTitle="Tambah Supplier"
        subtitle="Kelola data vendor dan penyedia jasa bengkel Anda."
        title="Master Supplier"
        onAction={() => setOpen(true)}
      />

      {/* Filter Section */}
      <Card sx={{ mt: 2 }} variant="outlined">
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Input
              placeholder="Cari nama, kode, atau email..."
              startDecorator={<Search size={18} />}
              sx={{ flex: 1 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              startDecorator={<Search size={18} />}
              onClick={() => dispatch(setSupplierQuery({ q: search }))}
            >
              Cari
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Sheet
            sx={{
              minHeight: 400,
            }}
          >
            <Table
              hoverRow
              stickyHeader
              sx={{ "& tr > *": { verticalAlign: "middle" } }}
            >
              <thead>
                <tr>
                  <th style={{ width: 120 }}>Kode</th>
                  <th>Nama Supplier</th>
                  <th>Kontak</th>
                  <th>Info Tambahan</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 60 }} />
                </tr>
              </thead>
              <tbody>
                {suppliers?.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "80px 0" }}
                    >
                      <Stack alignItems="center" spacing={2}>
                        {/* Ilustrasi Icon */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                            height: 80,
                            backgroundColor:
                              "var(--joy-palette-neutral-softBg)",
                            borderRadius: "50%",
                            color: "var(--joy-palette-neutral-tertiaryChannel)",
                          }}
                        >
                          <Search size={40} />
                        </Box>

                        <Box>
                          <Typography level="title-lg" sx={{ mb: 1 }}>
                            Supplier Tidak Ditemukan
                          </Typography>
                          <Typography level="body-sm">
                            {search
                              ? `Tidak ada hasil untuk pencarian "${search}". Coba gunakan kata kunci lain.`
                              : "Daftar supplier Anda masih kosong. Mulai tambahkan vendor untuk manajemen inventaris yang lebih baik."}
                          </Typography>
                        </Box>

                        {!search && (
                          <Button
                            startDecorator={<Plus size={18} />}
                            sx={{ mt: 1 }}
                            onClick={() => setOpen(true)}
                          >
                            Tambah Supplier Pertama
                          </Button>
                        )}
                      </Stack>
                    </td>
                  </tr>
                ) : (
                  suppliers?.data.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Typography fontWeight="bold" level="body-xs">
                          {item.code}
                        </Typography>
                      </td>
                      <td>
                        <Stack>
                          <Typography level="title-sm">{item.name}</Typography>
                          <Typography
                            noWrap
                            level="body-xs"
                            startDecorator={<MapPin size={12} />}
                            sx={{ display: "block" }}
                          >
                            {item.address || "Alamat belum diatur"}
                          </Typography>
                        </Stack>
                      </td>
                      <td>
                        <Stack spacing={0.5}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Phone className="text-slate-400" size={14} />
                            <Typography level="body-sm">
                              {item.phone || "-"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Mail className="text-slate-400" size={14} />
                            <Typography level="body-sm">
                              {item.email || "-"}
                            </Typography>
                          </Box>
                        </Stack>
                      </td>
                      <td>
                        <Stack spacing={0.5}>
                          <Typography level="body-xs">
                            NPWP: {item.npwp || "-"}
                          </Typography>
                          {item.website && (
                            <Typography
                              color="primary"
                              level="body-xs"
                              startDecorator={<ExternalLink size={12} />}
                            >
                              {item.website}
                            </Typography>
                          )}
                        </Stack>
                      </td>
                      <td>
                        <Chip
                          color={item.is_active ? "success" : "neutral"}
                          size="sm"
                          variant="soft"
                        >
                          {item.is_active ? "Aktif" : "Non-Aktif"}
                        </Chip>
                      </td>
                      <td>
                        <Dropdown>
                          <MenuButton
                            slotProps={{
                              root: {
                                variant: "plain",
                                color: "neutral",
                                size: "sm",
                              },
                            }}
                            slots={{ root: IconButton }}
                          >
                            <MoreVertical size={18} />
                          </MenuButton>
                          <Menu
                            placement="bottom-end"
                            size="sm"
                            variant="outlined"
                          >
                            <MenuItem
                              onClick={() => {
                                seSupplier(item);
                                setOpen(true);
                              }}
                            >
                              <Edit2 size={16} /> Edit Data
                            </MenuItem>
                            <Divider />
                            <MenuItem
                              color="danger"
                              variant="soft"
                              onClick={() =>
                                confirmSweat(() => handleDelete(item.id))
                              }
                            >
                              <Trash2 size={16} /> Hapus
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Sheet>
          <CustomPagination
            meta={suppliers?.meta!}
            onPageChange={(page) => dispatch(setSupplierQuery({ page }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
