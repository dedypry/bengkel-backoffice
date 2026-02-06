/* eslint-disable import/order */
import { Car, CalendarDays, Plus } from "lucide-react";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// Import HeroUI Components
import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";

import { ServiceQueue } from "@/components/dashboard/service-queue";
import { StatsGrid } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { InventoryAlert } from "@/components/dashboard/inventory-alert";
import { QuickActions } from "@/components/dashboard/quick-action";
import { useAppDispatch } from "@/stores/hooks";
import { getDashboard } from "@/stores/features/dashboard/dashboard-action";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  return (
    <div className="max-w-[1400px] mx-auto pb-10 space-y-8 px-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-default-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-default-900">
            Ringkasan Bengkel
          </h1>
          <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
            <CalendarDays className="size-4" />
            <span>{dayjs().format("dddd, DD MMMM YYYY")}</span>
            <Divider className="h-3 mx-1" orientation="vertical" />
            <Chip
              className="font-medium h-5"
              color="success"
              size="sm"
              variant="flat"
            >
              Sistem Online
            </Chip>
          </div>
        </div>

        <Button
          className="font-medium"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => navigate("/service/add")}
        >
          Work Order Baru
        </Button>
      </div>

      {/* STATS SECTION */}
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN CONTENT (LEFT) */}
        <div className="lg:col-span-8 space-y-8">
          <Card shadow="sm">
            <CardBody className="p-0 overflow-hidden">
              {/* Tempat untuk Header Chart jika ada */}
              <RevenueChart />
            </CardBody>
          </Card>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-default-800">
                Antrean Workshop
              </h2>
              <Button
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => navigate("/service/queue")}
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
          <Card
            // Tambahkan overflow-hidden di sini untuk memotong ikon yang keluar batas
            className="relative bg-primary p-2 border-none overflow-hidden"
            shadow="lg"
          >
            <CardBody className="relative z-10 p-6">
              {/* Ikon tetap absolut, tapi tidak akan memicu scroll karena card sudah overflow-hidden */}
              <div className="absolute right-6 -top-6 text-white/10 rotate-12 transition-transform pointer-events-none">
                <Car size={140} />
              </div>

              <div className="relative z-20">
                {" "}
                {/* Tambahkan z-index agar teks tetap di atas ikon */}
                <h4 className="text-white font-bold text-xl leading-tight">
                  Efisiensi Pengerjaan <br /> Meningkat 20%
                </h4>
                <p className="text-white/80 text-xs mt-2 max-w-[180px]">
                  Gunakan fitur scan QR untuk mempercepat input data kendaraan.
                </p>
                <Button
                  className="mt-4 bg-white/20 text-white border-white/40 hover:bg-white/30"
                  size="sm"
                  variant="bordered"
                >
                  Pelajari Fitur
                </Button>
              </div>
            </CardBody>
          </Card>

          <QuickActions />

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="h-5 w-1.5 bg-danger rounded-full shadow-[0_0_10px_rgba(243,18,96,0.3)]" />
              <h3 className="font-bold text-default-800">Peringatan Stok</h3>
            </div>
            <InventoryAlert />
          </div>
        </div>
      </div>
    </div>
  );
}
