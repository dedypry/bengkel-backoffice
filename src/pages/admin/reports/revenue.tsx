import type { IReport } from "@/utils/interfaces/IReport";

import {
  DollarSign,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Target,
  ArrowRight,
  Zap,
  ArrowDownLeft,
} from "lucide-react";
import { Button, Card, CardActions, CardContent } from "@mui/joy";
import { useEffect, useState } from "react";

import InvoiceListPage from "../finance/list";

import { Progress } from "@/components/ui/progress";
import HeaderAction from "@/components/header-action";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";

export default function LaporanPendapatan() {
  const [report, setReport] = useState<IReport>();

  useEffect(() => {
    getReport();
  }, []);

  async function getReport() {
    http
      .get("/reports/revenue")
      .then(({ data }) => {
        setReport(data);
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/20">
      <HeaderAction
        actionTitle="EXPORT EXCEL"
        subtitle="Analisis pemasukan dan pertumbuhan bengkel secara akurat."
        title="Laporan Pendapatan"
      />

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2 relative z-20">
        {[
          {
            label: "Total Pendapatan",
            val: report?.revenue,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Unit Servis",
            val: formatNumber(report?.wo || 0) + " Unit",
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Rata-rata Transaksi",
            val: report?.avg,
            icon: BarChart3,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Pertumbuhan",
            val: report?.growth,
            icon:
              report?.growthType == "decrement" ? ArrowDownLeft : ArrowUpRight,
            color:
              report?.growthType == "decrement"
                ? "text-rose-600"
                : "text-green-600",
            bg:
              report?.growthType == "decrement" ? "bg-rose-50" : "bg-green-50",
          },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent sx={{ alignItems: "center", gap: 2 }}>
              <div
                className={`${item.bg} ${item.color} p-4 rounded-2xl w-15 flex justify-center`}
              >
                <item.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {item.label}
              </p>
              <p className="text-xl font-black text-slate-800">
                {typeof item.val === "number" ? formatIDR(item.val) : item.val}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Target & Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="col-span-2">
          <Card sx={{ flex: 1, display: "flex" }}>
            <CardContent>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <PieChart className="text-emerald-500" /> Sumber Pendapatan
                </h3>
              </div>
              <div className="grid gap-4 h-48">
                <div className="space-y-6">
                  {report?.grafik.map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{cat.label}</span>
                        <span>{cat.percentage}%</span>
                      </div>
                      <Progress
                        className={`h-2 bg-slate-100`}
                        color={cat.color}
                        value={cat.percentage}
                      />
                    </div>
                  ))}
                </div>
                {/* <div className="col-span-2">
                  <RevenueChart />
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent>
            <div className="flex gap-2 items-center">
              <Target className="size-5 opacity-50" />
              <h5 className="font-black tracking-tight">Target Bulanan</h5>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Anda sudah mencapai {report?.reportMonthly.growth_formatted} dari
              target pendapatan {report?.reportMonthly.last_month_name}.
            </p>
            <div className="bg-gray-100 rounded-xl py-2 px-4 backdrop-blur-md border border-gray-400">
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                Pencapaian
              </p>
              <p className="text-3xl font-black mb-4 tracking-tighter">
                {formatIDR(report?.reportMonthly.current_revenue || 0)}
              </p>
              <Progress
                className="h-3 bg-gray-300"
                value={report?.reportMonthly.growth_value}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button endDecorator={<ArrowRight />}>Sesuaikan Target</Button>
          </CardActions>
        </Card>
      </div>

      <InvoiceListPage noHeader />
    </div>
  );
}
