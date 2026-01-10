import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input, Option, Select } from "@mui/joy";

import AddMechanich from "../components/add-mekanik";

import ListTable from "./components/list-table";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";
import debounce from "@/utils/helpers/debounce";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";

export default function AntreanBengkel() {
  const [openModal, setOpenModal] = useState(false);
  const [woId, setWoId] = useState(0);
  const { orders, woQuery } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getWo(woQuery));
    }
  }, [company, woQuery]);

  const debounceSearch = debounce((q) => dispatch(getWo({ q })), 500);

  return (
    <div className="space-y-6 pb-10">
      <AddMechanich id={woId} open={openModal} setOpen={setOpenModal} />
      {/* Top Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <Input
          fullWidth
          placeholder="Cari No. Polisi atau Nama..."
          startDecorator={<Search />}
          onChange={(e) => debounceSearch(e.target.value)}
        />

        <div className="w-64">
          <Select
            value={woQuery.status}
            onChange={(_, tab) => {
              dispatch(setWoQuery({ status: tab }));
            }}
          >
            {["all", "queue", "on_progress", "ready", "finish"].map((e) => (
              <Option key={e} value={e}>
                {t(e)}
              </Option>
            ))}
          </Select>
          {/* <Combobox
            items={["all", "queue", "on_progress", "ready", "finish"].map(
              (e) => ({ label: t(e), value: e }),
            )}
            value={woQuery.status}
            onChange={(tab) => {
              dispatch(getWo({ status: tab }));
            }}
          /> */}
          {/* <Button className="gap-2" size="sm" variant="outline">
            <Filter className="size-4" /> Filter
          </Button> */}
          {/* <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" /> */}
          {/* <div className="flex p-1 bg-slate-100 rounded-lg">
            {["all", "queue", "on_progress", "ready", "finish"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  dispatch(getWo({ status: tab }));
                }}
              >
                {t(tab)}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Antrean",
            count: orders?.stats?.total,
            color: "text-blue-600",
          },
          {
            label: "Menunggu",
            count: orders?.stats?.waiting,
            color: "text-amber-600",
          },
          {
            label: "Dikerjakan",
            count: orders?.stats?.processing,
            color: "text-indigo-600",
          },
          {
            label: "Selesai",
            count: orders?.stats?.completed,
            color: "text-emerald-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border shadow-sm border-b-4 border-b-slate-100"
          >
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {stat.label}
            </p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      <ListTable setOpenModal={setOpenModal} setWoId={setWoId} />
    </div>
  );
}
