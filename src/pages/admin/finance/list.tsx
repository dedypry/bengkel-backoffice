import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Input,
  Sheet,
  Table,
} from "@mui/joy";
import { Banknote, Eye, Search } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPayment } from "@/stores/features/payments/payment-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setPaymentQuery } from "@/stores/features/payments/payment-slice";
import { getAvatarByName } from "@/utils/helpers/global";
import { formatIDR } from "@/utils/helpers/format";

export default function InvoiceListPage() {
  const { payments, paymentQuery } = useAppSelector((state) => state.payment);
  const { company } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      dispatch(getPayment(paymentQuery));
    }
  }, [company, paymentQuery]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <HeaderAction
        subtitle="Riwayat invoice servis mobil"
        title="Daftar Invoice"
      />

      {/* Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          fullWidth
          endDecorator={
            <Button onClick={() => dispatch(setPaymentQuery({ q: search }))}>
              Cari
            </Button>
          }
          placeholder="Cari invoice / customer..."
          startDecorator={<Search />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <Card>
        <CardContent>
          <Sheet>
            <Table>
              <thead>
                <tr>
                  <th>Nomor Invoice</th>
                  <th>Pelanggan</th>
                  <th>Pembayaran</th>
                  <th>Petugas</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {payments?.data.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex flex-col gap-1">
                        <p>{item.payment_no}</p>
                        <p className="italic text-gray-500">
                          Reference No. {item.reference_no}
                        </p>
                      </div>
                    </td>
                    <td>
                      {item.work_order ? (
                        <div className="flex gap-2">
                          <Avatar
                            size="sm"
                            src={
                              item.work_order?.customer?.profile?.photo_url ||
                              getAvatarByName(item.work_order?.customer?.name!)
                            }
                          />
                          <div className="flex flex-col">
                            <p className="font-semibold">
                              {item.work_order?.customer?.name}
                            </p>
                            <p className="text-[10px]">
                              {item.work_order?.customer?.phone}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center">-</p>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        <p className="text-right font-semibold text-green-600">
                          {formatIDR(item.amount)}
                        </p>
                        <div className="flex justify-between">
                          <p>{dayjs(item.created_at).format("DD MMM YYYY")}</p>
                          <Chip
                            size="sm"
                            startDecorator={<Banknote />}
                            variant="outlined"
                          >
                            {item.method}
                          </Chip>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Avatar
                          size="sm"
                          src={
                            item.cashier?.profile?.photo_url ||
                            getAvatarByName(item.cashier?.name!)
                          }
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold">{item.cashier?.name}</p>
                          <p className="text-[10px]">{item.cashier?.nik}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "end" }}>
                      <Button
                        color="success"
                        size="sm"
                        startDecorator={<Eye />}
                        onClick={() =>
                          navigate(
                            item.work_order_id
                              ? `/service/queue/${item.work_order_id}`
                              : `/finance/${item.id}`,
                          )
                        }
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        </CardContent>
      </Card>

      <CustomPagination
        className="mt-auto"
        meta={payments?.meta!}
        onPageChange={(page) => dispatch(setPaymentQuery({ page }))}
      />
    </div>
  );
}
