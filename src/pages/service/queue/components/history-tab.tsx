import {
  Chip,
  Button,
  Tooltip,
  Card,
  CardBody,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableRow,
  TableColumn,
  TableBody,
  TableCell,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Eye, LayoutList, LayoutGrid } from "lucide-react";
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
  const [loading, setLoading] = useState<number[]>([]);
  const [selected, setSelected] = useState("grid");
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

  function handleLoading(id: number, isLoad: boolean) {
    setLoading((val) => (isLoad ? [...val, id] : val.filter((e) => e != id)));
  }

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
            <Tabs
              aria-label="Options"
              color="primary"
              selectedKey={selected}
              variant="bordered"
              onSelectionChange={(key) => setSelected(key as string)}
            >
              <Tab
                key="list"
                title={
                  <div className="flex items-center space-x-2">
                    <LayoutList size={18} />
                    <span>List View</span>
                  </div>
                }
              />
              <Tab
                key="grid"
                title={
                  <div className="flex items-center space-x-2">
                    <LayoutGrid size={18} />
                    <span>Grid View</span>
                  </div>
                }
              />
            </Tabs>
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
        <TableBody>
          {(orders?.data || []).map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-default-700">
                    {dayjs(item.created_at).format("DD MMM YYYY")}
                  </span>
                  <span className="text-tiny text-gray-400 font-mono tracking-tighter">
                    {item.trx_no}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-small text-default-700 font-medium">
                    {item.services.map((e) => e.name).join(", ")}
                  </span>
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
                <span className="font-black text-default-900">
                  {formatIDR(item.grand_total)}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-bold"
                  color={item.status === "closed" ? "success" : "danger"}
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
