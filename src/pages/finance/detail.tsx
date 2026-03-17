import type { IPayment } from "@/utils/interfaces/IUser";

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  BreadcrumbItem,
  Breadcrumbs,
  Tooltip,
} from "@heroui/react";
import {
  Banknote,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Home,
  NotebookPen,
  Printer,
  Receipt,
  User,
} from "lucide-react";

import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";
import HeaderAction from "@/components/header-action";

export default function PaymentDetailPage() {
  const [data, setData] = useState<IPayment>();
  const { id } = useParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      http
        .get(`/payments/${id}`)
        .then(({ data }) => setData(data))
        .catch((err) => notifyError(err));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [id]);

  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
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
        <Button as={Link} color="primary" size="sm" to="/cashier">
          Kembali Ke Kasir
        </Button>
      </div>
      {/* 1. HEADER SECTION */}
      <HeaderAction
        actionContent={
          <div className="flex items-center gap-3">
            <Chip
              className="text-white uppercase"
              classNames={{
                content: "text-xs",
              }}
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
              size="sm"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* 2. LEFT: TRANSACTION INFO */}
        <div className="lg:col-span-4 space-y-2">
          <Card>
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-3 text-gray-500">
                <CreditCard size={18} />
                <span className="text-xs font-black uppercase ">
                  Transaction Info
                </span>
              </div>

              <div className="space-y-4">
                <DataField label="Nomor Pembayaran" value={data?.payment_no} />
                <DataField
                  label="Pelanggan"
                  value={data?.order?.customer?.name}
                />
                <DataField label="No PO" value={data?.order?.po_no} />
                <DataField
                  isBadge
                  label="Metode Pembayaran"
                  value={data?.method}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-3 text-gray-500 mb-2">
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
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-3 text-gray-500 mb-2">
                <NotebookPen size={18} />
                <span className="text-xs font-black uppercase ">Catatan</span>
              </div>
              <p className="text-xs italic  text-gray-500">
                {data?.order?.notes || "-"}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* 3. RIGHT: ORDER DETAILS */}
        <div className="lg:col-span-8 space-y-2">
          <Table aria-label="Order Items">
            <TableHeader>
              <TableColumn>ITEM DESCRIPTION</TableColumn>
              <TableColumn align="end">HARGA</TableColumn>
              <TableColumn align="end">DISC</TableColumn>
              <TableColumn align="end">PAJAK</TableColumn>
              <TableColumn align="end">TOTAL</TableColumn>
            </TableHeader>
            <TableBody>
              {(data?.order?.items || []).map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-50 last:border-none"
                >
                  <TableCell className="max-w-[200]">
                    <div className="flex flex-col">
                      <Tooltip color="primary" content={item?.data?.name}>
                        <span className="text-gray-500 text-xs font-semibold truncate whitespace-nowrap">
                          {item?.data?.name}
                        </span>
                      </Tooltip>
                      <span className="text-[10px] text-gray-600 font-mono">
                        {item?.data?.code}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <p className="text-xs">
                      {formatIDR(Number(item.price))}{" "}
                      <span className="text-[9px] !text-black">
                        / {item.qty} {item.data?.unit}
                      </span>{" "}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatIDR(item.disc_value)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatNumber(item.tax)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold">
                    {formatIDR(item.total_price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Card>
            <CardBody>
              <div className="space-y-3  border-gray-100">
                <SummaryRow
                  label="Subtotal"
                  value={formatIDR(data?.order?.subtotal)}
                />
                <SummaryRow
                  isNegative
                  label="Diskon Final"
                  value={formatIDR(data?.order?.discount)}
                />
                <SummaryRow
                  label="Total Pajak"
                  value={formatIDR(data?.order?.tax)}
                />
                <SummaryRow
                  label="Biaya Lain-lain"
                  value={formatIDR(data?.order?.other_fee)}
                />
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-sm border border-gray-100 flex justify-between items-center">
                <span className="text-sm font-black text-gray-500 uppercase ">
                  Grand Total
                </span>
                <span className="text-lg font-black text-gray-600">
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

function SummaryRow({
  label,
  value,
  isNegative,
}: {
  label: string;
  value: any;
  isNegative?: boolean;
}) {
  return (
    <div className="flex justify-between items-center px-2">
      <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
      <span
        className={`text-sm font-bold ${isNegative ? "text-danger" : "text-gray-700"}`}
      >
        {isNegative && "- "} {value}
      </span>
    </div>
  );
}

// INTERNAL HELPERS
function DataField({ label, value, isMono, isBadge }: any) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-gray-600 uppercase">{label}</p>
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
