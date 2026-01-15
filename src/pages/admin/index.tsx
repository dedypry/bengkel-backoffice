import { Car, CalendarDays, Plus } from "lucide-react";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/joy";

import { ServiceQueue } from "@/components/dashboard/service-queue";
import { StatsGrid } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { InventoryAlert } from "@/components/dashboard/inventory-alert";
import { QuickActions } from "@/components/dashboard/quick-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDashboard } from "@/stores/features/dashboard/dashboard-action";

export default function HomePage() {
  const { dashboard } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDashboard());
  }, []);

  return (
    <div className="max-w-400 mx-auto pb-10 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ringkasan Bengkel
          </h1>
          <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
            <CalendarDays className="size-4" />
            <span>{dayjs().format("dddd, DD MMMM YYYY")}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-emerald-600 font-medium">Sistem Online</span>
          </div>
        </div>

        <Button
          startDecorator={<Plus />}
          onClick={() => navigate("/service/add")}
        >
          Work Order Baru
        </Button>
      </div>

      {/* STATS SECTION */}
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN CONTENT (LEFT) */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-1 bg-slate-50/50 border-b border-slate-100">
              {/* Tab or Header inside chart if needed */}
            </div>
            <RevenueChart />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Antrean Workshop</h2>
              <Button
                size="sm"
                variant="outlined"
                onClick={() => navigate("/service/queue")}
              >
                Lihat Semua Antrean
              </Button>
            </div>
            <ServiceQueue />
          </section>
        </div>

        {/* SIDEBAR CONTENT (RIGHT) */}
        <div className="lg:col-span-4 space-y-8">
          {/* PROMO / QUICK ACTION CARD */}
          <div className="relative overflow-hidden bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 group">
            <div className="absolute -right-4 -top-4 text-white/10 rotate-12 transition-transform group-hover:scale-110">
              <Car size={120} />
            </div>

            <div className="relative z-10">
              <h4 className="text-white font-bold text-xl leading-tight">
                Efisiensi Pengerjaan <br /> Meningkat 20%
              </h4>
              <p className="text-white/80 text-xs mt-2 max-w-50">
                Gunakan fitur scan QR untuk mempercepat input data kendaraan.
              </p>
              <Button
                size="sm"
                sx={{
                  mt: 2,
                  borderColor: "white",
                  color: "white",
                  ":hover": {
                    color: "black",
                  },
                }}
                variant="outlined"
              >
                Pelajari Fitur
              </Button>
            </div>
          </div>

          <QuickActions />

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="h-4 w-1 bg-red-500 rounded-full" />
              <h3 className="font-bold text-slate-800">Peringatan Stok</h3>
            </div>
            <InventoryAlert />
          </div>
        </div>
      </div>
    </div>
  );
}
