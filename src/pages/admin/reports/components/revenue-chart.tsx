import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Contoh data trend penjualan
const data = [
  { name: "Sen", total: 4000 },
  { name: "Sel", total: 3000 },
  { name: "Rab", total: 5000 },
  { name: "Kam", total: 2780 },
  { name: "Jum", total: 1890 },
  { name: "Sab", total: 2390 },
  { name: "Min", total: 3490 },
];

export default function RevenueChart() {
  return (
    <div className="w-full h-52 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            {/* Gradien warna untuk area chart agar terlihat modern */}
            <linearGradient id="colorTotal" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              borderRadius: "1rem",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
          />
          <CartesianGrid
            stroke="#f1f5f9"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="name"
            dy={10}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
          />
          <Area
            dataKey="total"
            fill="url(#colorTotal)"
            fillOpacity={1}
            stroke="#0ea5e9"
            strokeWidth={3}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
