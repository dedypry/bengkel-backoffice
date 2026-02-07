import { useEffect, useRef, useState } from "react";
import { ListOrdered, Plus } from "lucide-react";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import AddMechanich from "../components/add-mekanik";

import ListTable from "./components/list-table";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";
import HeaderAction from "@/components/header-action";

export default function QueuePage() {
  const [openModal, setOpenModal] = useState(false);
  const [woId, setWoId] = useState(0);
  const { orders, woQuery } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

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
        actionTitle="Pendaftaran Service"
        leadIcon={ListOrdered}
        subtitle="Monitoring pengerjaan unit secara real-time dan manajemen slot teknisi."
        title="Antrian Unit"
        onAction={() => navigate("/service/add")}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Antrean",
            count: orders?.stats?.total || 0,
            color: "text-blue-600",
            barColor: "bg-blue-600",
          },
          {
            label: "Menunggu",
            count: orders?.stats?.waiting || 0,
            color: "text-amber-600",
            barColor: "bg-amber-600",
          },
          {
            label: "Dikerjakan",
            count: orders?.stats?.processing || 0,
            color: "text-indigo-600",
            barColor: "bg-indigo-600",
          },
          {
            label: "Selesai",
            count: orders?.stats?.completed || 0,
            color: "text-emerald-600",
            barColor: "bg-emerald-600",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="shadow-sm border border-default-100 overflow-hidden"
          >
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
