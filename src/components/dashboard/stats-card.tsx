import { Car, Clock, DollarSign, Wrench } from "lucide-react";
import { Card, CardBody } from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";

export function StatsGrid() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  const stats = [
    {
      label: "Servis Hari Ini",
      value: dashboard?.countToday || 0,
      icon: Car,
      card: "bg-sky-50/90 border-sky-100",
      iconWrap: "bg-sky-100 text-sky-600",
    },
    {
      label: "Sedang Dikerjakan",
      value: dashboard?.countWork || 0,
      icon: Wrench,
      card: "bg-amber-50/90 border-amber-100",
      iconWrap: "bg-amber-100 text-amber-600",
    },
    {
      label: "Selesai",
      value: dashboard?.countFinish || 0,
      icon: Clock,
      card: "bg-emerald-50/90 border-emerald-100",
      iconWrap: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Pendapatan Hari Ini",
      value: formatIDR(Number(dashboard?.revenueToday || 0)),
      icon: DollarSign,
      card: "bg-violet-50/90 border-violet-100",
      iconWrap: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`border shadow-sm transition-transform hover:-translate-y-0.5 ${stat.card}`}
        >
          <CardBody className="flex flex-row items-center gap-4 p-5">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl ${stat.iconWrap}`}
            >
              <stat.icon size={22} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <h3 className="truncate text-xl font-bold text-slate-700">
                {stat.value}
              </h3>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
