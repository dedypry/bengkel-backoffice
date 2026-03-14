import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import dayjs from "dayjs";

import TableAction from "@/components/table-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getVendorPayment } from "@/stores/features/vendor/vendor-action";
import { formatIDR } from "@/utils/helpers/format";
import PageSize from "@/components/page-size";
import { CustomPagination } from "@/components/custom-pagination";
import { setPaymentQuery } from "@/stores/features/payments/payment-slice";
import debounce from "@/utils/helpers/debounce";

export default function TabPayment() {
  const { payments, paymentQuery } = useAppSelector((state) => state.vendor);
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const hasFetch = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;
      dispatch(getVendorPayment(paymentQuery));
    }
  }, []);

  const searchDebounce = debounce(
    (q) => dispatch(setPaymentQuery({ q })),
    1000,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full justify-between">
          <PageSize
            selectedKeys={[paymentQuery.pageSize.toString()]}
            onChange={(pageSize) => dispatch(setPaymentQuery({ pageSize }))}
          />
          <Input
            className="w-sm"
            endContent={<Search className="text-gray-500" />}
            placeholder="Cari Supplier..."
            value={search}
            onValueChange={(val) => {
              setSearch(val);
              searchDebounce(val);
            }}
          />
        </div>
      </CardHeader>
      <CardBody>
        <Table removeWrapper>
          <TableHeader>
            <TableColumn>Supplier</TableColumn>
            <TableColumn>Pembayaran</TableColumn>
            <TableColumn className="text-right">Subtotal</TableColumn>
            <TableColumn className="text-right">Diskon</TableColumn>
            <TableColumn className="text-right">PPN</TableColumn>
            <TableColumn className="text-right">Jumlah</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody>
            {(payments?.data || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="m-0 text-xs">{item.supplier.name}</p>
                    <p className="text-gray-600 text-[10px]">
                      {item.supplier.code}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{item.payment_type}</p>
                    <p className="text-[10px] italic text-gray-600">
                      {dayjs(item.created_at).format("DD MMM YYYY")}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatIDR(item.subtotal)}
                </TableCell>
                <TableCell className="text-right">
                  {formatIDR(item.discount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatIDR(item.tax)}
                </TableCell>
                <TableCell className="text-right">
                  <p>{formatIDR(item.total)}</p>
                  <p className="text-[10px]">{item.total_item} items</p>
                </TableCell>
                <TableCell>
                  <TableAction />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
      <CardFooter>
        <div className="w-full">
          <CustomPagination
            meta={payments?.meta!}
            onPageChange={(page) => dispatch(setPaymentQuery({ page }))}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
