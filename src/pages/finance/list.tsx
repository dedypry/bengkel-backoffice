import { useEffect, useState } from "react";
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
  Card,
  CardBody,
} from "@heroui/react";
import { Eye, Search, Hash, Calendar, CreditCard } from "lucide-react";
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

  useEffect(() => {
    if (company) {
      dispatch(getPayment(paymentQuery));
    }
  }, [company, paymentQuery, dispatch]);

  const onSearch = () => {
    dispatch(setPaymentQuery({ q: search }));
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      {!noHeader && (
        <HeaderAction
          subtitle="Riwayat invoice servis mobil"
          title="Daftar Invoice"
        />
      )}

      {/* Action Bar (Industrial Search Style) */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors"
            size={20}
          />
          <input
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gray-200 font-bold text-gray-700 placeholder:text-gray-400 text-sm transition-all"
            placeholder="Cari nomor invoice atau nama pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
        <Button
          className="bg-gray-900 text-white font-black uppercase italic tracking-widest px-8 h-12"
          startContent={<Search size={18} />}
          onPress={onSearch}
        >
          Cari Invoice
        </Button>
      </div>

      {/* List Table */}
      <Card
        className="border-none shadow-sm rounded-3xl overflow-hidden"
        radius="none"
      >
        <CardBody className="p-0">
          <Table
            removeWrapper
            aria-label="Tabel Invoice"
            classNames={{
              th: "bg-gray-50 text-gray-500 font-black uppercase italic text-[10px] tracking-[0.2em] py-5 px-6",
              td: "py-5 px-6 border-b border-gray-50",
            }}
          >
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
                      <span className="font-black text-gray-800 uppercase italic tracking-tight">
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
                        classNames={{ description: "text-[10px] font-medium" }}
                        description={item.work_order?.customer?.phone}
                        name={
                          <span className="font-bold text-gray-700">
                            {item.work_order?.customer?.name}
                          </span>
                        }
                      />
                    ) : (
                      <span className="text-gray-300">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-black text-green-600 italic">
                        {formatIDR(item.amount)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Chip
                          className="bg-blue-50 text-blue-600 font-black uppercase text-[9px] border-none"
                          size="sm"
                          startContent={<CreditCard size={12} />}
                          variant="flat"
                        >
                          {item.method}
                        </Chip>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
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
                        className: "grayscale",
                      }}
                      classNames={{ description: "text-[9px] font-medium" }}
                      description={`NIK: ${item.cashier?.nik}`}
                      name={
                        <span className="font-bold text-gray-600 uppercase italic text-xs">
                          {item.cashier?.name}
                        </span>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      className="bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all rounded-xl"
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
        </CardBody>
      </Card>

      <CustomPagination
        meta={payments?.meta!}
        onPageChange={(page) => dispatch(setPaymentQuery({ page }))}
      />
    </div>
  );
}
