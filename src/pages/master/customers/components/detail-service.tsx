import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Table,
  Button,
  Tooltip,
  Input,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Eye, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { getWo } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import debounce from "@/utils/helpers/debounce";
import { CustomPagination } from "@/components/custom-pagination";
import CustomDateRangePicker from "@/components/forms/date-range-picker";

interface Props {
  id: number | string;
}
export default function DetailServiceTab({ id }: Props) {
  const { woQuery, orders } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState<number[]>([]);

  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const query = { ...woQuery, isHistory: 1, noAuth: 1, customerId: id };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getWo(query));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [woQuery]);

  const searcDebounce = debounce(
    (q) => dispatch(setWoQuery({ ...query, q })),
    1000,
  );

  function handleLoading(id: number, isLoad: boolean) {
    if (isLoad) {
      setLoading((val) => [...val, id]);
    } else {
      setLoading((val) => val.filter((e) => e != id));
    }
  }

  return (
    <div>
      <div className="flex flex:col md:flex-row gap-4">
        <Input
          isClearable
          defaultValue={woQuery.q}
          placeholder="Cari No. Invoice, Plat kendaraan..."
          startContent={<Search className="size-4 text-default-400" />}
          variant="bordered"
          onValueChange={searcDebounce}
        />
        <div>
          <CustomDateRangePicker
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
      </div>
      <Table aria-label="History Table" shadow="none">
        <TableHeader>
          <TableColumn>TANGGAL & ID</TableColumn>
          <TableColumn>KENDARAAN</TableColumn>
          <TableColumn>DETAIL LAYANAN</TableColumn>
          <TableColumn align="end">TOTAL BIAYA</TableColumn>
          <TableColumn align="center">STATUS</TableColumn>
          <TableColumn align="center">AKSI</TableColumn>
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
                <div className="flex flex-col">
                  <span className="font-bold text-default-800 uppercase tracking-wide">
                    {item.vehicle.plate_number}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {item.vehicle.brand} {item.vehicle.model} •{" "}
                    {item.customer.name}
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
                  <Tooltip content="File Invoice">
                    <Button
                      isIconOnly
                      color="default"
                      isLoading={loading.includes(item.id)}
                      size="sm"
                      variant="light"
                      onPress={() =>
                        handleDownload(
                          `/invoices/${item.id}`,
                          item.trx_no,
                          false,
                          (val) => handleLoading(item.id, val),
                        )
                      }
                    >
                      <FileText className="size-4" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomPagination
        meta={orders?.meta!}
        onPageChange={(page) => dispatch(setWoQuery({ ...query, page }))}
      />
    </div>
  );
}
