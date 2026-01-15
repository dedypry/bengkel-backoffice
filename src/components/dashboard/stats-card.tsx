import { Car, Wrench, DollarSign, Clock } from "lucide-react";

import { useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";

export function StatsGrid() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  const stats = [
    {
      label: "Servis Hari Ini",
      value: dashboard?.countToday,
      icon: <Car />,
      color: "bg-blue-500",
    },
    {
      label: "Sedang Dikerjakan",
      value: dashboard?.countWork,
      icon: <Wrench />,
      color: "bg-amber-500",
    },
    {
      label: "Selesai",
      value: dashboard?.countFinish,
      icon: <Clock />,
      color: "bg-green-500",
    },
    {
      label: "Pendapatan (Hari Ini)",
      value: formatIDR(Number(dashboard?.revenueToday || 0)),
      icon: <DollarSign />,
      color: "bg-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4"
        >
          <div className={`${stat.color} p-3 rounded-lg text-white`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
