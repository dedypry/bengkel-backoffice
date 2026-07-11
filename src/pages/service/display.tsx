import type { IServiceDisplay, IServiceDisplayOrder } from "@/utils/interfaces/IServiceDisplay";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import {
  Car,
  CheckCircle2,
  Clock,
  Play,
  Sparkles,
  Volume2,
  Wrench,
} from "lucide-react";

import { useServiceQueueRealtime } from "@/hooks/use-service-queue-realtime";
import dayjs from "@/utils/helpers/dayjs";
import {
  announceCashierCall,
  isQueueAudioUnlocked,
  preloadIndonesianVoice,
  unlockQueueAudio,
} from "@/utils/helpers/queue-announcement";
import { http } from "@/utils/libs/axios";

const PROGRESS_STEPS = [
  { key: "queue", label: "Antre", icon: Clock },
  { key: "on_progress", label: "Dikerjakan", icon: Play },
  { key: "ready", label: "Siap Diambil", icon: CheckCircle2 },
] as const;

const PROGRESS_RANK: Record<string, number> = {
  queue: 0,
  on_progress: 1,
  ready: 2,
};

const CARD_STYLES = [
  "border-sky-200 bg-gradient-to-br from-sky-50 to-white text-sky-900",
  "border-violet-200 bg-gradient-to-br from-violet-50 to-white text-violet-900",
  "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-900",
  "border-amber-200 bg-gradient-to-br from-amber-50 to-white text-amber-900",
  "border-rose-200 bg-gradient-to-br from-rose-50 to-white text-rose-900",
  "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white text-indigo-900",
];

const FEATURED_STATUS = {
  queue: {
    label: "Menunggu Antrean",
    chip: "Menunggu Giliran",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-300/50",
  },
  on_progress: {
    label: "Sedang Dikerjakan",
    chip: "Dalam Pengerjaan",
    gradient: "from-indigo-600 to-violet-600",
    glow: "shadow-indigo-300/50",
  },
  ready: {
    label: "Siap Diambil",
    chip: "Silakan ke Kasir",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-300/50",
  },
} as const;

function getCompanyId() {
  const params = new URLSearchParams(window.location.search);

  return Number(
    params.get("company_id") || localStorage.getItem("queue_company_id") || 1,
  );
}

function getProgressRank(progress: string) {
  return PROGRESS_RANK[progress] ?? 0;
}

function getProgressLabel(progress: string) {
  return PROGRESS_STEPS.find((step) => step.key === progress)?.label || progress;
}

