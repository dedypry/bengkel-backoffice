import React, { useEffect } from "react";
import {
  Typography,
  Card,
  Grid,
  Divider,
  Table,
  Sheet,
  Chip,
  Breadcrumbs,
  Link,
  Box,
} from "@mui/joy";
import { Truck, Calendar, User, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProductReceiptDetail } from "@/stores/features/product/product-action";
import { formatIDR } from "@/utils/helpers/format";

export default function ReceiptDetailPage() {
  const { recepipt: data } = useAppSelector((state) => state.product);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getProductReceiptDetail(id));
    }
  }, [id]);
  if (!data) {
    return <p>No Data</p>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ px: 0, mb: 2 }}>
        <Link color="neutral" href="/receipt">
          Goods Receipt
        </Link>
        <Typography>Detail {data.grn_number}</Typography>
      </Breadcrumbs>

      <Typography level="h2" sx={{ mb: 3 }}>
        {data.grn_number}
      </Typography>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Section 1: Info Utama */}
        <Grid md={8} xs={12}>
          <Card variant="outlined">
            <Typography
              level="title-lg"
              startDecorator={<FileText size={20} />}
            >
              Informasi Penerimaan
            </Typography>
            <Divider inset="none" />
            <Grid container spacing={2} sx={{ py: 1 }}>
              <Grid xs={6}>
                <Typography level="body-xs">Nomor PO</Typography>
                <Typography fontWeight="bold" level="body-md">
                  {data.po_number}
                </Typography>
              </Grid>
              <Grid xs={6}>
                <Typography level="body-xs">Supplier</Typography>
                <Typography fontWeight="bold" level="body-md">
                  {data.supplier?.name}
                </Typography>
              </Grid>
              <Grid xs={6}>
                <Typography level="body-xs">Tanggal Terima</Typography>
                <Typography
                  level="body-sm"
                  startDecorator={<Calendar size={14} />}
                >
                  {dayjs(data.receipt_at).format("DD MMM YY")}
                </Typography>
              </Grid>
              <Grid xs={6}>
                <Typography level="body-xs">Penerima (User)</Typography>
                <Typography level="body-sm" startDecorator={<User size={14} />}>
                  {data.received?.name}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Section 2: Logistik */}
        <Grid md={4} xs={12}>
          <Card color="primary" variant="soft">
            <Typography level="title-lg" startDecorator={<Truck size={20} />}>
              Logistik & Pengiriman
            </Typography>
            <Divider inset="none" />
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, py: 1 }}
            >
              <Box>
                <Typography level="body-xs">Ekspedisi / Driver</Typography>
                <Typography level="body-md">
                  {data.expedition} - {data.driver_name}
                </Typography>
              </Box>
              <Box>
                <Typography level="body-xs">Nomor Polisi</Typography>
                <Chip color="neutral" variant="solid">
                  {data.license_plate}
                </Chip>
              </Box>
              <Box>
                <Typography level="body-xs">Nomor Surat Jalan</Typography>
                <Typography fontWeight="bold" level="body-md">
                  {data.delivery_note_no}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Section 3: Tabel Items */}
        <Grid xs={12}>
          <Sheet
            sx={{ borderRadius: "sm", overflow: "auto" }}
            variant="outlined"
          >
            <Table stickyHeader aria-label="items table">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Produk</th>
                  <th>Kondisi</th>
                  <th style={{ textAlign: "center" }}>Qty PO</th>
                  <th style={{ textAlign: "center" }}>Qty Terima</th>
                  <th style={{ textAlign: "right" }}>Harga Satuan</th>
                  <th style={{ textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {data.items?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Typography fontWeight="bold" level="body-sm">
                        {item.product?.name || "Product ID: " + item.product_id}
                      </Typography>
                    </td>
                    <td>
                      <Chip
                        color={item.condition === "GOOD" ? "success" : "danger"}
                        size="sm"
                        variant="outlined"
                      >
                        {item.condition}
                      </Chip>
                    </td>
                    <td style={{ textAlign: "center" }}>{item.qty_po}</td>
                    <td style={{ textAlign: "center" }}>{item.qty_receipt}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatIDR(Number(item.purchase_price))}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatIDR(
                        Number(item.qty_receipt) * Number(item.purchase_price),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={3} style={{ textAlign: "right" }}>
                    Total Item: {data.total_items}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    Total Qty: {data.total_qty}
                  </th>
                  <th colSpan={2} style={{ textAlign: "right" }}>
                    <Typography
                      color="primary"
                      fontWeight={600}
                      level="title-md"
                    >
                      Grand Total: {formatIDR(Number(data.total_amount))}
                    </Typography>
                  </th>
                </tr>
              </tfoot>
            </Table>
          </Sheet>
        </Grid>
      </Grid>
    </Box>
  );
}
