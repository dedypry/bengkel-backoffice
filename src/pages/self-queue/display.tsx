import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Clock, Sparkles, Users, Volume2 } from "lucide-react";

import type { IQueueDisplay } from "@/utils/interfaces/IQueue";

import { useCompanyQueueRealtime } from "@/hooks/use-company-queue-realtime";
import dayjs from "@/utils/helpers/dayjs";
import {
  announceQueueCall,
  isQueueAudioUnlocked,
  preloadIndonesianVoice,
  unlockQueueAudio,
} from "@/utils/helpers/queue-announcement";
import { http } from "@/utils/libs/axios";

const WAITING_ROW_STYLES = [
  "border-sky-200 bg-sky-50 text-sky-900",
  "border-violet-200 bg-violet-50 text-violet-900",
  "border-emerald-200 bg-emerald-50 text-emerald-900",
  "border-amber-200 bg-amber-50 text-amber-900",
  "border-rose-200 bg-rose-50 text-rose-900",
];

const HISTORY_TILE_STYLES = [
  "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 text-orange-900",
  "border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-100 text-cyan-900",
  "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-purple-100 text-fuchsia-900",
  "border-lime-200 bg-gradient-to-br from-lime-50 to-emerald-100 text-lime-900",
];

function getCompanyId() {
  const params = new URLSearchParams(window.location.search);

  return Number(
    params.get("company_id") || localStorage.getItem("queue_company_id") || 1,
  );
}

