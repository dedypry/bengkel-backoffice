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
  BreadcrumbItem,
  Breadcrumbs,
} from "@heroui/react";
import {
  Banknote,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Home,
  Printer,
  Receipt,
  User,
} from "lucide-react";

import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { formatIDR } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";
import HeaderAction from "@/components/header-action";

export default function PaymentDetailPage() {
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
    <div className="space-y-5">
      <Breadcrumbs
        className="pt-5"
        itemClasses={{ item: "text-gray-500 font-medium" }}
        separator={<ChevronRight size={14} />}
      >
        <BreadcrumbItem href="/" startContent={<Home size={16} />}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem
          href="/finance/list"
          startContent={<Receipt size={16} />}
        >
          Keuangan
        </BreadcrumbItem>
        <BreadcrumbItem>{data.payment_no}</BreadcrumbItem>
      </Breadcrumbs>
      {/* 1. HEADER SECTION */}
      <HeaderAction
        actionContent={
          <div className="flex items-center gap-3">
            <Chip
              className="text-white uppercase"
              color="success"
              radius="sm"
              startContent={<CheckCircle size={14} />}
              variant="shadow"
            >
              Lunas / Paid
            </Chip>
            <Button
              isIconOnly
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
        }
        subtitle={` ID: #${data?.id} Processed on ${dayjs(data?.payment_date).format("DD/MM/YYYY HH:mm")}`}
        title="Detail Pembayaran"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. LEFT: TRANSACTION INFO */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-3 text-gray-500">
                <CreditCard size={18} />
                <span className="text-xs font-black uppercase ">
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
                  <p className="text-3xl font-black text-emerald-400">
                    {formatIDR(Number(data?.received_amount))}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-3 text-gray-500 mb-6">
                <User size={18} />
                <span className="text-xs font-black uppercase ">
                  Cashier In Charge
                </span>
              </div>
              <p className="text-sm font-black text-gray-500 uppercase">
                {data?.cashier?.name}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                ID: {data?.cashier?.nik || "-"}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* 3. RIGHT: ORDER DETAILS */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardBody className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-sm">
                    <Receipt className="text-gray-500" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                      No Transaksi
                    </p>
                    <p className="text-lg font-black text-gray-500 uppercase">
                      {data?.order?.trx_no}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-500 uppercase mb-1">
                    Tax Rate
                  </p>
                  <Chip
                    className="font-black uppercase"
                    color="warning"
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    {data?.order?.ppn}% PPN
                  </Chip>
                </div>
              </div>

              <Table removeWrapper aria-label="Order Items">
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
                          <span className="text-gray-500 font-semibold">
                            {item?.data?.name}
                          </span>
                          <span className="text-xs text-gray-600 font-mono">
                            {item?.data?.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">
                          {item.qty} {item?.data?.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-5">
                        {formatIDR(Number(item.price))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(Number(item.total_price))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-8 p-6 bg-gray-50 rounded-sm border border-gray-100 flex justify-between items-center">
                <span className="text-sm font-black text-gray-500 uppercase ">
                  Grand Total
                </span>
                <span className="text-2xl font-black text-gray-600">
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
      <p className="text-xs font-black uppercase">{label}</p>
      {isBadge ? (
        <Chip
          className="uppercase text-white text-[10px] border-none"
          classNames={{ content: "font-bold ml-2" }}
          color="success"
          radius="sm"
          size="sm"
          startContent={<Banknote />}
        >
          {value}
        </Chip>
      ) : (
        <p
          className={`text-sm text-gray-500 font-bold ${isMono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
