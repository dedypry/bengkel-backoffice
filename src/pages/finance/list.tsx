import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Input,
  Card,
} from "@heroui/react";
import {
  Eye,
  Search,
  Hash,
  Calendar,
  CreditCard,
  Download,
  Receipt,
} from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPayment } from "@/stores/features/payments/payment-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setPaymentQuery } from "@/stores/features/payments/payment-slice";
import { getAvatarByName } from "@/utils/helpers/global";
import { formatIDR } from "@/utils/helpers/format";

interface Props {
  noHeader?: boolean;
}

export default function InvoiceListPage({ noHeader = false }: Props) {
  const { payments, paymentQuery } = useAppSelector((state) => state.payment);
  const { company } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getPayment(paymentQuery));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, paymentQuery, dispatch]);

  const onSearch = () => {
    dispatch(setPaymentQuery({ q: search }));
  };

  function handleExport() {}

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      {!noHeader && (
        <HeaderAction
          actionIcon={Download}
          actionTitle="Export Laporan"
          leadIcon={Receipt}
          subtitle="Pantau dan kelola seluruh riwayat tagihan pengerjaan unit."
          title="Daftar Invoice"
          onAction={() => handleExport()}
        />
      )}

      {/* Action Bar (Industrial Search Style) */}
      <Card className="flex flex-col md:flex-row gap-4 items-center  p-4 ">
        <div className="relative flex-1 group">
          <Input
            placeholder="Cari nomor invoice atau nama pelanggan..."
            startContent={
              <Search className="text-gray-500" size={20} values={search} />
            }
            onValueChange={setSearch}
          />
        </div>
        <Button startContent={<Search size={18} />} onPress={onSearch}>
          Cari Invoice
        </Button>
      </Card>

      {/* List Table */}

      <Table aria-label="Tabel Invoice">
        <TableHeader>
          <TableColumn>INVOICE & REF</TableColumn>
          <TableColumn>PELANGGAN</TableColumn>
          <TableColumn>TOTAL PEMBAYARAN</TableColumn>
          <TableColumn>KASIR / PETUGAS</TableColumn>
          <TableColumn align="center">AKSI</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="p-6 bg-gray-50 rounded-full text-gray-300">
                <Hash size={40} />
              </div>
              <p className="font-black uppercase italic text-gray-400">
                Data Invoice Tidak Ditemukan
              </p>
            </div>
          }
        >
          {(payments?.data || []).map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-black text-gray-500 uppercase">
                    {item.payment_no}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    REF: {item.reference_no}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {item.work_order ? (
                  <User
                    avatarProps={{
                      size: "sm",
                      src:
                        item.work_order?.customer?.profile?.photo_url ||
                        getAvatarByName(item.work_order?.customer?.name!),
                      className: "border-1 border-gray-100",
                    }}
                    classNames={{
                      description: "text-[10px] font-medium text-gray-400",
                    }}
                    description={item.work_order?.customer?.phone}
                    name={
                      <span className="font-bold text-gray-500">
                        {item.work_order?.customer?.name}
                      </span>
                    }
                  />
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-black text-success">
                    {formatIDR(item.amount)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Chip
                      className="font-black uppercase text-[9px] rounded-sm"
                      color="primary"
                      size="sm"
                      startContent={<CreditCard size={12} />}
                      variant="flat"
                    >
                      {item.method}
                    </Chip>
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                      <Calendar size={10} />{" "}
                      {dayjs(item.created_at).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <User
                  avatarProps={{
                    size: "sm",
                    src:
                      item.cashier?.profile?.photo_url ||
                      getAvatarByName(item.cashier?.name!),
                  }}
                  classNames={{ description: "text-[10px]" }}
                  description={`NIK: ${item.cashier?.nik || "-"}`}
                  name={
                    <span className="font-bold text-gray-500 uppercase text-xs">
                      {item.cashier?.name}
                    </span>
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    navigate(
                      item.work_order_id
                        ? `/service/queue/${item.work_order_id}`
                        : `/finance/${item.id}`,
                    )
                  }
                >
                  <Eye size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        meta={payments?.meta!}
        onPageChange={(page) => dispatch(setPaymentQuery({ page }))}
      />
    </div>
  );
}
