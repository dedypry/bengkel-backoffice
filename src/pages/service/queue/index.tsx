import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ListOrdered, Plus } from "lucide-react";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import AddMechanich from "../components/add-mekanik";

import ListTable from "./components/list-table";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";
import HeaderAction from "@/components/header-action";
import { useServiceQueueRealtime } from "@/hooks/use-service-queue-realtime";

export default function QueuePage() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [woId, setWoId] = useState(0);
  const { orders, woQuery } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const refreshQueue = useCallback(() => {
    dispatch(getWo(woQuery));
  }, [dispatch, woQuery]);

  useServiceQueueRealtime(company?.id, {
    onServiceUpdate: refreshQueue,
  });

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getWo(woQuery));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, woQuery]);

  return (
    <div className="space-y-6 pb-10">
      <AddMechanich id={woId} open={openModal} setOpen={setOpenModal} />
      <HeaderAction
        actionIcon={Plus}
        actionTitle={t("service.queue.register")}
        leadIcon={ListOrdered}
        subtitle={t("service.queue.subtitle")}
        title={t("service.queue.title")}
        onAction={() => navigate("/service/add")}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: t("service.queue.stats.total"),
            count: orders?.stats?.total || 0,
            color: "text-primary",
            barColor: "bg-primary",
          },
          {
            label: t("service.queue.stats.waiting_queue"),
            count: orders?.stats?.waiting_queue || 0,
            color: "text-orange-600",
            barColor: "bg-orange-500",
          },
          {
            label: t("service.queue.stats.waiting"),
            count: orders?.stats?.waiting || 0,
            color: "text-amber-600",
            barColor: "bg-amber-600",
          },
          {
            label: t("service.queue.stats.processing"),
            count: orders?.stats?.processing || 0,
            color: "text-indigo-600",
            barColor: "bg-indigo-600",
          },
          {
            label: t("service.queue.stats.ready"),
            count: orders?.stats?.ready || 0,
            color: "text-sky-600",
            barColor: "bg-sky-500",
          },
          {
            label: t("service.queue.stats.completed"),
            count: orders?.stats?.completed || 0,
            color: "text-emerald-600",
            barColor: "bg-emerald-600",
          },
        ].map((stat, i) => (
          <Card key={i}>
            <CardBody className="p-4 relative">
              {/* Indikator Warna di Samping */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${stat.barColor}`}
              />
              <p className="text-[12px] uppercase font-bold text-gray-500 tracking-wider">
                {stat.label}
              </p>
              <p className={`text-2xl font-black ${stat.color}`}>
                {stat.count}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <ListTable setOpenModal={setOpenModal} setWoId={setWoId} />
    </div>
  );
}
