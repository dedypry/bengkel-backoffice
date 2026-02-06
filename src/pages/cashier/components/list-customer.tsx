/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import dayjs from "dayjs";

import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import StatusQueue from "@/components/status-queue";

export default function ListCustomer() {
  const { orders, workOrder } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-3">
      {orders?.data.map((wo) => (
        <div
          key={wo.id}
          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
            workOrder?.id === wo.id
              ? "border-[#168BAB] bg-blue-50/50"
              : "border-transparent bg-slate-50 hover:border-slate-200"
          }`}
          onClick={() => dispatch(getWoDetail(wo.id.toString()))}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-sm">#{wo.trx_no}</p>
              <p className="font-medium text-sm">{wo.customer.name}</p>
              <p className="text-[#168BAB] font-bold">
                {formatIDR(Number(wo.grand_total))}
              </p>
            </div>
            <div className="flex flex-col text-end">
              <span className="font-bold text-sm text-slate-700">
                {wo.vehicle.plate_number}
              </span>
              <p className="text-xs text-slate-500">
                {wo.vehicle.brand} {wo.vehicle.model}
              </p>
              <p className="font-bold mt-3 text-gray-500 text-sm">
                {dayjs(wo.created_at).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
          <StatusQueue wo={wo} />
        </div>
      ))}
    </div>
  );
}
