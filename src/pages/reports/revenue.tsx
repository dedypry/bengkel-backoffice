import type { IReport } from "@/utils/interfaces/IReport";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  FileSpreadsheet,
  LineChart,
  PieChart,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Spinner,
} from "@heroui/react";

import InvoiceListPage from "../finance/list";

import RevenueChart from "./components/revenue-chart";

import HeaderAction from "@/components/header-action";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

function getProgressColor(progress: number) {
  if (progress >= 100) {
    return "success" as const;
  }

  if (progress >= 75) {
    return "primary" as const;
  }

  if (progress >= 50) {
    return "warning" as const;
  }

  return "danger" as const;
}

export default function RevenuePage() {
  const [report, setReport] = useState<IReport>();
  const [loading, setLoading] = useState(true);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [targetInput, setTargetInput] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);

  const getReport = useCallback(async () => {
    setLoading(true);
    http
      .get("/reports/revenue")
      .then(({ data }) => {
        setReport(data);
        setTargetInput(String(data.reportMonthly?.target_amount || ""));
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void getReport();
  }, [getReport]);

  const monthly = report?.reportMonthly;
  const progressColor = getProgressColor(monthly?.progress_value || 0);

  const stats = useMemo(
    () => [
      {
        label: "Total Pendapatan",
        val: formatIDR(report?.revenue || 0),
        icon: DollarSign,
        card: "bg-emerald-50/90 border-emerald-100",
        iconWrap: "bg-emerald-100 text-emerald-600",
      },
      {
        label: "Unit Servis",
        val: `${formatNumber(report?.wo || 0)} Unit`,
        icon: Zap,
        card: "bg-sky-50/90 border-sky-100",
        iconWrap: "bg-sky-100 text-sky-600",
      },
      {
        label: "Rata-rata Transaksi",
        val: formatIDR(report?.avg || 0),
        icon: BarChart3,
        card: "bg-violet-50/90 border-violet-100",
        iconWrap: "bg-violet-100 text-violet-600",
      },
      {
        label: "Pertumbuhan",
        val: report?.growth || "0%",
        icon: report?.growthType === "decrement" ? ArrowDownLeft : ArrowUpRight,
        card:
          report?.growthType === "decrement"
            ? "bg-rose-50/90 border-rose-100"
            : "bg-amber-50/90 border-amber-100",
        iconWrap:
          report?.growthType === "decrement"
            ? "bg-rose-100 text-rose-600"
            : "bg-amber-100 text-amber-600",
      },
    ],
    [report],
  );

  const saveTarget = async () => {
    const targetAmount = Number(targetInput.replace(/\D/g, ""));

    if (!targetAmount || targetAmount <= 0) {
      notifyError("Target harus lebih dari 0");

      return;
    }

    setSavingTarget(true);
    http
      .post("/reports/revenue-target", { target_amount: targetAmount })
      .then(({ data }) => {
        notify(data.message || "Target berhasil disimpan");
        setReport((prev) =>
          prev
            ? {
                ...prev,
                reportMonthly: data.reportMonthly,
              }
            : prev,
        );
        setTargetModalOpen(false);
      })
      .catch((err) => notifyError(err))
      .finally(() => setSavingTarget(false));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-20">
      <HeaderAction
        actionIcon={FileSpreadsheet}
        subtitle="Analisis pemasukan, target bulanan, dan pertumbuhan bengkel secara akurat."
        title="Laporan Pendapatan"
        onAction={() => {
          /* Logic Export */
        }}
      />

      {loading && !report ? (
        <div className="flex justify-center py-24">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card
                key={item.label}
                className={`border shadow-sm transition-transform hover:-translate-y-0.5 ${item.card}`}
              >
                <CardBody className="flex flex-row items-center gap-4 p-5">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl ${item.iconWrap}`}
                  >
                    <item.icon size={22} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                    <p className="truncate text-lg font-bold text-slate-700">
                      {item.val}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className="border border-primary-100 bg-white/90 shadow-sm">
            <CardHeader className="flex items-center justify-between px-6 pb-0 pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <LineChart size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Trend Pendapatan Bulan Ini
                  </h3>
                  <p className="text-xs text-slate-500">
                    Akumulasi harian pendapatan {monthly?.month_name}
                  </p>
                </div>
              </div>
              <Chip color="primary" size="sm" variant="flat">
                Live
              </Chip>
            </CardHeader>
            <CardBody className="px-6 pb-6 pt-4">
              <RevenueChart data={report?.trend || []} />
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <CardHeader className="flex items-center justify-between px-6 pb-0 pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-secondary/10 p-2 text-secondary">
                    <PieChart size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Sumber Pendapatan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Distribusi layanan, suku cadang, dan penjualan
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-6 px-6 py-6">
                {report?.grafik.map((cat) => (
                  <div key={cat.label} className="space-y-2">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {cat.label}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatIDR(cat.value)}
                        </p>
                      </div>
                      <Chip
                        color={(cat.color as "primary") || "primary"}
                        size="sm"
                        variant="flat"
                      >
                        {cat.percentage}%
                      </Chip>
                    </div>
                    <Progress
                      aria-label={cat.label}
                      className="h-3"
                      color={(cat.color as "primary") || "primary"}
                      value={cat.percentage}
                    />
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card className="overflow-hidden border border-violet-100 bg-violet-50/60 shadow-sm">
              <CardHeader className="flex items-center gap-3 px-6 pb-0 pt-6">
                <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
                  <Target size={20} />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-slate-700">
                    Target Bulanan
                  </h5>
                  <p className="text-xs text-slate-500">
                    {monthly?.month_name}
                  </p>
                </div>
              </CardHeader>

              <CardBody className="space-y-4 px-6 py-5">
                <div className="rounded-2xl border border-violet-100 bg-white/80 p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Target
                    </p>
                    {!monthly?.is_target_set && (
                      <Chip color="warning" size="sm" variant="flat">
                        Estimasi
                      </Chip>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-700">
                    {formatIDR(monthly?.target_amount || 0)}
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-white/80 p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Pencapaian
                    </p>
                    <TrendingUp className="text-emerald-500" size={16} />
                  </div>
                  <p className="text-xl font-bold text-slate-700">
                    {formatIDR(monthly?.current_revenue || 0)}
                  </p>
                  <Progress
                    aria-label="Monthly Target"
                    className="mt-4 h-3"
                    classNames={{
                      track: "bg-violet-100",
                    }}
                    color={progressColor}
                    value={monthly?.progress_display || 0}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>
                      {(monthly?.progress_value || 0).toFixed(1)}% tercapai
                    </span>
                    <span>
                      Sisa {formatIDR(monthly?.remaining_amount || 0)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-slate-600">
                  <Sparkles className="mb-1 inline size-4 text-sky-500" />{" "}
                  {monthly?.growth_formatted} dibanding periode yang sama di
                  bulan {monthly?.last_month_name}.
                </div>

                <Button
                  fullWidth
                  color="secondary"
                  endContent={<ArrowRight size={16} />}
                  size="lg"
                  variant="flat"
                  onPress={() => {
                    setTargetInput(String(monthly?.target_amount || ""));
                    setTargetModalOpen(true);
                  }}
                >
                  Sesuaikan Target
                </Button>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      <div className="pt-2">
        <div className="mb-6 flex items-center gap-3 px-1">
          <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-primary to-secondary" />
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Riwayat Transaksi Terakhir
            </h2>
            <p className="text-xs text-slate-500">
              Daftar invoice dan pembayaran terbaru
            </p>
          </div>
        </div>
        <InvoiceListPage noHeader />
      </div>

      <Modal
        isOpen={targetModalOpen}
        placement="center"
        onOpenChange={setTargetModalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-primary">Target Pendapatan</span>
                <span className="text-sm font-normal text-default-500">
                  Tetapkan target bulan {monthly?.month_name}
                </span>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nominal Target Bulanan"
                  placeholder="Contoh: 50000000"
                  startContent={<Target className="text-primary" size={16} />}
                  type="number"
                  value={targetInput}
                  onValueChange={setTargetInput}
                />
                <p className="text-xs text-default-400">
                  Pencapaian saat ini:{" "}
                  <span className="font-semibold text-default-600">
                    {formatIDR(monthly?.current_revenue || 0)}
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  color="primary"
                  isLoading={savingTarget}
                  onPress={saveTarget}
                >
                  Simpan Target
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
