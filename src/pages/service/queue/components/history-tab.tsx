import {
  Chip,
  Button,
  Tooltip,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableRow,
  TableColumn,
  TableBody,
  TableCell,
} from "@heroui/react";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { getWo } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import { CustomPagination } from "@/components/custom-pagination";
import DateRangePicker from "@/components/forms/date-range-picker";

interface Props {
  id: number | string;
  isNoDate?: boolean;
}

export default function HistoryTab({ id, isNoDate }: Props) {
  const { woQuery, orders } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const query = {
    ...woQuery,
    isHistory: 1,
    noAuth: 1,
    customerId: id,
    ...(isNoDate && { date: "" }),
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getWo(query));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [woQuery, id]);

  return (
    <div className="space-y-4">
      <Card>
        <CardBody>
          <div className="flex gap-2">
            <DateRangePicker
              value={
                {
                  start: woQuery.date_from,
                  end: woQuery.date_to,
                } as any
              }
              onChange={(val: any) => {
                dispatch(
                  setWoQuery({
                    ...query,
                    date_from: val?.start,
                    date_to: val?.end,
                  }),
                );
              }}
            />
          </div>
        </CardBody>
      </Card>
      <Table>
        <TableHeader>
          <TableColumn>TANGGAL & ID</TableColumn>
          <TableColumn>DETAIL LAYANAN</TableColumn>
          <TableColumn align="end">TOTAL BIAYA</TableColumn>
          <TableColumn align="center">STATUS</TableColumn>
          <TableColumn align="center"> </TableColumn>
        </TableHeader>
        <TableBody emptyContent={<p>Tidak ada riwayat di tanggal ini</p>}>
          {(orders?.data || []).map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-default-700">
                    {dayjs(item.created_at).format("DD MMM YYYY")}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono tracking-tighter">
                    {item.trx_no}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  <Tooltip
                    color="primary"
                    content={item.services.map((e) => e.name).join(", ")}
                  >
                    <span className="text-[11px] text-default-700 block truncate max-w-[200px]">
                      {item.services.map((e) => e.name).join(", ")}
                    </span>
                  </Tooltip>
                  {/* <span className="text-[11px] text-default-700 block truncate">
                    {item.services.map((e) => e.name).join(", ")}
                  </span> */}
                  <Chip
                    className="h-5 text-[10px] font-bold uppercase"
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    Mekanik: {item.mechanics?.map((e) => e.name).join(", ")}
                  </Chip>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-black text-xs text-gray-600">
                  {formatIDR(item.grand_total)}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-bold"
                  color={item.status === "closed" ? "success" : "danger"}
                  size="sm"
                  variant="dot"
                >
                  {item.status === "closed" ? "Sukses" : "Batal"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Tooltip content="Lihat Detail">
                    <Button
                      isIconOnly
                      as={Link}
                      color="primary"
                      size="sm"
                      to={`/service/queue/${item.id}`}
                      variant="light"
                    >
                      <Eye className="size-4" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <CustomPagination
          meta={orders?.meta!}
          onPageChange={(page) => dispatch(setWoQuery({ ...query, page }))}
        />
      </div>
    </div>
  );
}
