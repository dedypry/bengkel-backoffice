import type {
  IQueueCategory,
  IQueueDisplay,
  IQueueGenerateResponse,
} from "@/utils/interfaces/IQueue";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import {
  Car,
  Gauge,
  Printer,
  RefreshCcw,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";

import config from "@/config/api";
import { useCompanyQueueRealtime } from "@/hooks/use-company-queue-realtime";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

const icons = [Car, Wrench, Gauge];

function getCompanyId() {
  const params = new URLSearchParams(window.location.search);

  return Number(
    params.get("company_id") || localStorage.getItem("queue_company_id") || 1,
  );
}

export default function QueueKioskPage() {
  const companyId = useMemo(() => getCompanyId(), []);
  const [categories, setCategories] = useState<IQueueCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [generatingCategoryId, setGeneratingCategoryId] = useState<
    number | null
  >(null);
  const [display, setDisplay] = useState<IQueueDisplay | null>(null);
  const [ticket, setTicket] = useState<IQueueGenerateResponse | null>(null);

  const loadCategories = useCallback(() => {
    setCategoriesLoading(true);
    http
      .get("/queue/categories", { params: { company_id: companyId } })
      .then(({ data }) => setCategories(data || []))
      .catch((err) => notifyError(err))
      .finally(() => setCategoriesLoading(false));
  }, [companyId]);

  const loadDisplay = useCallback(() => {
    http
      .get("/queue/display", { params: { company_id: companyId } })
      .then(({ data }) => setDisplay(data))
      .catch(() => undefined);
  }, [companyId]);

  useEffect(() => {
    localStorage.setItem("queue_company_id", companyId.toString());
    loadCategories();
    loadDisplay();
  }, [companyId, loadCategories, loadDisplay]);

  useCompanyQueueRealtime(companyId, () => {
    loadDisplay();
  });

  const generate = (category: IQueueCategory) => {
    setGeneratingCategoryId(category.id);
    http
      .post("/queue/generate", {
        category_id: category.id,
        company_id: companyId,
      })
      .then(({ data }) => {
        const result = data.data as IQueueGenerateResponse;

        setTicket(result);
        notify(`Nomor antrean ${result.queue.queue_number} berhasil dibuat`);
      })
      .catch((err) => notifyError(err))
      .finally(() => setGeneratingCategoryId(null));
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 print:bg-white">
      <div className="mx-auto max-w-5xl space-y-6 print:hidden">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-primary">
              Kiosk Antrean Mandiri
            </p>
            <h1 className="text-3xl font-black text-slate-800 md:text-4xl">
              Pilih Jenis Servis
            </h1>
            <p className="mt-2 text-slate-500">
              Ambil nomor antrean, cetak tiket, lalu tunggu nomor Anda
              dipanggil.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip
                color="primary"
                startContent={<Users size={14} />}
                variant="flat"
              >
                {display?.total_waiting ?? 0} antrean menunggu
              </Chip>
              <p className="text-xs text-slate-400">
                Backend: {config.api} · Company ID: {companyId}
              </p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<RefreshCcw size={18} />}
            variant="flat"
            onPress={() => {
              loadCategories();
              loadDisplay();
            }}
          >
            Refresh
          </Button>
        </div>

        {categoriesLoading && categories.length === 0 ? (
          <div className="flex justify-center py-20">
            <Spinner color="primary" size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {categories
              .filter((category) => category.is_active)
              .map((category, index) => {
                const Icon = icons[index % icons.length];
                const isGenerating = generatingCategoryId === category.id;

                return (
                  <Card
                    key={category.id}
                    className="border border-slate-200 shadow-sm"
                  >
                    <CardBody className="flex min-h-[240px] flex-col justify-between p-8">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
                          <p className="mt-2 text-slate-500">
                            Estimasi {category.estimated_minutes} menit.
                          </p>
                        </div>
                      </div>
                      <Button
                        fullWidth
                        color="primary"
                        isLoading={isGenerating}
                        size="lg"
                        startContent={!isGenerating && <Ticket size={20} />}
                        onPress={() => generate(category)}
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
            <CardBody className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
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
        <pre className="hidden whitespace-pre-wrap font-mono text-[12px] text-black print:block">
          {ticket.ticket_text}
        </pre>
      )}
    </div>
  );
}
