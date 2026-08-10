import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ListOrdered, Plus } from "lucide-react";
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
  const [startWorkOnSave, setStartWorkOnSave] = useState(false);
  const { woQuery } = useAppSelector((state) => state.wo);
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
      <AddMechanich
        id={woId}
        open={openModal}
        setOpen={setOpenModal}
        startWorkOnSave={startWorkOnSave}
        onRefresh={refreshQueue}
        onStartWorkModeReset={() => setStartWorkOnSave(false)}
      />
      <HeaderAction
        actionIcon={Plus}
        actionTitle={t("service.queue.register")}
        leadIcon={ListOrdered}
        subtitle={t("service.queue.subtitle")}
        title={t("service.queue.title")}
        onAction={() => navigate("/service/add")}
      />

      <ListTable
        setOpenModal={setOpenModal}
        setStartWorkOnSave={setStartWorkOnSave}
        setWoId={setWoId}
      />
    </div>
  );
}
