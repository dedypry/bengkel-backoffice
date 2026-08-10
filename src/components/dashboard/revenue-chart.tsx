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
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getRevenueTrend,
  type RevenueTrendPeriod,
} from "@/stores/features/dashboard/dashboard-action";
import { formatIDR } from "@/utils/helpers/format";

const PERIODS: RevenueTrendPeriod[] = ["7d", "1m", "3m", "1y"];

export function RevenueChart() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { dashboard, revenueTrendPeriod, revenueTrendLoading } = useAppSelector(
    (state) => state.dashboard,
  );

  const isIncrease = dashboard?.revenueComparison.status === "increase";

  const handlePeriodChange = (period: RevenueTrendPeriod) => {
    if (period === revenueTrendPeriod || revenueTrendLoading) {
      return;
    }

    dispatch(getRevenueTrend(period));
  };

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <CardBody className="p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <LineChart size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {t("dashboard.revenue_chart.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t(`dashboard.revenue_chart.period_subtitle.${revenueTrendPeriod}`)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">
              {formatIDR(
                Number(dashboard?.revenueComparison.currentTotal || 0),
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
                {t(
                  `dashboard.revenue_chart.vs_previous.${revenueTrendPeriod}`,
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {PERIODS.map((period) => (
            <Button
              key={period}
              className="min-w-0 px-3 font-semibold"
              color={revenueTrendPeriod === period ? "primary" : "default"}
              isDisabled={revenueTrendLoading}
              size="sm"
              variant={revenueTrendPeriod === period ? "solid" : "flat"}
              onPress={() => handlePeriodChange(period)}
            >
              {t(`dashboard.revenue_chart.period.${period}`)}
            </Button>
          ))}
        </div>

        <div className="relative h-72 w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-2">
          {revenueTrendLoading ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70">
              <Spinner color="primary" size="sm" />
            </div>
          ) : null}
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={dashboard?.trends}>
              <defs>
                <linearGradient
                  id="dashboardRevenueFill"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
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
                interval="preserveStartEnd"
                minTickGap={16}
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
                formatter={(value) => [
                  formatIDR(Number(value ?? 0)),
                  t("dashboard.revenue_chart.revenue_label"),
                ]}
                labelFormatter={(_, payload) => {
                  const date = payload?.[0]?.payload?.date;

                  return date ? String(date) : "";
                }}
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
