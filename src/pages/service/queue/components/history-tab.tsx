import {
  Chip,
  Button,
  Tooltip,
  Card,
  CardBody,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Eye,
  FileText,
  Calendar,
  Car,
  Wrench,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getWo } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";
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

      {selected === "list" ? (
        <div className="flex flex-col gap-3">
          {(orders?.data || []).map((item) => (
            <Card key={item.id} radius="sm" shadow="sm">
              <CardBody className="p-0">
                <div className="flex flex-col md:flex-row items-center">
                  {/* 1. DATE & TRX SECTION (Kiri) */}
                  <div className="p-4 w-full md:w-48 bg-gray-50/50 flex flex-row md:flex-col justify-between md:justify-center border-b md:border-b-0 md:border-r border-gray-100 gap-1">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-black uppercase">
                        {dayjs(item.created_at).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-500">
                      #{item.trx_no}
                    </span>
                  </div>

                  {/* 2. VEHICLE & SERVICE SECTION (Tengah) */}
                  <div className="p-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Vehicle */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-sm text-gray-500 shrink-0">
                        <Car size={16} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-black text-gray-600 truncate">
                          {item.vehicle.plate_number}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {item.vehicle.brand} {item.vehicle.model}
                        </span>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-sm text-gray-500 shrink-0">
                        <Wrench size={16} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-[11px] font-bold text-gray-600 truncate uppercase">
                          {item.services.map((e) => e.name).join(", ")}
                        </p>
                        <div className="flex gap-1">
                          {item.mechanics?.map((m, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-black text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-none uppercase"
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. PRICE & STATUS SECTION (Kanan) */}
                  <div className="p-4 w-full md:w-64 bg-gray-50/20 flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 md:border-l border-gray-100">
                    <div className="flex flex-col items-start md:items-end">
                      <Chip
                        className="font-bold uppercase h-5 text-[9px] mb-1"
                        color={item.status === "closed" ? "success" : "danger"}
                        radius="sm"
                        size="sm"
                        variant="flat"
                      >
                        {item.status === "closed" ? "SUKSES" : "BATAL"}
                      </Chip>
                      <span className="text-sm font-black text-gray-500">
                        {formatIDR(item.grand_total)}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                      <Tooltip content="Invoice" radius="sm">
                        <Button
                          isIconOnly
                          isLoading={loading.includes(item.id)}
                          radius="sm"
                          size="sm"
                          variant="flat"
                          onPress={() =>
                            handleDownload(
                              `/invoices/${item.id}`,
                              item.trx_no,
                              false,
                              (val) => handleLoading(item.id, val),
                            )
                          }
                        >
                          <FileText size={16} />
                        </Button>
                      </Tooltip>
                      <Button
                        isIconOnly
                        as={Link}
                        className="bg-primary text-white"
                        radius="sm"
                        size="sm"
                        to={`/service/queue/${item.id}`}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {(orders?.data || []).map((item) => (
            <Card key={item.id}>
              <CardBody className="p-0">
                {/* TOP: STATUS & DATE */}
                <div className="p-4 flex justify-between items-start bg-gray-50/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={12} />
                      <span className="text-[11px] font-black uppercase">
                        {dayjs(item.created_at).format("DD MMMM YYYY")}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-500">
                      #{item.trx_no}
                    </span>
                  </div>
                  <Chip
                    className="font-bold uppercase h-6"
                    color={item.status === "closed" ? "success" : "danger"}
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    {item.status === "closed" ? "SUKSES" : "BATAL"}
                  </Chip>
                </div>

                <Divider className="bg-gray-100" />

                {/* MIDDLE: VEHICLE & SERVICE */}
                <div className="p-4 space-y-4">
                  {/* Vehicle info */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-sm text-gray-500">
                      <Car size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-500 leading-tight">
                        {item.vehicle.plate_number}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {item.vehicle.brand} {item.vehicle.model}
                      </span>
                    </div>
                  </div>

                  {/* Services info */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-sm text-gray-500">
                      <Wrench size={16} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] font-bold text-gray-600 leading-relaxed uppercase">
                        {item.services.map((e) => e.name).join(", ")}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.mechanics?.map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-black text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-none uppercase"
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Divider className="bg-gray-100 border-dashed" />

                {/* BOTTOM: PRICE & ACTIONS */}
                <div className="p-4 flex justify-between items-center bg-gray-50/30">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Total Biaya
                    </span>
                    <span className="text-sm font-black text-gray-500 tracking-tight">
                      {formatIDR(item.grand_total)}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Tooltip closeDelay={0} content="Invoice" radius="sm">
                      <Button
                        isIconOnly
                        isLoading={loading.includes(item.id)}
                        radius="sm"
                        size="sm"
                        variant="flat"
                        onPress={() =>
                          handleDownload(
                            `/invoices/${item.id}`,
                            item.trx_no,
                            false,
                            (val) => handleLoading(item.id, val),
                          )
                        }
                      >
                        <FileText size={16} />
                      </Button>
                    </Tooltip>
                    <Button
                      as={Link}
                      className="font-black text-[10px] tracking-widest px-4 h-8"
                      color="primary"
                      endContent={<Eye size={14} />}
                      radius="sm"
                      size="sm"
                      to={`/service/queue/${item.id}`}
                      variant="solid"
                    >
                      DETAIL
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 pt-4">
        <CustomPagination
          meta={orders?.meta!}
          onPageChange={(page) => dispatch(setWoQuery({ ...query, page }))}
        />
      </div>
    </div>
  );
}
