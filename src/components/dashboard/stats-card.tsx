import { Car, Wrench, DollarSign, Clock } from "lucide-react";

const stats = [
  {
    label: "Servis Hari Ini",
    value: "12",
    icon: <Car />,
    color: "bg-blue-500",
  },
  {
    label: "Sedang Dikerjakan",
    value: "5",
    icon: <Wrench />,
    color: "bg-amber-500",
  },
  { label: "Selesai", value: "7", icon: <Clock />, color: "bg-green-500" },
  {
    label: "Pendapatan (Hari Ini)",
    value: "Rp 3.5M",
    icon: <DollarSign />,
    color: "bg-emerald-600",
  },
];

export function StatsGrid() {
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
