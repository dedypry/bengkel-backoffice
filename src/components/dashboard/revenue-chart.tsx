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
import { Card, CardBody, Chip } from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";

export function RevenueChart() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  const isIncrease = dashboard?.revenueComparison.status === "increase";

  return (
    <Card className="border-none bg-content1 p-2" shadow="sm">
      <CardBody>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-default-800 text-lg">
              Tren Pendapatan
            </h3>
            <p className="text-tiny text-default-400 font-medium">
              7 Hari Terakhir
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-2xl font-bold text-primary">
              {formatIDR(
                Number(dashboard?.revenueComparison.lastTotal || 0),
                "short",
              )}
            </p>

            <div className="flex items-center gap-2">
              <Chip
                className="font-bold border-none"
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
              <span className="text-[10px] text-default-400 font-medium">
                vs minggu lalu
              </span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={dashboard?.trends}>
              <defs>
                <linearGradient id="colorTotal" x1="0" x2="0" y1="0" y2="1">
                  {/* Menggunakan warna biru primary jika ingin match dengan brand HeroUI default */}
                  <stop offset="5%" stopColor="#006FEE" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#006FEE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#e4e4e7" // default-200
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="day"
                dy={10}
                tick={{ fontSize: 11, fill: "#a1a1aa", fontWeight: 500 }}
                tickLine={false}
              />
              <YAxis hide={true} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                cursor={{
                  stroke: "#006FEE",
                  strokeWidth: 2,
                  strokeDasharray: "5 5",
                }}
                formatter={(value: number | undefined) => [
                  formatIDR(value || 0),
                  "Pendapatan",
                ]}
                itemStyle={{ color: "#006FEE", fontWeight: "bold" }}
              />
              <Area
                animationDuration={1500}
                dataKey="total"
                fill="url(#colorTotal)"
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
