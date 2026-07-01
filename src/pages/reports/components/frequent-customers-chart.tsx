import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatNumber } from "@/utils/helpers/format";

export type FrequentCustomerChartPoint = {
  name: string;
  fullName: string;
  service_count: number;
  total_spending: number;
};

type FrequentCustomersChartProps = {
  data: FrequentCustomerChartPoint[];
};

export default function FrequentCustomersChart({
  data,
}: FrequentCustomersChartProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/40 p-4 shadow-sm">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
        >
          <CartesianGrid
            stroke="#e2e8f0"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            angle={-30}
            axisLine={false}
            dataKey="name"
            dy={10}
            height={60}
            interval={0}
            textAnchor="end"
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #ede9fe",
              boxShadow: "0 10px 25px -12px rgb(124 58 237 / 0.25)",
            }}
            formatter={(value) => [
              formatNumber(Number(value ?? 0)),
              "Jumlah Service",
            ]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullName || ""
            }
          />
          <Bar
            dataKey="service_count"
            fill="#8b5cf6"
            maxBarSize={48}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
