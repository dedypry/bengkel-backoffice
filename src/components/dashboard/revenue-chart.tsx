import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Senin", total: 1200000 },
  { day: "Selasa", total: 2100000 },
  { day: "Rabu", total: 1800000 },
  { day: "Kamis", total: 2500000 },
  { day: "Jumat", total: 3200000 },
  { day: "Sabtu", total: 4500000 },
  { day: "Minggu", total: 2800000 },
];

export function RevenueChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Tren Pendapatan</h3>
          <p className="text-xs text-slate-500">7 Hari Terakhir</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">Rp 18.1M</p>
          <p className="text-[10px] text-green-500 font-bold">
            ↑ 12% dari minggu lalu
          </p>
        </div>
      </div>

      <div className="h-75 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#f1f5f9"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="day"
              dy={10}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
            />
            <YAxis
              hide={true} // Sembunyikan axis Y agar lebih clean
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [
                formatCurrency(value),
                "Pendapatan",
              ]}
            />
            <Area
              dataKey="total"
              fill="url(#colorTotal)"
              fillOpacity={1}
              stroke="#ef4444"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