export default function QueueDisplayPage() {
  const companyId = useMemo(() => getCompanyId(), []);
  const [display, setDisplay] = useState<IQueueDisplay | null>(null);
  const [now, setNow] = useState(new Date());
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioEnabledRef = useRef(false);
  const lastAnnouncedRef = useRef<string | null>(null);

  const current = display?.calling?.[0];
  const history = display?.calling?.slice(1) || [];

  const load = useCallback(() => {
    http
      .get("/queue/display", { params: { company_id: companyId } })
      .then(({ data }) => setDisplay(data))
      .catch(() => undefined);
  }, [companyId]);

  const enableAudio = useCallback(() => {
    preloadIndonesianVoice();
    unlockQueueAudio();
    audioEnabledRef.current = true;
    setAudioEnabled(true);
  }, []);

  const handleQueueCall = useCallback(
    (payload: {
      action: string;
      queue_number?: string;
      counter_number?: string | null;
      updated_at?: string;
    }) => {
      load();

      if (
        !audioEnabledRef.current ||
        payload.action !== "called" ||
        !payload.queue_number
      ) {
        return;
      }

      const announceKey = `${payload.queue_number}-${payload.updated_at ?? Date.now()}`;

      if (lastAnnouncedRef.current === announceKey) {
        return;
      }

      lastAnnouncedRef.current = announceKey;

      announceQueueCall({
        queueNumber: payload.queue_number,
        counterNumber: payload.counter_number,
      });
    },
    [load],
  );

  useEffect(() => {
    localStorage.setItem("queue_company_id", companyId.toString());
    load();
    const clockInterval = window.setInterval(() => setNow(new Date()), 1000);

    return () => {
      window.clearInterval(clockInterval);
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

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      preloadIndonesianVoice();
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  useCompanyQueueRealtime(companyId, handleQueueCall);

  return (
    <div className="relative flex h-dvh w-screen flex-col overflow-hidden bg-gradient-to-br from-indigo-100 via-sky-50 to-amber-50 p-3 sm:p-4">
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
      <header className="flex shrink-0 items-center justify-between rounded-2xl border border-white/60 bg-gradient-to-r from-primary-700 via-primary-600 to-sky-500 px-4 py-3 text-white shadow-lg shadow-primary-300/40 sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-xs font-bold uppercase tracking-wide text-white/90 sm:text-sm">
            <Sparkles className="size-3.5 shrink-0 text-amber-200 sm:size-4" />
            Bengkel Maju Jaya
          </p>
          <h1 className="truncate text-xl font-black sm:text-2xl lg:text-3xl">
            Display Antrean Servis
          </h1>
        </div>
        <div className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-right backdrop-blur-sm sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
            {dayjs(now).format("dddd, DD MMMM YYYY")}
          </p>
          <p className="font-mono text-sm font-bold tabular-nums sm:text-lg lg:text-2xl">
            {dayjs(now).format("HH:mm:ss")}{" "}
            <span className="text-xs font-bold text-amber-200 sm:text-sm">WIB</span>
          </p>
        </div>
      </header>

      <main className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3">
        <Card className="min-h-0 overflow-hidden border-0 bg-gradient-to-br from-white via-primary-50 to-sky-100 shadow-xl shadow-primary-200/50 lg:col-span-2">
          <CardBody className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden p-4 text-center sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-amber-200/30 blur-2xl" />

            <p className="relative mb-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-black uppercase tracking-wider text-primary sm:mb-4 sm:text-lg">
              Nomor Dipanggil
            </p>
            <div className="relative bg-gradient-to-b from-primary-600 to-sky-500 bg-clip-text font-black leading-none text-transparent [font-size:clamp(4rem,18vh,12rem)]">
              {current?.queue_number || "---"}
            </div>
            <p className="relative mt-3 line-clamp-2 max-w-full text-base font-bold text-primary-800 sm:mt-4 sm:text-xl lg:text-2xl">
              {current?.category?.name || "Belum ada antrean dipanggil"}
            </p>
            {current?.counter_number && (
              <Chip
                className="relative mt-3 border border-amber-300 bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2 text-base font-bold text-white sm:mt-4 sm:px-6 sm:py-3 sm:text-xl"
                size="lg"
              >
                Loket / Bay {current.counter_number}
              </Chip>
            )}
          </CardBody>
        </Card>

        <div className="grid min-h-0 grid-rows-3 gap-3 sm:gap-4">
          <Card className="min-h-0 overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-300/40">
            <CardBody className="flex h-full flex-row items-center gap-3 p-4 text-white sm:gap-4 sm:p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:size-12">
                <Users className="size-5 sm:size-7" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black sm:text-3xl lg:text-4xl">
                  {display?.total_waiting || 0}
                </p>
                <p className="text-[10px] font-bold uppercase text-white/80 sm:text-xs">
                  Total Menunggu
                </p>
              </div>
            </CardBody>
          </Card>

          <Card className="min-h-0 overflow-hidden border-0 bg-white/90 shadow-lg shadow-sky-200/60 backdrop-blur-sm">
            <CardBody className="flex h-full min-h-0 flex-col p-3 sm:p-4">
              <div className="mb-2 flex shrink-0 items-center gap-2 rounded-lg bg-sky-100 px-2.5 py-1.5 text-sky-800">
                <Clock className="size-4" />
                <h2 className="text-xs font-black uppercase sm:text-sm">
                  Antrean Berikutnya
                </h2>
              </div>
              <div className="flex min-h-0 flex-1 flex-col justify-center gap-1.5 overflow-hidden sm:gap-2">
                {(display?.waiting || []).slice(0, 5).map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex shrink-0 items-center justify-between rounded-lg border px-2.5 py-1.5 sm:px-3 sm:py-2 ${WAITING_ROW_STYLES[index % WAITING_ROW_STYLES.length]}`}
                  >
                    <span className="text-base font-black sm:text-lg lg:text-xl">
                      {item.queue_number}
                    </span>
                    <span className="ml-2 truncate text-right text-[10px] opacity-70 sm:text-xs">
                      {item.category?.name}
                    </span>
                  </div>
                ))}
                {(display?.waiting || []).length === 0 && (
                  <p className="text-xs text-slate-400 sm:text-sm">
                    Belum ada antrean menunggu.
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          <Card className="min-h-0 overflow-hidden border-0 bg-white/90 shadow-lg shadow-amber-200/60 backdrop-blur-sm">
            <CardBody className="flex h-full min-h-0 flex-col p-3 sm:p-4">
              <h2 className="mb-2 shrink-0 rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs font-black uppercase text-amber-800 sm:text-sm">
                Terakhir Dipanggil
              </h2>
              <div className="grid min-h-0 flex-1 grid-cols-2 content-center gap-2">
                {history.slice(0, 4).map((item, index) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border px-2 py-1.5 text-center sm:px-3 sm:py-2 ${HISTORY_TILE_STYLES[index % HISTORY_TILE_STYLES.length]}`}
                  >
                    <p className="text-base font-black sm:text-lg lg:text-xl">
                      {item.queue_number}
                    </p>
                    <p className="text-[9px] opacity-70 sm:text-[10px]">
                      Loket {item.counter_number || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
