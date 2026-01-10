import {
  Search,
  Tag,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  TicketPercent,
} from "lucide-react";
import {
  Button,
  Input,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Box,
} from "@mui/joy";

import AddPromo from "./components/add-promo";

import HeaderAction from "@/components/header-action";

// Data Dummy Promo
const promos = [
  {
    id: 1,
    title: "Promo Awal Tahun 2026",
    code: "TAHUNBARU26",
    discount: "15%",
    status: "Aktif",
    period: "01 Jan - 31 Jan 2026",
    type: "Service",
  },
  {
    id: 2,
    title: "Diskon Ulang Tahun Pelanggan",
    code: "HBDUSER",
    discount: "Rp 50.000",
    status: "Aktif",
    period: "Selamanya",
    type: "Global",
  },
  {
    id: 3,
    title: "Flash Sale Ganti Oli",
    code: "OLIMURAH",
    discount: "20%",
    status: "Berakhir",
    period: "05 Jan - 07 Jan 2026",
    type: "Sparepart",
  },
];

export default function PromoPage() {
  return (
    <Box className="space-y-6 p-1">
      {/* Header dengan Tombol Tambah */}
      <HeaderAction
        actionContent={<AddPromo />}
        leadIcon={TicketPercent}
        subtitle="Kelola kode voucher dan diskon layanan bengkel Anda."
        title="Daftar Promo"
      />

      {/* Filter Bar */}
      <Card sx={{ py: 1.5, px: 2, borderRadius: "md" }} variant="outlined">
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Input
            placeholder="Cari nama atau kode promo..."
            startDecorator={<Search size={18} />}
            sx={{ flex: 1 }}
          />
          <Divider orientation="vertical" />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="neutral" size="sm" variant="soft">
              Semua
            </Button>
            <Button color="neutral" size="sm" variant="plain">
              Aktif
            </Button>
            <Button color="neutral" size="sm" variant="plain">
              Berakhir
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Grid List Promo */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        {promos.map((promo) => (
          <Card
            key={promo.id}
            sx={{ "--Card-radius": "16px", boxShadow: "sm" }}
            variant="outlined"
          >
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Chip
                  color={promo.status === "Aktif" ? "success" : "danger"}
                  size="sm"
                  startDecorator={
                    promo.status === "Aktif" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )
                  }
                  variant="soft"
                >
                  {promo.status}
                </Chip>

                <Dropdown>
                  <MenuButton
                    slotProps={{
                      root: { variant: "plain", color: "neutral", size: "sm" },
                    }}
                    slots={{ root: IconButton }}
                  >
                    <MoreVertical size={18} />
                  </MenuButton>
                  <Menu placement="bottom-end" size="sm">
                    <MenuItem>Edit Promo</MenuItem>
                    <MenuItem>Lihat Performa</MenuItem>
                    <Divider />
                    <MenuItem color="danger" variant="soft">
                      Hapus
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </Box>

              <Typography level="title-lg" sx={{ mt: 1 }}>
                {promo.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 0.5,
                  mb: 2,
                }}
              >
                <Tag className="text-slate-400" size={14} />
                <Typography
                  fontWeight="bold"
                  level="body-xs"
                  sx={{ color: "#168BAB", letterSpacing: "0.5px" }}
                >
                  {promo.code}
                </Typography>
              </Box>

              <Divider inset="none" />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Clock className="text-slate-400" size={16} />
                    <Typography level="body-xs">Besar Diskon</Typography>
                  </Box>
                  <Typography color="primary" level="title-sm">
                    {promo.discount}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar className="text-slate-400" size={16} />
                    <Typography level="body-xs">Periode</Typography>
                  </Box>
                  <Typography fontWeight="md" level="body-xs">
                    {promo.period}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
