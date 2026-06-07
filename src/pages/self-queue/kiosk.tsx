import type {
  IQueueCategory,
  IQueueGenerateResponse,
} from "@/utils/interfaces/IQueue";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import { Car, Gauge, Printer, RefreshCcw, Ticket, Wrench } from "lucide-react";

import config from "@/config/api";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

const icons = [Car, Wrench, Gauge];

function getCompanyId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("company_id") || localStorage.getItem("queue_company_id") || 1);
}

export default function QueueKioskPage() {
  const companyId = useMemo(() => getCompanyId(), []);
  const [categories, setCategories] = useState<IQueueCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<IQueueGenerateResponse | null>(null);

  const loadCategories = () => {
    setLoading(true);
    http
      .get("/queue/categories", { params: { company_id: companyId } })
      .then(({ data }) => setCategories(data || []))
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    localStorage.setItem("queue_company_id", companyId.toString());
    loadCategories();
  }, [companyId]);

  const generate = (category: IQueueCategory) => {
    setLoading(true);
    http
      .post("/queue/generate", {
        category_id: category.id,
        company_id: companyId,
      })
      .then(({ data }) => {
        setTicket(data.data);
        notify(`Nomor antrean ${data.data.queue.queue_number} berhasil dibuat`);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 print:bg-white">
      <div className="max-w-5xl mx-auto space-y-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div>
            <p className="text-sm font-bold uppercase text-primary">
              Kiosk Antrean Mandiri
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800">
              Pilih Jenis Servis
            </h1>
            <p className="text-slate-500 mt-2">
              Ambil nomor antrean, cetak tiket, lalu tunggu nomor Anda dipanggil.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Backend: {config.api} · Company ID: {companyId}
            </p>
          </div>
          <Button
            color="primary"
            startContent={<RefreshCcw size={18} />}
            variant="flat"
            onPress={loadCategories}
          >
            Refresh
          </Button>
        </div>

        {loading && categories.length === 0 ? (
          <div className="flex justify-center py-20">
            <Spinner color="primary" size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {categories
              .filter((category) => category.is_active)
              .map((category, index) => {
                const Icon = icons[index % icons.length];

                return (
                  <Card
                    key={category.id}
                    isPressable
                    className="border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
                    onPress={() => generate(category)}
                  >
                    <CardBody className="p-8 min-h-[240px] flex flex-col justify-between">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Icon size={34} />
                          </div>
                          <Chip color="primary" size="lg" variant="flat">
                            Kode {category.prefix_code}
                          </Chip>
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-800">
                            {category.name}
                          </h2>
                          <p className="text-slate-500 mt-2">
                            Estimasi {category.estimated_minutes} menit.
                          </p>
                        </div>
                      </div>
                      <Button
                        fullWidth
                        color="primary"
                        isLoading={loading}
                        size="lg"
                        startContent={!loading && <Ticket size={20} />}
                      >
                        Ambil Nomor
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
          </div>
        )}

        {ticket && (
          <Card className="border border-primary/20 shadow-sm">
            <CardBody className="p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-slate-400">
                  Nomor antrean Anda
                </p>
                <p className="text-5xl font-black text-primary">
                  {ticket.queue.queue_number}
                </p>
                <p className="text-slate-500">{ticket.category.name}</p>
              </div>
              <Button
                color="primary"
                size="lg"
                startContent={<Printer size={20} />}
                onPress={printTicket}
              >
                Cetak Tiket
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {ticket && (
        <pre className="hidden print:block text-black text-[12px] whitespace-pre-wrap font-mono">
          {ticket.ticket_text}
        </pre>
      )}
    </div>
  );
}
