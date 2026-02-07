import { Chip, Button, Tooltip, Card, CardBody, Divider } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Eye, FileText, Calendar, Car, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

import { getWo } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import { CustomPagination } from "@/components/custom-pagination";

interface Props {
  id: number | string;
}

export default function HistoryTab({ id }: Props) {
  const { woQuery, orders } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const query = { ...woQuery, isHistory: true, noAuth: true, customerId: id };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getWo(query));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [dispatch, id]); // Added proper deps

  function handleLoading(id: number, isLoad: boolean) {
    setLoading((val) => (isLoad ? [...val, id] : val.filter((e) => e != id)));
  }

  return (
    <div className="space-y-4">
      {/* GRID LAYOUT FOR CARDS */}
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

      <div className="mt-6 border-t border-gray-100 pt-4">
        <CustomPagination
          meta={orders?.meta!}
          onPageChange={(page) => dispatch(setWoQuery({ ...query, page }))}
        />
      </div>
    </div>
  );
}
