import { Car, Wrench, DollarSign, Clock } from "lucide-react";
import { Card, CardBody } from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";

export function StatsGrid() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  const stats = [
    {
      label: "Servis Hari Ini",
      value: dashboard?.countToday || 0,
      icon: <Car size={24} />,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Sedang Dikerjakan",
      value: dashboard?.countWork || 0,
      icon: <Wrench size={24} />,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "Selesai",
      value: dashboard?.countFinish || 0,
      icon: <Clock size={24} />,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Pendapatan (Hari Ini)",
      value: formatIDR(Number(dashboard?.revenueToday || 0)),
      icon: <DollarSign size={24} />,
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} shadow="sm">
          <CardBody className="flex flex-row items-center gap-4 p-5">
            {/* Icon Container dengan efek glassmorphism tipis atau solid */}
            <div
              className={`${stat.lightColor} ${stat.textColor} p-3 rounded-2xl`}
            >
              {stat.icon}
            </div>

            <div className="flex flex-col">
              <p className="text-tiny uppercase font-bold text-gray-400">
                {stat.label}
              </p>
              <h3 className="text-xl font-bold text-default-700">
                {stat.value}
              </h3>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
