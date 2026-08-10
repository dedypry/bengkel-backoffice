import type { IProduct } from "@/utils/interfaces/IProduct";

import {
  AlertTriangle,
  Download,
  LayoutGrid,
  List,
  PackageSearch,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import TopPartSkeleton from "./components/top-part-skeleton";
import TopPartEmptyState from "./components/top-part-empty";
import TopPartRestockModal from "./components/top-part-restock-modal";

import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { handleDownloadExcel } from "@/utils/helpers/global";

type ViewMode = "grid" | "table";

const TOP_PARTS_VIEW_MODE_KEY = "reports-top-parts-view-mode";
const LOW_STOCK_THRESHOLD = 10;

function getStoredViewMode(): ViewMode {
  const stored = localStorage.getItem(TOP_PARTS_VIEW_MODE_KEY);

  return stored === "grid" || stored === "table" ? stored : "table";
}

function getTotalRevenue(item: IProduct) {
  return Number(item.sold || 0) * Number(item.sell_price || 0);
}

function isLowStock(item: IProduct) {
  return Number(item.stock ?? 0) < LOW_STOCK_THRESHOLD;
}

function TopPartGridCard({
  item,
  rank,
  onRestock,
}: {
  item: IProduct;
  rank: number;
  onRestock: (item: IProduct) => void;
}) {
  const { t } = useTranslation();
  const lowStock = isLowStock(item);
  const totalRevenue = getTotalRevenue(item);

  return (
    <Card className="border border-gray-100 transition-all hover:border-primary">
      <CardHeader className="relative flex flex-col items-start px-5 pb-0 pt-5">
        <Chip
          className="absolute right-3 top-3 font-bold uppercase"
          color="warning"
          size="sm"
          variant="flat"
        >
          {t("reports.top_parts.rank_prefix")}
          {rank}
        </Chip>
        <div className="mt-2 space-y-1 pe-16">
          <h3 className="text-sm font-black uppercase text-gray-700">
            {item.name}
          </h3>
          <p className="text-[10px] font-bold uppercase text-gray-400">
            {item.category?.name || t("reports.top_parts.general_part")}
          </p>
        </div>
      </CardHeader>

      <CardBody className="space-y-5 px-5 pb-5 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="flex items-center gap-1 text-[9px] font-black uppercase text-gray-400">
              <TrendingUp className="text-success" size={14} />
              {t("reports.top_parts.sold")}
            </p>
            <p className="text-lg font-black text-gray-700">
              {formatNumber(Number(item.sold || 0))}
              <span className="ml-1 text-xs font-bold uppercase text-gray-400">
                {item.uom?.code || item.unit}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-gray-400">
              {t("reports.top_parts.total_revenue")}
            </p>
            <p className="text-lg font-black text-success">
              {formatIDR(totalRevenue)}
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col gap-3 rounded-sm border p-3 ${
            lowStock
              ? "border-rose-100 bg-rose-50/50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-sm bg-white p-2.5 ${
                lowStock ? "text-danger" : "text-gray-500"
              }`}
            >
              <PackageSearch size={18} />
            </div>
            <div>
              <p
                className={`text-[10px] font-black uppercase ${
                  lowStock ? "text-rose-400" : "text-gray-400"
                }`}
              >
                {t("reports.top_parts.current_stock")}
              </p>
              <p
                className={`text-lg font-black ${
                  lowStock ? "text-rose-600" : "text-gray-600"
                }`}
              >
                {formatNumber(Number(item.stock ?? 0))}{" "}
                <span className="text-[10px] uppercase">
                  {item.uom?.code || item.unit}
                </span>
              </p>
            </div>
          </div>

          {lowStock ? (
            <Button
              className="font-bold uppercase"
              color="danger"
              size="sm"
              startContent={<AlertTriangle size={16} />}
              variant="flat"
              onPress={() => onRestock(item)}
            >
              {t("reports.top_parts.restock")}
            </Button>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

function TopPartTableView({
  products,
  onRestock,
}: {
  products: IProduct[];
  onRestock: (item: IProduct) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label={t("reports.top_parts.table_aria")}
          classNames={{
            th: "bg-gray-50 text-gray-600 font-bold text-xs uppercase whitespace-nowrap",
            td: "py-4",
          }}
        >
          <TableHeader>
            <TableColumn>{t("reports.top_parts.table.rank")}</TableColumn>
            <TableColumn>{t("reports.top_parts.table.product")}</TableColumn>
            <TableColumn className="hidden sm:table-cell">
              {t("reports.top_parts.table.category")}
            </TableColumn>
            <TableColumn align="center">
              {t("reports.top_parts.table.sold")}
            </TableColumn>
            <TableColumn align="end" className="hidden md:table-cell">
              {t("reports.top_parts.table.revenue")}
            </TableColumn>
            <TableColumn align="center">
              {t("reports.top_parts.table.stock")}
            </TableColumn>
            <TableColumn align="center" className="hidden lg:table-cell">
              {t("reports.top_parts.table.status")}
            </TableColumn>
            <TableColumn align="center"> </TableColumn>
          </TableHeader>
          <TableBody emptyContent={t("reports.top_parts.empty_title")}>
            {products.map((item, index) => {
              const lowStock = isLowStock(item);

              return (
                <TableRow key={item.id} className="border-b border-gray-100">
                  <TableCell>
                    <Chip color="warning" size="sm" variant="flat">
                      #{index + 1}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-[160px]">
                      <p className="text-sm font-bold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-400 sm:hidden">
                        {item.category?.name ||
                          t("reports.top_parts.general_part")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-gray-600">
                      {item.category?.name ||
                        t("reports.top_parts.general_part")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-center whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700">
                        {formatNumber(Number(item.sold || 0))}
                      </span>
                      <span className="ml-1 text-[10px] uppercase text-gray-400">
                        {item.uom?.code || item.unit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm font-bold text-success">
                      {formatIDR(getTotalRevenue(item))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-center whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${
                          lowStock ? "text-rose-600" : "text-gray-700"
                        }`}
                      >
                        {formatNumber(Number(item.stock ?? 0))}
                      </span>
                      <span className="ml-1 text-[10px] uppercase text-gray-400">
                        {item.uom?.code || item.unit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Chip
                      color={lowStock ? "danger" : "success"}
                      size="sm"
                      variant="dot"
                    >
                      {lowStock
                        ? t("reports.top_parts.status_low")
                        : t("reports.top_parts.status_ok")}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {lowStock ? (
                      <Button
                        color="danger"
                        size="sm"
                        startContent={<AlertTriangle size={14} />}
                        variant="flat"
                        onPress={() => onRestock(item)}
                      >
                        {t("reports.top_parts.restock")}
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default function ReportTopPart() {
  const { t } = useTranslation();
  const [products, setProduct] = useState<IProduct[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(() => getStoredViewMode());
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [restockProduct, setRestockProduct] = useState<IProduct | null>(null);
  const [restockOpen, setRestockOpen] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getProduct();
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, []);

  function getProduct() {
    setLoading(true);
    http
      .get("/products/top-part")
      .then(({ data }) => {
        setProduct(data.filter((item: IProduct) => Boolean(item?.id)));
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(TOP_PARTS_VIEW_MODE_KEY, mode);
  };

  const handleOpenRestock = (item: IProduct) => {
    setRestockProduct(item);
    setRestockOpen(true);
  };

  const handleCloseRestock = () => {
    setRestockOpen(false);
    setRestockProduct(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <TopPartRestockModal
        open={restockOpen}
        product={restockProduct}
        onClose={handleCloseRestock}
        onSuccess={getProduct}
      />
      <HeaderAction
        actionContent={
          <Button
            color="primary"
            isLoading={exporting}
            startContent={!exporting ? <Download size={18} /> : undefined}
            onPress={() =>
              void handleDownloadExcel(
                "/products/export/excel",
                {},
                "laporan-stok",
                setExporting,
              )
            }
          >
            {t("reports.top_parts.action")}
          </Button>
        }
        leadIcon={TrendingUp}
        subtitle={t("reports.top_parts.subtitle")}
        title={t("reports.top_parts.title")}
      />

      {loading ? (
        <TopPartSkeleton viewMode={viewMode} />
      ) : products.length === 0 ? (
        <TopPartEmptyState />
      ) : (
        <>
          <div className="flex items-center justify-end gap-2">
            <Button
              isIconOnly
              aria-label={t("reports.top_parts.view_grid")}
              color={viewMode === "grid" ? "primary" : "default"}
              size="sm"
              variant={viewMode === "grid" ? "solid" : "flat"}
              onPress={() => handleViewModeChange("grid")}
            >
              <LayoutGrid size={18} />
            </Button>
            <Button
              isIconOnly
              aria-label={t("reports.top_parts.view_table")}
              color={viewMode === "table" ? "primary" : "default"}
              size="sm"
              variant={viewMode === "table" ? "solid" : "flat"}
              onPress={() => handleViewModeChange("table")}
            >
              <List size={18} />
            </Button>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((item, index) => (
                <TopPartGridCard
                  key={item.id}
                  item={item}
                  rank={index + 1}
                  onRestock={handleOpenRestock}
                />
              ))}
            </div>
          ) : (
            <TopPartTableView
              products={products}
              onRestock={handleOpenRestock}
            />
          )}
        </>
      )}
    </div>
  );
}
