import type { IRevenueTrendPoint } from "@/utils/interfaces/IReport";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatIDR } from "@/utils/helpers/format";

type RevenueChartProps = {
  data: IRevenueTrendPoint[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-56 w-full rounded-2xl border border-primary-100 bg-gradient-to-br from-white to-primary-50/40 p-4 shadow-sm">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueTrendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#006fee" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#006fee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #dbeafe",
              boxShadow: "0 10px 25px -12px rgb(0 111 238 / 0.35)",
            }}
            formatter={(value) => [formatIDR(Number(value ?? 0)), "Pendapatan"]}
          />
          <CartesianGrid
            stroke="#e2e8f0"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="name"
            dy={10}
            minTickGap={24}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickFormatter={(value) =>
              value >= 1_000_000
                ? `${Math.round(value / 1_000_000)}jt`
                : `${Math.round(value / 1000)}rb`
            }
            tickLine={false}
          />
          <Area
            dataKey="total"
            fill="url(#revenueTrendFill)"
            fillOpacity={1}
            stroke="#006fee"
            strokeWidth={3}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
