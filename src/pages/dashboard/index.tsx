import { CalendarDays, Car, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@heroui/react";

import { ServiceQueue } from "@/components/dashboard/service-queue";
import { StatsGrid } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { InventoryAlert } from "@/components/dashboard/inventory-alert";
import { QuickActions } from "@/components/dashboard/quick-action";
import { useAppDispatch } from "@/stores/hooks";
import { getDashboard } from "@/stores/features/dashboard/dashboard-action";

dayjs.locale("id");

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

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
              Dashboard Operasional
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
              Ringkasan Bengkel
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <CalendarDays className="size-4 text-slate-400" />
              <span>{dayjs().format("dddd, DD MMMM YYYY")}</span>
              <Chip color="success" size="sm" variant="flat">
                Sistem Online
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
            Work Order Baru
          </Button>
        </div>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <RevenueChart />

          <section>
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Antrean Workshop
                </h2>
                <p className="text-xs text-slate-500">
                  Unit servis yang sedang berjalan hari ini
                </p>
              </div>
              <Button
                className="font-semibold"
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => navigate("/service/queue")}
              >
                Lihat Semua
              </Button>
            </div>
            <ServiceQueue />
          </section>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/90 via-white to-sky-50/80 p-6 shadow-sm">
            <div className="pointer-events-none absolute -right-8 -top-10 rotate-12 text-violet-100">
              <Car size={160} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-bold leading-tight text-slate-700">
                Tingkatkan efisiensi servis harian
              </h4>
              <p className="mt-2 max-w-[220px] text-sm text-slate-500">
                Pantau antrean, stok kritis, dan pendapatan dari satu dashboard.
              </p>
              <Button
                className="mt-4 font-semibold"
                color="secondary"
                size="sm"
                variant="flat"
                onPress={() => navigate("/reports/revenue")}
              >
                Lihat Laporan
              </Button>
            </div>
          </div>

          <QuickActions />
          <InventoryAlert />
        </div>
      </div>
    </div>
  );
}
