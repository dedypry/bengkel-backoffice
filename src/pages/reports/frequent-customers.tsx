import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  BarChart3,
  CalendarRange,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Users,
  Wrench,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import FrequentCustomersChart from "./components/frequent-customers-chart";

import HeaderAction from "@/components/header-action";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { handleDownload, handleDownloadExcel } from "@/utils/helpers/global";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";

type FrequentCustomerItem = {
  rank: number;
  customer_id: number;
  name: string;
  phone: string;
  service_count: number;
  total_spending: number;
  last_service_at: string;
  last_service_label: string;
  vehicle_count: number;
};

type FrequentCustomersReport = {
  period: {
    startDate: string;
    endDate: string;
    label: string;
  };
  summary: {
    customer_count: number;
    total_services: number;
    total_spending: number;
    avg_services: number;
  };
  items: FrequentCustomerItem[];
  chart: {
    name: string;
    fullName: string;
    service_count: number;
    total_spending: number;
  }[];
};

const defaultStart = dayjs().startOf("month").format("YYYY-MM-DD");
const defaultEnd = dayjs().format("YYYY-MM-DD");

export default function ReportFrequentCustomers() {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [report, setReport] = useState<FrequentCustomersReport>();
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const queryParams = useMemo(
    () => ({
      startDate,
      endDate,
      limit: 50,
    }),
    [startDate, endDate],
  );

  const getReport = useCallback(async () => {
    setLoading(true);
    http
      .get("/reports/frequent-customers", { params: queryParams })
      .then(({ data }) => setReport(data))
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }, [queryParams]);

  useEffect(() => {
    void getReport();
  }, [getReport]);

  const stats = useMemo(
    () => [
      {
        label: t("reports.frequent_customers.stat_active"),
        val: formatNumber(report?.summary.customer_count || 0),
        icon: Users,
        card: "bg-violet-50/90 border-violet-100",
        iconWrap: "bg-violet-100 text-violet-600",
      },
      {
        label: t("reports.frequent_customers.stat_visits"),
        val: formatNumber(report?.summary.total_services || 0),
        icon: Wrench,
        card: "bg-sky-50/90 border-sky-100",
        iconWrap: "bg-sky-100 text-sky-600",
      },
      {
        label: t("reports.frequent_customers.stat_avg"),
        val: `${formatNumber(report?.summary.avg_services || 0)}${t("reports.frequent_customers.visit_suffix")}`,
        icon: BarChart3,
        card: "bg-amber-50/90 border-amber-100",
        iconWrap: "bg-amber-100 text-amber-600",
      },
      {
        label: t("reports.frequent_customers.stat_spending"),
        val: formatIDR(report?.summary.total_spending || 0),
        icon: CalendarRange,
        card: "bg-emerald-50/90 border-emerald-100",
        iconWrap: "bg-emerald-100 text-emerald-600",
      },
    ],
    [report, t],
  );

  return (
    <div className="space-y-6 pb-20 px-4 max-w-7xl mx-auto">
      <HeaderAction
        actionContent={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="w-40"
              label={t("common.from")}
              size="sm"
              type="date"
              value={startDate}
              onValueChange={setStartDate}
            />
            <Input
              className="w-40"
              label={t("common.to")}
              size="sm"
              type="date"
              value={endDate}
              onValueChange={setEndDate}
            />
            <Button
              color="primary"
              isLoading={loading}
              startContent={!loading ? <RefreshCw size={16} /> : undefined}
              variant="flat"
              onPress={() => void getReport()}
            >
              {t("reports.frequent_customers.apply")}
            </Button>
            <Button
              className="bg-emerald-50 text-emerald-700 font-bold"
              isLoading={exportingExcel}
              startContent={
                !exportingExcel ? <FileSpreadsheet size={16} /> : undefined
              }
              variant="flat"
              onPress={() =>
                void handleDownloadExcel(
                  "/reports/frequent-customers/export/excel",
                  queryParams,
                  "laporan-pelanggan-sering-service",
                  setExportingExcel,
                )
              }
            >
              {t("reports.frequent_customers.export_excel")}
            </Button>
            <Button
              className="bg-rose-50 text-rose-700 font-bold"
              isLoading={exportingPdf}
              startContent={!exportingPdf ? <FileText size={16} /> : undefined}
              variant="flat"
              onPress={() =>
                void handleDownload(
                  `/reports/frequent-customers/export/pdf?startDate=${startDate}&endDate=${endDate}&limit=50`,
                  "laporan-pelanggan-sering-service",
                  false,
                  setExportingPdf,
                )
              }
            >
              {t("reports.frequent_customers.export_pdf")}
            </Button>
          </div>
        }
        subtitle={t("reports.frequent_customers.subtitle")}
        title={t("reports.frequent_customers.title")}
      />

      {loading && !report ? (
        <div className="flex justify-center py-20">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((item) => (
              <Card
                key={item.label}
                className={`border shadow-sm ${item.card}`}
                shadow="none"
              >
                <CardBody className="flex flex-row items-center gap-4 p-5">
                  <div className={`p-3 rounded-xl ${item.iconWrap}`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-500">
                      {item.label}
                    </p>
                    <p className="text-xl font-black text-gray-600">
                      {item.val}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className="border border-gray-100 shadow-sm" shadow="none">
            <CardHeader className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
              <h2 className="text-sm font-black uppercase text-gray-500">
                {t("reports.frequent_customers.chart_title")}
              </h2>
              <p className="text-xs text-gray-400">
                {t("reports.frequent_customers.chart_period")}{" "}
                {report?.period.label}
              </p>
            </CardHeader>
            <CardBody className="px-4 pb-6">
              {report?.chart?.length ? (
                <FrequentCustomersChart data={report.chart} />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
                  {t("reports.frequent_customers.chart_empty")}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="border border-gray-100 shadow-sm" shadow="none">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
              <div>
                <h2 className="text-sm font-black uppercase text-gray-500">
                  {t("reports.frequent_customers.table_title")}
                </h2>
                <p className="text-xs text-gray-400">
                  {t("reports.frequent_customers.table_subtitle")}
                </p>
              </div>
              <Chip color="secondary" size="sm" variant="flat">
                {formatNumber(report?.items.length || 0)}{" "}
                {t("reports.frequent_customers.customers_suffix")}
              </Chip>
            </CardHeader>
            <CardBody className="px-2 pb-4">
              <Table
                aria-label={t("reports.frequent_customers.table_aria")}
                classNames={{
                  th: "bg-gray-50 text-[10px] font-black uppercase text-gray-500",
                  td: "text-sm text-gray-600",
                }}
              >
                <TableHeader>
                  <TableColumn width={60}>
                    {t("reports.frequent_customers.col_no")}
                  </TableColumn>
                  <TableColumn>
                    {t("reports.frequent_customers.col_customer")}
                  </TableColumn>
                  <TableColumn>
                    {t("reports.frequent_customers.col_phone")}
                  </TableColumn>
                  <TableColumn align="center">
                    {t("reports.frequent_customers.col_service")}
                  </TableColumn>
                  <TableColumn align="center">
                    {t("reports.frequent_customers.col_vehicles")}
                  </TableColumn>
                  <TableColumn align="end">
                    {t("reports.frequent_customers.col_spending")}
                  </TableColumn>
                  <TableColumn align="end">
                    {t("reports.frequent_customers.col_last_service")}
                  </TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={t("reports.frequent_customers.table_empty")}
                  items={report?.items || []}
                >
                  {(item) => (
                    <TableRow key={item.customer_id}>
                      <TableCell>
                        <Chip
                          className="font-black"
                          color={item.rank <= 3 ? "warning" : "default"}
                          size="sm"
                          variant="flat"
                        >
                          {item.rank}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-gray-600">{item.name}</p>
                      </TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>
                        <div className="text-center font-black text-violet-600">
                          {formatNumber(item.service_count)}
                          {t("reports.frequent_customers.visit_suffix")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          {formatNumber(item.vehicle_count)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-end font-bold text-emerald-600">
                          {formatIDR(item.total_spending)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-end text-gray-500">
                          {item.last_service_label}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
