import { Plus, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/react";

import DashboardSkeleton from "./dashboard-skeleton";

import HeaderAction from "@/components/header-action";
import { ServiceQueue } from "@/components/dashboard/service-queue";
import { StatsGrid } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { InventoryAlert } from "@/components/dashboard/inventory-alert";
import { QuickActions } from "@/components/dashboard/quick-action";
import { BestEmployees } from "@/components/dashboard/best-employees";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDashboard } from "@/stores/features/dashboard/dashboard-action";

dayjs.locale("id");

export default function HomePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const { isLoadingDashboard, dashboard } = useAppSelector(
    (state) => state.dashboard,
  );

  const isInitialLoading = isLoadingDashboard && !dashboard;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getDashboard());

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [dispatch]);

  return (
    <div className="space-y-8 pb-10">
      <HeaderAction
        actionIcon={Plus}
        actionTitle={t("dashboard.new_work_order")}
        leadIcon={Sparkles}
        subtitle={`${t("dashboard.badge")} · ${dayjs().format("dddd, DD MMMM YYYY")} · ${t("dashboard.system_online")}`}
        title={t("dashboard.title")}
        onAction={() => navigate("/service/add")}
      />

      {isInitialLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <StatsGrid />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <RevenueChart />

              <section>
                <div className="mb-4 flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {t("dashboard.queue_title")}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t("dashboard.queue_subtitle")}
                    </p>
                  </div>
                  <Button
                    className="font-semibold"
                    color="primary"
                    size="sm"
                    variant="flat"
                    onPress={() => navigate("/service/queue")}
                  >
                    {t("common.view_all")}
                  </Button>
                </div>
                <ServiceQueue />
              </section>
            </div>

            <div className="space-y-8 lg:col-span-4">
              <BestEmployees />
              <InventoryAlert />
              <QuickActions />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
