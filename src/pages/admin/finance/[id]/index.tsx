import type { IPayment } from "@/utils/interfaces/IUser";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  Stack,
  Grid,
  Chip,
  Table,
  Sheet,
  IconButton,
} from "@mui/joy";
import { CheckCircle, CreditCard, Printer, Receipt } from "lucide-react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { formatIDR } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";

export default function PaymentDetail() {
  const [data, setData] = useState<IPayment>();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      http
        .get(`/payments/${id}`)
        .then(({ data }) => {
          setData(data);
        })
        .catch((err) => {
          notifyError(err);
        });
    }
  }, [id]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header & Status */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Stack>
          <Typography fontWeight="xl" level="h3">
            Detail Pembayaran
          </Typography>
          <Typography level="body-sm">ID Pembayaran: #{data?.id}</Typography>
        </Stack>
        <Stack alignItems="center" flexDirection="row" gap={1}>
          <Chip
            color="success"
            size="lg"
            startDecorator={<CheckCircle size={18} />}
            variant="soft"
          >
            Lunas
          </Chip>
          <IconButton
            onClick={() =>
              handleDownload(
                `/payments/${id}/print`,
                `struk-${data?.payment_no}`,
                true,
              )
            }
          >
            <Printer />
          </IconButton>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Kolom Kiri: Info Pembayaran */}
        <Grid lg={3} md={4} xs={12}>
          <Card sx={{ height: "100%" }} variant="outlined">
            <Typography
              level="title-md"
              startDecorator={<CreditCard size={20} />}
            >
              Informasi Transaksi
            </Typography>
            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={2}>
              <div>
                <Typography fontWeight="bold" level="body-xs">
                  Nomor Pembayaran
                </Typography>
                <Typography level="body-sm" sx={{ fontFamily: "monospace" }}>
                  {data?.payment_no}
                </Typography>
              </div>
              <div>
                <Typography fontWeight="bold" level="body-xs">
                  Metode
                </Typography>
                <Chip size="sm" variant="outlined">
                  {data?.method}
                </Chip>
              </div>
              <div>
                <Typography fontWeight="bold" level="body-xs">
                  Tanggal Bayar
                </Typography>
                <Typography level="body-sm">
                  {dayjs(data?.payment_date).format("DD MMM YYYY")}
                </Typography>
              </div>
              <div>
                <Typography fontWeight="bold" level="body-xs">
                  Nominal Diterima
                </Typography>
                <Typography color="primary" fontWeight="bold" level="title-lg">
                  {formatIDR(Number(data?.received_amount))}
                </Typography>
              </div>
              <div>
                <Typography fontWeight="bold" level="body-xs">
                  Kasir
                </Typography>
                <Typography level="body-sm">{data?.cashier?.name}</Typography>
                <Typography level="body-sm">{data?.cashier?.nik}</Typography>
              </div>
            </Stack>
          </Card>
        </Grid>

        {/* Kolom Kanan: Detail Order */}
        <Grid lg={9} md={8} xs={12}>
          <Card variant="outlined">
            <Typography level="title-md" startDecorator={<Receipt size={20} />}>
              Detail Pesanan ({data?.order?.trx_no})
            </Typography>
            <Divider sx={{ my: 1.5 }} />

            <Sheet sx={{ borderRadius: "sm", p: 2, mb: 2 }} variant="soft">
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Typography level="body-xs">Total Transaksi</Typography>
                  <Typography level="title-md">
                    {formatIDR(Number(data?.order?.grand_total))}
                  </Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography level="body-xs">PPN</Typography>
                  <Typography level="title-md">{data?.order?.ppn}%</Typography>
                </Grid>
              </Grid>
            </Sheet>

            <Typography level="title-sm" sx={{ mb: 1 }}>
              Item Pesanan:
            </Typography>
            <Sheet>
              <Table noWrap size="sm" variant="plain">
                <thead>
                  <tr>
                    <th>Nama Produk</th>
                    <th style={{ width: 80, textAlign: "center" }}>Qty</th>
                    <th style={{ textAlign: "right", width: 100 }}>Harga</th>
                    <th style={{ textAlign: "right", width: 100 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.order?.items || []).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Typography fontWeight="md" level="body-sm">
                          {item?.data?.name}
                        </Typography>
                        <Typography level="body-xs">
                          {item?.data?.code}
                        </Typography>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {item.qty} {item?.data?.unit}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatIDR(Number(item.price))}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatIDR(Number(item.total_price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={2} style={{ textAlign: "right" }}>
                      Grand Total
                    </th>
                    <th colSpan={2} style={{ textAlign: "right" }}>
                      <Typography color="primary" level="title-md">
                        {formatIDR(Number(data?.order?.grand_total))}
                      </Typography>
                    </th>
                  </tr>
                </tfoot>
              </Table>
            </Sheet>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
