import React, { useEffect } from "react";
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

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setSupplierQuery } from "@/stores/features/supplier/supplier-slice";
import { confirmSweat } from "@/utils/helpers/notify";
import HeaderAction from "@/components/header-action";

export default function SupplierList() {
  const { suppliers, supplierQuery } = useAppSelector(
    (state) => state.supplier,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSupplier(supplierQuery));
  }, []);

  return (
    <div>
      {/* Header Section */}
      <HeaderAction
        actionIcon={Plus}
        actionTitle="Tambah Supplier"
        subtitle="Kelola data vendor dan penyedia jasa bengkel Anda."
        title="Master Supplier"
      />

      {/* Filter Section */}
      <Card sx={{ mt: 2 }} variant="outlined">
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Input
              placeholder="Cari nama, kode, atau email..."
              startDecorator={<Search size={18} />}
              sx={{ flex: 1 }}
            />
            <Button>Reset Filter</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Sheet
        sx={{
          width: "100%",
          mt: 2,
          borderRadius: "lg",
          overflow: "auto",
          minHeight: 400,
        }}
        variant="outlined"
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
            {suppliers?.data.map((item) => (
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
                      level="body-xs"
                      startDecorator={<MapPin size={12} />}
                    >
                      {item.address || "Alamat belum diatur"}
                    </Typography>
                  </Stack>
                </td>
                <td>
                  <Stack spacing={0.5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone className="text-slate-400" size={14} />
                      <Typography level="body-sm">
                        {item.phone || "-"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    <Menu placement="bottom-end" size="sm" variant="outlined">
                      <MenuItem>
                        <Edit2 size={16} /> Edit Data
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        color="danger"
                        variant="soft"
                        onClick={() => confirmSweat(() => {})}
                      >
                        <Trash2 size={16} /> Hapus
                      </MenuItem>
                    </Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <CustomPagination
          meta={suppliers?.meta!}
          onPageChange={(page) => dispatch(setSupplierQuery({ page }))}
        />
      </Sheet>
    </div>
  );
}
