import { AlertTriangle, ArrowRight, PackageSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  ScrollShadow,
  Tooltip,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";

export function InventoryAlert() {
  const { t } = useTranslation();
  const { dashboard } = useAppSelector((state) => state.dashboard);
  const navigate = useNavigate();
  const itemCount = dashboard?.product?.length || 0;

  return (
    <Card className="overflow-hidden border border-rose-100 bg-rose-50/70 shadow-sm">
      <CardHeader className="flex items-center justify-between px-5 pb-2 pt-5">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-600">
            <AlertTriangle className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">
              {t("dashboard.inventory_alert.title")}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t("dashboard.inventory_alert.critical_restock")}
            </p>
          </div>
        </div>
        <Chip color="warning" size="sm" variant="flat">
          {t("dashboard.inventory_alert.item_count", { count: itemCount })}
        </Chip>
      </CardHeader>

      <CardBody className="px-5 pb-5">
        <ScrollShadow className="max-h-[320px] space-y-2 rounded-2xl bg-white/70 p-2">
          {itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <PackageSearch size={32} />
              <p className="mt-2 text-sm">
                {t("dashboard.inventory_alert.empty")}
              </p>
            </div>
          ) : (
            dashboard?.product.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-rose-100/80 bg-white px-3 py-2.5 transition-colors hover:bg-rose-50/50"
              >
                <div className="flex items-center gap-3">
                  <Tooltip
                    color={item.stock === 0 ? "danger" : "warning"}
                    content={
                      item.stock === 0
                        ? t("dashboard.inventory_alert.out_of_stock")
                        : t("dashboard.inventory_alert.low_stock")
                    }
                    placement="left"
                  >
                    <div
                      className={`size-2.5 rounded-full ${
                        item.stock === 0
                          ? "animate-pulse bg-rose-400"
                          : "bg-amber-400"
                      }`}
                    />
                  </Tooltip>
                  <div>
                    <p className="text-sm font-semibold leading-tight text-slate-700">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t("dashboard.inventory_alert.remaining")}{" "}
                      <span
                        className={
                          item.stock === 0
                            ? "font-bold text-rose-600"
                            : "font-semibold"
                        }
                      >
                        {item.stock} {item.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <PackageSearch className="size-4 text-slate-300" />
              </div>
            ))
          )}
        </ScrollShadow>

        <Button
          fullWidth
          className="mt-4 font-semibold"
          color="primary"
          endContent={<ArrowRight className="size-4" />}
          size="sm"
          variant="flat"
          onPress={() => navigate("/inventory/stock")}
        >
          {t("dashboard.inventory_alert.view_warehouse")}
        </Button>
      </CardBody>
    </Card>
  );
}
