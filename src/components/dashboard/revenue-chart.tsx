import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

import { useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";

export function RevenueChart() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Tren Pendapatan</h3>
          <p className="text-xs text-slate-500">7 Hari Terakhir</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {formatIDR(Number(dashboard?.revenueComparison.lastTotal), "short")}
          </p>
          <div className="flex items-center gap-1">
            {/* Warna dinamis: Hijau jika naik, Merah jika turun */}
            <p
              className={`text-[10px] font-bold flex items-center gap-0.5 ${
                dashboard?.revenueComparison.status === "increase"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {dashboard?.revenueComparison.status === "increase" ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {/* Gunakan Math.abs agar angka negatif tidak menampilkan double minus */}
              {Math.abs(dashboard?.revenueComparison.percentageChange || 0)}%
            </p>

            <span className="text-[10px] text-slate-500">dari minggu lalu</span>
          </div>
        </div>
      </div>

      <div className="h-75 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={dashboard?.trends}>
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
              formatter={(value: number) => [formatIDR(value), "Pendapatan"]}
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
