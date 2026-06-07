import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Chip } from "@heroui/react";
import { Clock, Users } from "lucide-react";

import type { IQueueDisplay } from "@/utils/interfaces/IQueue";

import { http } from "@/utils/libs/axios";
import { dateTimeFormat } from "@/utils/helpers/formater";

function getCompanyId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("company_id") || localStorage.getItem("queue_company_id") || 1);
}

export default function QueueDisplayPage() {
  const companyId = useMemo(() => getCompanyId(), []);
  const [display, setDisplay] = useState<IQueueDisplay | null>(null);
  const [now, setNow] = useState(new Date());

  const current = display?.calling?.[0];
  const history = display?.calling?.slice(1) || [];

  const load = () => {
    http
      .get("/queue/display", { params: { company_id: companyId } })
      .then(({ data }) => setDisplay(data))
      .catch(() => undefined);
  };

  useEffect(() => {
    localStorage.setItem("queue_company_id", companyId.toString());
    load();
    const displayInterval = window.setInterval(load, 3000);
    const clockInterval = window.setInterval(() => setNow(new Date()), 1000);

    return () => {
      window.clearInterval(displayInterval);
      window.clearInterval(clockInterval);
    };
  }, [companyId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-primary font-black uppercase tracking-widest">
              Bengkel Maju Jaya
            </p>
            <h1 className="text-4xl font-black">Display Antrean Servis</h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{dateTimeFormat(now.toISOString())}</p>
            <p className="text-sm text-white/50">Company ID: {companyId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white text-slate-900 min-h-[520px]">
            <CardBody className="p-10 flex flex-col items-center justify-center text-center">
              <p className="text-2xl uppercase font-black text-slate-400 mb-6">
                Nomor Dipanggil
              </p>
              <div className="text-[140px] md:text-[190px] leading-none font-black text-primary">
                {current?.queue_number || "---"}
              </div>
              <p className="text-3xl font-bold text-slate-700 mt-8">
                {current?.category?.name || "Belum ada antrean dipanggil"}
              </p>
              {current?.counter_number && (
                <Chip className="mt-6 text-2xl p-6" color="warning" size="lg">
                  Loket / Bay {current.counter_number}
                </Chip>
              )}
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white/10 border border-white/10 text-white shadow-none">
              <CardBody className="p-6 flex flex-row items-center gap-4">
                <div className="size-14 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-4xl font-black">{display?.total_waiting || 0}</p>
                  <p className="text-sm uppercase font-bold text-white/50">
                    Total Menunggu
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white/10 border border-white/10 text-white shadow-none">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} />
                  <h2 className="font-black uppercase">Antrean Berikutnya</h2>
                </div>
                <div className="space-y-3">
                  {(display?.waiting || []).slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/10"
                    >
                      <span className="text-2xl font-black">{item.queue_number}</span>
                      <span className="text-xs text-white/60 text-right">
                        {item.category?.name}
                      </span>
                    </div>
                  ))}
                  {(display?.waiting || []).length === 0 && (
                    <p className="text-white/50 text-sm">Belum ada antrean menunggu.</p>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white/10 border border-white/10 text-white shadow-none">
              <CardBody className="p-6">
                <h2 className="font-black uppercase mb-4">Terakhir Dipanggil</h2>
                <div className="grid grid-cols-2 gap-3">
                  {history.slice(0, 4).map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-white/10 text-center">
                      <p className="text-2xl font-black">{item.queue_number}</p>
                      <p className="text-[10px] text-white/50">
                        Loket {item.counter_number || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
