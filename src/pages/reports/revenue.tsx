import type { IReport } from "@/utils/interfaces/IReport";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Target,
  ArrowRight,
  Zap,
  ArrowDownLeft,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Chip,
} from "@heroui/react";

import InvoiceListPage from "../finance/list";

import HeaderAction from "@/components/header-action";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";

export default function RevenuePage() {
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

  const stats = [
    {
      label: "Total Pendapatan",
      val: report?.revenue || 0,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Unit Servis",
      val: formatNumber(report?.wo || 0) + " Unit",
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Rata-rata Transaksi",
      val: report?.avg || 0,
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Pertumbuhan",
      val: report?.growth,
      icon: report?.growthType === "decrement" ? ArrowDownLeft : ArrowUpRight,
      color:
        report?.growthType === "decrement"
          ? "text-rose-500"
          : "text-emerald-500",
      bg: report?.growthType === "decrement" ? "bg-rose-50" : "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8 pb-20 px-4 max-w-7xl mx-auto">
      <HeaderAction
        actionIcon={FileSpreadsheet}
        actionTitle="EXPORT EXCEL"
        subtitle="Analisis pemasukan dan pertumbuhan bengkel secara akurat."
        title="Laporan Pendapatan"
        onAction={() => {
          /* Logic Export */
        }}
      />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <Card
            key={i}
            className="border border-gray-200 shadow-sm hover:translate-y-[-4px] transition-transform"
          >
            <CardBody className="flex flex-row items-center gap-4">
              <div
                className={`${item.bg} ${item.color} p-3 rounded-sm shadow-inner`}
              >
                <item.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  {item.label}
                </p>
                <p className="text-md font-black text-gray-500 uppercase">
                  {typeof item.val === "number"
                    ? formatIDR(item.val)
                    : item.val}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section: Revenue Source */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm p-4">
          <CardHeader className="flex justify-between items-center px-4 pb-0">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-sm">
                <PieChart className="text-gray-600" size={20} />
              </div>
              <h3 className="text-lg font-black text-gray-500 uppercase">
                Sumber Pendapatan
              </h3>
            </div>
            <Chip
              className="font-black text-[9px] uppercase"
              color="primary"
              size="sm"
              variant="flat"
            >
              Live Data
            </Chip>
          </CardHeader>
          <CardBody className="px-4 py-8">
            <div className="grid gap-8">
              {report?.grafik.map((cat, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase text-gray-500">
                        {cat.label}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 italic">
                        Distribusi Layanan
                      </span>
                    </div>
                    <span className="text-sm font-black text-gray-500">
                      {cat.percentage}%
                    </span>
                  </div>
                  <Progress
                    aria-label={cat.label}
                    className="h-2.5"
                    classNames={{
                      track: "bg-gray-100",
                    }}
                    color={(cat.color as any) || "primary"}
                    value={cat.percentage}
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Section: Monthly Target */}
        <Card className="border border-gray-200 shadow-sm p-4 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <CardHeader className="flex gap-3 px-4">
            <div className="bg-gray-200 p-2 rounded-sm">
              <Target className="text-rose-400" size={20} />
            </div>
            <h5 className="text-lg text-gray-500 font-black uppercase">
              Target Bulanan
            </h5>
          </CardHeader>
          <CardBody className="px-4 py-2 relative z-10">
            <p className="text-gray-400 text-xs mb-6 font-medium italic">
              Pencapaian{" "}
              <span className="font-bold text-gray-700">
                {report?.reportMonthly.growth_formatted}
              </span>{" "}
              dari target bulan {report?.reportMonthly.last_month_name}.
            </p>

            <div className="bg-gray-200 rounded-sm p-6 border border-gray-200 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-gray-500">
                  Pencapaian Saat Ini
                </p>
                <TrendingUp className="text-success" size={14} />
              </div>
              <p className="text-lg font-black mb-6 text-gray-500">
                {formatIDR(report?.reportMonthly.current_revenue || 0)}
              </p>
              <Progress
                aria-label="Monthly Target"
                className="h-4"
                classNames={{
                  track: "bg-gray-100",
                  indicator: "bg-danger shadow-[0_0_15px_rgba(244,63,94,0.5)]",
                }}
                color="danger"
                value={report?.reportMonthly.growth_value}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm font-black text-gray-500 uppercase">
                  0%
                </span>
                <span className="text-xs font-black text-danger uppercase">
                  {report?.reportMonthly.growth_value}% Achieved
                </span>
              </div>
            </div>
          </CardBody>
          <div className="p-4 pt-0">
            <Button
              fullWidth
              color="primary"
              endContent={<ArrowRight size={16} />}
            >
              Sesuaikan Target
            </Button>
          </div>
        </Card>
      </div>

      {/* List Invoice Integration */}
      <div className="pt-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-8 w-1.5 bg-danger rounded-full" />
          <h2 className="text-lg font-black uppercase  text-gray-500">
            Riwayat Transaksi Terakhir
          </h2>
        </div>
        <InvoiceListPage noHeader />
      </div>
    </div>
  );
}
