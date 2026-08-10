import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Chip } from "@heroui/react";

import DashboardSkeleton from "./dashboard-skeleton";

import { ServiceQueue } from "@/components/dashboard/service-queue";
import { StatsGrid } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { InventoryAlert } from "@/components/dashboard/inventory-alert";
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
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-sky-50/80 to-violet-50/60 p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Sparkles className="size-4 text-sky-500" />
              {t("dashboard.badge")}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
              {t("dashboard.title")}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <CalendarDays className="size-4 text-slate-400" />
              <span>{dayjs().format("dddd, DD MMMM YYYY")}</span>
              <Chip color="success" size="sm" variant="flat">
                {t("dashboard.system_online")}
              </Chip>
            </div>
          </div>

          <Button
            color="primary"
            size="lg"
            startContent={<Plus size={18} />}
            variant="flat"
            onPress={() => navigate("/service/add")}
          >
            {t("dashboard.new_work_order")}
          </Button>
        </div>
      </div>

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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
