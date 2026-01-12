/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Computer, Search } from "lucide-react";
import { useState } from "react";
import { CardActions } from "@mui/joy";
import dayjs from "dayjs";

import StatusQueue from "../../service/queue/components/status-queue";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/utils/helpers/format";
import debounce from "@/utils/helpers/debounce";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import { CustomPagination } from "@/components/custom-pagination";

export default function ListOrder() {
  const { orders, workOrder } = useAppSelector((state) => state.wo);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();

  const debounceSearch = debounce((q) => dispatch(setWoQuery({ q })), 500);

  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Computer className="w-5 h-5 text-[#168BAB]" />
            Antrean Pembayaran
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 placeholder:text-xs"
              placeholder="Cari plat nomor atau nama..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debounceSearch(e.target.value);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto scrollbar-modern flex-1">
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
                    <Badge
                      className="bg-white text-[#168BAB] border-[#168BAB]"
                      variant="outline"
                    >
                      #{wo.trx_no}
                    </Badge>
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
        </CardContent>
        <CardActions>
          <CustomPagination
            className="w-full"
            meta={orders?.meta!}
            showDesc={false}
            showTotal={true}
            onPageChange={(page) => dispatch(setWoQuery({ page }))}
          />
        </CardActions>
      </Card>
    </div>
  );
}
