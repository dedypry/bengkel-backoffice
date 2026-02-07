import type { IPayment } from "@/utils/interfaces/IUser";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { CheckCircle, CreditCard, Printer, Receipt, User } from "lucide-react";

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
        .then(({ data }) => setData(data))
        .catch((err) => notifyError(err));
    }
  }, [id]);

  if (!data) return null;

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Detail Pembayaran
          </h1>
          <div className="flex items-center gap-2">
            <Chip
              className="font-mono font-bold text-gray-500"
              radius="sm"
              size="sm"
              variant="flat"
            >
              ID: #{data?.id}
            </Chip>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
              Processed on{" "}
              {dayjs(data?.payment_date).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Chip
            className="font-black text-[11px] uppercase tracking-[0.2em] px-4 py-5 bg-emerald-50 text-emerald-700 border border-emerald-100"
            color="success"
            radius="sm"
            startContent={<CheckCircle size={14} />}
          >
            Lunas / Paid
          </Chip>
          <Button
            isIconOnly
            className="border-gray-200"
            radius="sm"
            variant="bordered"
            onPress={() =>
              handleDownload(
                `/payments/${id}/print`,
                `struk-${data?.payment_no}`,
                true,
              )
            }
          >
            <Printer className="text-gray-600" size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. LEFT: TRANSACTION INFO */}
        <div className="lg:col-span-4 space-y-6">
          <Card
            className="shadow-sm border-none bg-gray-900 text-white"
            radius="sm"
          >
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-3 text-white/50">
                <CreditCard size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Transaction Info
                </span>
              </div>

              <div className="space-y-6">
                <DataField
                  isMono
                  label="Nomor Pembayaran"
                  value={data?.payment_no}
                />
                <DataField
                  isBadge
                  label="Metode Pembayaran"
                  value={data?.method}
                />
                <Divider className="bg-white/10" />
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Nominal Diterima
                  </p>
                  <p className="text-3xl font-black text-emerald-400 tracking-tighter">
                    {formatIDR(Number(data?.received_amount))}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card
            className="shadow-sm border-none border border-gray-100"
            radius="sm"
          >
            <CardBody className="p-6">
              <div className="flex items-center gap-3 text-gray-400 mb-6">
                <User size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Cashier In Charge
                </span>
              </div>
              <p className="text-sm font-black text-gray-800 uppercase tracking-tight">
                {data?.cashier?.name}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                ID: {data?.cashier?.nik}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* 3. RIGHT: ORDER DETAILS */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-sm">
                    <Receipt className="text-gray-900" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Linked Order
                    </p>
                    <p className="text-lg font-black text-gray-900 tracking-tighter uppercase">
                      {data?.order?.trx_no}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Tax Rate
                  </p>
                  <Chip
                    className="font-black uppercase"
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    {data?.order?.ppn}% PPN
                  </Chip>
                </div>
              </div>

              <Table
                removeWrapper
                aria-label="Order Items"
                classNames={{
                  th: "bg-gray-50 text-gray-400 font-black text-[10px] tracking-widest uppercase h-12 border-b border-gray-100",
                  td: "py-4 text-[11px] font-bold uppercase",
                }}
              >
                <TableHeader>
                  <TableColumn>ITEM DESCRIPTION</TableColumn>
                  <TableColumn align="center" width={100}>
                    QTY
                  </TableColumn>
                  <TableColumn align="end">PRICE</TableColumn>
                  <TableColumn align="end">TOTAL</TableColumn>
                </TableHeader>
                <TableBody>
                  {(data?.order?.items || []).map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-50 last:border-none"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-gray-900 leading-tight">
                            {item?.data?.name}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono tracking-tighter">
                            {item?.data?.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">
                          {item.qty} {item?.data?.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {formatIDR(Number(item.price))}
                      </TableCell>
                      <TableCell className="text-gray-900 text-right">
                        {formatIDR(Number(item.total_price))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-8 p-6 bg-gray-50 rounded-sm border border-gray-100 flex justify-between items-center">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  Grand Total
                </span>
                <span className="text-2xl font-black text-gray-900 tracking-tighter">
                  {formatIDR(Number(data?.order?.grand_total))}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

// INTERNAL HELPERS
function DataField({ label, value, isMono, isBadge }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] leading-none">
        {label}
      </p>
      {isBadge ? (
        <Chip
          className="bg-white/10 text-white font-black uppercase text-[10px] tracking-widest border-none"
          radius="sm"
          size="sm"
        >
          {value}
        </Chip>
      ) : (
        <p
          className={`text-sm font-bold uppercase tracking-wide ${isMono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
