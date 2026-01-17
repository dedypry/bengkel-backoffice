import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  AspectRatio,
  Chip,
  List,
  ListItem,
  ListItemContent,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  Sheet,
} from "@mui/joy";
import {
  Tag,
  Info,
  Database,
  DollarSign,
  MapPin,
  AlertTriangle,
  ChevronRight,
  Edit,
  Package,
} from "lucide-react";

import { formatIDR } from "@/utils/helpers/format";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { getProductDetail } from "@/stores/features/product/product-action";

export default function ProductDetail() {
  const { product } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }
  }, [id]);

  if (!product) {
    return <p>Product Not Found</p>;
  }

  const getStockStatus = (
    current: any,
    min: any,
  ): {
    label: string;
    color: "danger" | "warning" | "success";
    variant: "solid" | "soft";
  } => {
    if (current === 0)
      return { label: "Stok Habis", color: "danger", variant: "solid" };
    if (current <= (min || 5))
      return { label: "Stok Menipis", color: "warning", variant: "soft" };

    return { label: "Stok Tersedia", color: "success", variant: "soft" };
  };

  const status = getStockStatus(product.stock, product.min_stock);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
      {/* Header & Breadcrumbs */}
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ px: 0 }}>
          <Link color="neutral" href="/products">
            Produk
          </Link>
          <Typography>{product.code}</Typography>
        </Breadcrumbs>
        <Button
          color="warning"
          startDecorator={<Edit size={18} />}
          variant="soft"
        >
          Edit Produk
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Kolom Kiri: Gambar & Ringkasan Cepat */}
        <Grid md={4} xs={12}>
          <Card sx={{ p: 0, overflow: "hidden" }} variant="outlined">
            <AspectRatio ratio="1">
              {product.image ? (
                <img
                  alt={product.name}
                  loading="lazy"
                  src={
                    product.image ||
                    "https://via.placeholder.com/400x400?text=No+Image"
                  }
                />
              ) : (
                <Package className="text-primary" />
              )}
            </AspectRatio>
            <Box sx={{ p: 2 }}>
              <Typography level="body-xs" sx={{ mb: 0.5 }}>
                Kode Produk
              </Typography>
              <Typography color="primary" fontWeight="xl" level="title-lg">
                {product.code}
              </Typography>
              <Chip
                color={status.color}
                size="sm"
                startDecorator={<Info size={14} />}
                sx={{ mt: 1 }}
                variant={status.variant}
              >
                {status.label}
              </Chip>
            </Box>
          </Card>
        </Grid>

        {/* Kolom Kanan: Informasi Detail */}
        <Grid md={8} xs={12}>
          <Stack spacing={3}>
            {/* Nama & Deskripsi */}
            <Box>
              <Typography component="h1" level="h2">
                {product.name}
              </Typography>
              <Typography
                level="body-md"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                {product.description || "Tidak ada deskripsi produk."}
              </Typography>
            </Box>
            {/* Grid Informasi Utama */}
            <Grid container spacing={2}>
              {/* Card Stok */}
              <Grid sm={6} xs={12}>
                <Card color="neutral" variant="soft">
                  <Typography
                    level="title-sm"
                    startDecorator={<Database size={18} />}
                  >
                    Inventory
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography level="body-xs">Stok Saat Ini</Typography>
                      <Typography level="h3">
                        {product.stock}{" "}
                        <Typography level="body-sm">
                          {product.uom?.name || product.unit}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography level="body-xs">Batas Minimum</Typography>
                      <Typography color="danger" level="title-md">
                        {product.min_stock || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Card Lokasi & Kategori */}
              <Grid sm={6} xs={12}>
                <Card variant="outlined">
                  <List sx={{ "--ListItem-paddingLeft": "0px" }}>
                    <ListItem>
                      <ListItemContent>
                        <Typography level="body-xs">Kategori</Typography>
                        <Typography
                          level="title-sm"
                          startDecorator={<Tag size={16} />}
                        >
                          {product.category?.name || "-"}
                        </Typography>
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        <Typography level="body-xs">Lokasi Rak</Typography>
                        <Typography
                          level="title-sm"
                          startDecorator={<MapPin size={16} />}
                        >
                          {product.location || "Belum diatur"}
                        </Typography>
                      </ListItemContent>
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
            {/* Informasi Harga */}
            <Sheet
              sx={{ p: 2, borderRadius: "sm", bgcolor: "background.surface" }}
              variant="outlined"
            >
              <Typography
                level="title-md"
                startDecorator={<DollarSign size={18} />}
                sx={{ mb: 2 }}
              >
                Finansial
              </Typography>
              <Grid container spacing={2}>
                <Grid sm={4} xs={6}>
                  <Typography level="body-xs">Harga Beli</Typography>
                  <Typography level="title-lg">
                    {formatIDR(Number(product.purchase_price))}
                  </Typography>
                </Grid>
                <Grid sm={4} xs={6}>
                  <Typography level="body-xs">Harga Jual</Typography>
                  <Typography color="primary" level="title-lg">
                    {formatIDR(Number(product.sell_price))}
                  </Typography>
                </Grid>
                <Grid sm={4} xs={12}>
                  <Typography level="body-xs">PPN</Typography>
                  <Typography level="title-lg">{product.ppn || 0}%</Typography>
                </Grid>
              </Grid>
            </Sheet>
            {/* Status Aktif */}
            <AlertTriangle size={18} style={{ display: "none" }} />{" "}
            {/* Pre-fetch icon */}
            {!product.is_active && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "danger.softBg",
                  borderRadius: "sm",
                  display: "flex",
                  gap: 2,
                }}
              >
                <AlertTriangle color="red" />
                <Typography color="danger" level="body-sm">
                  Produk ini dalam status non-aktif dan tidak akan muncul di
                  POS.
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