function ServiceProgressSteps({
  progress,
  compact = false,
}: {
  progress: string;
  compact?: boolean;
}) {
  const activeRank = getProgressRank(progress);

  return (
    <div className={`w-full ${compact ? "mt-2" : "mt-4"}`}>
      <div className="flex items-center">
        {PROGRESS_STEPS.map((step, index) => {
          const isDone = index < activeRank;
          const isActive = index === activeRank;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex min-w-0 flex-col items-center gap-1">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    compact ? "size-7" : "size-9 sm:size-10"
                  } ${
                    isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isActive
                        ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                        : "border-slate-200 bg-white text-slate-300"
                  }`}
                >
                  <StepIcon className={compact ? "size-3" : "size-4"} />
                </div>
                <span
                  className={`text-center font-bold leading-tight ${
                    compact ? "text-[9px]" : "text-[10px] sm:text-xs"
                  } ${
                    isActive
                      ? "text-primary"
                      : isDone
                        ? "text-emerald-600"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < PROGRESS_STEPS.length - 1 && (
                <div
                  className={`mx-1 h-1 flex-1 rounded-full ${
                    compact ? "mb-4" : "mb-5"
                  } ${index < activeRank ? "bg-emerald-400" : "bg-slate-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  index,
  highlighted = false,
}: {
  order: IServiceDisplayOrder;
  index: number;
  highlighted?: boolean;
}) {
  const status = FEATURED_STATUS[order.progress as keyof typeof FEATURED_STATUS];

  return (
    <Card
      className={`min-h-0 overflow-hidden border-2 shadow-lg backdrop-blur-sm ${
        highlighted
          ? "border-emerald-400 bg-white ring-2 ring-emerald-200"
          : `border-0 ${CARD_STYLES[index % CARD_STYLES.length]}`
      }`}
    >
      <CardBody className="p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-lg font-black tracking-tight sm:text-xl">
              {order.plate_number || "---"}
            </p>
            <p className="truncate text-[10px] opacity-70 sm:text-xs">
              {order.vehicle_name || "Kendaraan"}
            </p>
          </div>
          <Chip
            className={`shrink-0 font-bold ${
              order.progress === "ready"
                ? "bg-emerald-500 text-white"
                : order.progress === "on_progress"
                  ? "bg-indigo-500 text-white"
                  : "bg-amber-500 text-white"
            }`}
            size="sm"
          >
            {getProgressLabel(order.progress)}
          </Chip>
        </div>

        <ServiceProgressSteps compact progress={order.progress} />

        <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
          <span>No. {order.queue_no || order.trx_no || "-"}</span>
          {status && <span>{status.chip}</span>}
        </div>
      </CardBody>
    </Card>
  );
}

export default function ServiceDisplayPage() {
  const companyId = useMemo(() => getCompanyId(), []);
  const [display, setDisplay] = useState<IServiceDisplay | null>(null);
  const [now, setNow] = useState(new Date());
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const audioEnabledRef = useRef(false);
  const lastAnnouncedRef = useRef<string | null>(null);

  const featured = display?.featured;
  const featuredStatus = featured
    ? FEATURED_STATUS[featured.progress as keyof typeof FEATURED_STATUS]
    : null;

  const load = useCallback(() => {
    http
      .get("/service-queue/display", { params: { company_id: companyId } })
      .then(({ data }) => setDisplay(data))
      .catch(() => undefined);
  }, [companyId]);

  const enableAudio = useCallback(() => {
    preloadIndonesianVoice();
    unlockQueueAudio();
    audioEnabledRef.current = true;
    setAudioEnabled(true);
  }, []);

  const handleCashierCall = useCallback(
    (payload: {
      work_order_id?: number;
      plate_number?: string;
      trx_no?: string | null;
      updated_at?: string;
    }) => {
      load();

      if (payload.work_order_id) {
        setHighlightId(payload.work_order_id);
        window.setTimeout(() => setHighlightId(null), 12000);
      }

      if (!audioEnabledRef.current || !payload.plate_number) {
        return;
      }

      const announceKey = `${payload.plate_number}-${payload.updated_at ?? Date.now()}`;

      if (lastAnnouncedRef.current === announceKey) {
        return;
      }

      lastAnnouncedRef.current = announceKey;

      announceCashierCall({
        plateNumber: payload.plate_number,
        trxNo: payload.trx_no,
      });
    },
    [load],
  );

  useEffect(() => {
    localStorage.setItem("queue_company_id", companyId.toString());
    load();

    const clockInterval = window.setInterval(() => setNow(new Date()), 1000);
    const refreshInterval = window.setInterval(load, 60000);

    return () => {
      window.clearInterval(clockInterval);
      window.clearInterval(refreshInterval);
    };
  }, [companyId, load]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    preloadIndonesianVoice();
  }, []);

  useServiceQueueRealtime(companyId, {
    onServiceUpdate: load,
    onCashierCall: handleCashierCall,
  });

  return (
    <div className="relative flex h-dvh w-screen flex-col overflow-hidden bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 p-3 sm:p-4">
      {!audioEnabled && (
        <div className="absolute inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
          <Button
            className="shadow-lg"
            color="warning"
            size="lg"
            startContent={<Volume2 size={20} />}
            onClick={enableAudio}
            onPress={enableAudio}
          >
            Klik untuk Aktifkan Suara Panggilan
          </Button>
        </div>
      )}

      {audioEnabled && isQueueAudioUnlocked() && (
        <div className="absolute right-3 top-3 z-50 sm:right-4 sm:top-4">
          <Chip
            className="border border-emerald-200 bg-emerald-50 text-emerald-700"
            size="sm"
            startContent={<Volume2 className="size-3.5" />}
            variant="flat"
          >
            Suara aktif
          </Chip>
        </div>
      )}

      <header className="flex shrink-0 items-center justify-between rounded-2xl border border-white/60 bg-gradient-to-r from-slate-800 via-slate-700 to-sky-700 px-4 py-3 text-white shadow-lg shadow-slate-400/40 sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-xs font-bold uppercase tracking-wide text-white/90 sm:text-sm">
            <Sparkles className="size-3.5 shrink-0 text-amber-200 sm:size-4" />
            {display?.company_name || "Bengkel"}
          </p>
          <h1 className="truncate text-xl font-black sm:text-2xl lg:text-3xl">
            Status Pengerjaan Service
          </h1>
        </div>
        <div className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-right backdrop-blur-sm sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
            {dayjs(now).format("dddd, DD MMMM YYYY")}
          </p>
          <p className="font-mono text-sm font-bold tabular-nums sm:text-lg lg:text-2xl">
            {dayjs(now).format("HH:mm:ss")}{" "}
            <span className="text-xs font-bold text-amber-200 sm:text-sm">
              WIB
            </span>
          </p>
        </div>
      </header>

      <div className="mt-3 grid shrink-0 grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
        {[
          {
            label: "Menunggu",
            value: display?.stats.waiting || 0,
            icon: Clock,
            gradient: "from-amber-500 to-orange-500",
          },
          {
            label: "Dikerjakan",
            value: display?.stats.processing || 0,
            icon: Wrench,
            gradient: "from-indigo-500 to-violet-500",
          },
          {
            label: "Siap Diambil",
            value: display?.stats.ready || 0,
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-teal-500",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`border-0 bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
          >
            <CardBody className="flex flex-row items-center gap-2 p-3 sm:gap-3 sm:p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 sm:size-10">
                <stat.icon className="size-4 sm:size-5" />
              </div>
              <div>
                <p className="text-xl font-black sm:text-2xl lg:text-3xl">
                  {stat.value}
                </p>
                <p className="text-[9px] font-bold uppercase text-white/80 sm:text-[10px]">
                  {stat.label}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <main className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-5">
        <Card
          className={`min-h-0 overflow-hidden border-0 bg-gradient-to-br from-white via-sky-50 to-emerald-50 shadow-xl lg:col-span-2 ${featuredStatus?.glow || "shadow-slate-200/50"}`}
        >
          <CardBody className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden p-4 text-center sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-emerald-200/30 blur-2xl" />

            <p className="relative mb-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-black uppercase tracking-wider text-primary sm:mb-3 sm:text-base">
              {featuredStatus?.label || "Belum Ada Unit"}
            </p>

            <div className="relative bg-gradient-to-b from-slate-800 to-sky-600 bg-clip-text font-black leading-none tracking-tight text-transparent [font-size:clamp(2.5rem,10vh,5.5rem)]">
              {featured?.plate_number || "---"}
            </div>

            <p className="relative mt-2 line-clamp-2 max-w-full text-sm font-bold text-slate-700 sm:text-lg">
              {featured?.vehicle_name || "Belum ada kendaraan dalam antrean"}
            </p>

            {featured && (
              <>
                <Chip
                  className={`relative mt-3 px-4 py-2 text-sm font-bold text-white sm:text-base ${
                    featured.progress === "ready"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : featured.progress === "on_progress"
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                  }`}
                  size="lg"
                >
                  {featuredStatus?.chip}
                </Chip>

                <div className="relative mt-4 w-full max-w-md px-2">
                  <ServiceProgressSteps progress={featured.progress} />
                </div>

                <p className="relative mt-3 text-xs text-slate-500 sm:text-sm">
                  No. Order {featured.queue_no || featured.trx_no || "-"}
                </p>
              </>
            )}
          </CardBody>
        </Card>

        <Card className="min-h-0 overflow-hidden border-0 bg-white/90 shadow-xl shadow-sky-200/50 backdrop-blur-sm lg:col-span-3">
          <CardBody className="flex h-full min-h-0 flex-col p-3 sm:p-4">
            <div className="mb-3 flex shrink-0 items-center gap-2 rounded-lg bg-sky-100 px-3 py-2 text-sky-800">
              <Car className="size-4" />
              <h2 className="text-xs font-black uppercase sm:text-sm">
                Daftar Kendaraan Hari Ini
              </h2>
              <Chip className="ml-auto" size="sm" variant="flat">
                {display?.stats.total || 0} unit
              </Chip>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-modern">
              {(display?.orders || []).length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {(display?.orders || []).map((order, index) => (
                    <OrderCard
                      key={order.id}
                      highlighted={highlightId === order.id}
                      index={index}
                      order={order}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                  <Car className="mb-3 size-12 opacity-30" />
                  <p className="text-sm font-medium sm:text-base">
                    Belum ada kendaraan dalam antrean service hari ini.
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
