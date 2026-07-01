import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardBody, Chip } from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";

export function RevenueChart() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  const isIncrease = dashboard?.revenueComparison.status === "increase";

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <CardBody className="p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <LineChart size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Tren Pendapatan
              </h3>
              <p className="text-xs text-slate-500">7 hari terakhir</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">
              {formatIDR(
                Number(dashboard?.revenueComparison.lastTotal || 0),
                "short",
              )}
            </p>
            <div className="mt-1 flex items-center justify-end gap-2">
              <Chip
                className="font-bold"
                color={isIncrease ? "success" : "danger"}
                size="sm"
                startContent={
                  isIncrease ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )
                }
                variant="flat"
              >
                {Math.abs(dashboard?.revenueComparison.percentageChange || 0)}%
              </Chip>
              <span className="text-[10px] font-medium text-slate-400">
                vs minggu lalu
              </span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-2">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={dashboard?.trends}>
              <defs>
                <linearGradient id="dashboardRevenueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#006FEE" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#006FEE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="day"
                dy={10}
                tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickFormatter={(value) =>
                  value >= 1_000_000
                    ? `${Math.round(value / 1_000_000)}jt`
                    : `${Math.round(value / 1000)}rb`
                }
                tickLine={false}
                width={42}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #dbeafe",
                  boxShadow: "0 10px 25px -12px rgb(0 111 238 / 0.35)",
                }}
                cursor={{
                  stroke: "#006FEE",
                  strokeWidth: 2,
                  strokeDasharray: "5 5",
                }}
                formatter={(value: number) => [
                  formatIDR(value || 0),
                  "Pendapatan",
                ]}
              />
              <Area
                animationDuration={1200}
                dataKey="total"
                fill="url(#dashboardRevenueFill)"
                fillOpacity={1}
                stroke="#006FEE"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
