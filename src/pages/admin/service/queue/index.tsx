import { useEffect, useState } from "react";
import {
  Search,
  MoreVertical,
  Timer,
  Trash2,
  UserCircleIcon,
  EyeIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import AddMechanich from "../components/add-mekanik";

import ButtonStatus from "./components/button-status";
import StatusQueue from "./components/status-queue";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatarByName } from "@/utils/helpers/global";
import { CustomPagination } from "@/components/custom-pagination";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import debounce from "@/utils/helpers/debounce";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import Combobox from "@/components/ui/combobox";

export default function AntreanBengkel() {
  const [activeTab, setActiveTab] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [woId, setWoId] = useState(0);
  const { orders, woQuery } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      dispatch(getWo(woQuery));
    }
  }, [company]);

  const debounceSearch = debounce((q) => dispatch(getWo({ q })), 500);

  return (
    <div className="space-y-6 pb-10">
      <AddMechanich id={woId} open={openModal} setOpen={setOpenModal} />
      {/* Top Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Cari No. Polisi atau Nama..."
            onChange={(e) => debounceSearch(e.target.value)}
          />
        </div>

        <div className="w-50">
          <Combobox
            items={["all", "queue", "on_progress", "ready", "finish"].map(
              (e) => ({ label: t(e), value: e }),
            )}
            value={woQuery.status}
            onChange={(tab) => {
              dispatch(getWo({ status: tab }));
            }}
          />
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

      <Card className="px-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estimasi/Antrean</TableHead>
              <TableHead>Pelanggan & Unit</TableHead>
              <TableHead>Layanan</TableHead>
              <TableHead>dikerjakan Oleh</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 size-10 rounded-lg flex flex-col items-center justify-center border px-8">
                      <span className="text-[10px] font-bold text-slate-500 leading-none mb-1">
                        {item.estimation}
                      </span>
                      <span className="text-xs font-black text-primary leading-none">
                        {item.trx_no || item.queue_no}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-bold text-slate-800">
                      {item.vehicle.plate_number}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.customer.name} • {item.vehicle.brand}{" "}
                      {item.vehicle.model}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    {item?.services?.map((srv, j) => (
                      <Badge
                        key={j}
                        className="font-medium bg-slate-50"
                        variant="outline"
                      >
                        {srv.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {item.mechanics?.length! > 0
                    ? item.mechanics?.map((mc) => (
                        <div key={mc.id} className="flex gap-2">
                          <Avatar>
                            <AvatarImage
                              src={
                                mc.profile?.photo_url ||
                                getAvatarByName(mc.name)
                              }
                            />
                          </Avatar>
                          <Badge className="mt-2">
                            <Timer className="size-3" /> {mc.name}
                          </Badge>
                        </div>
                      ))
                    : "-"}
                </TableCell>
                <TableCell>
                  <StatusQueue wo={item} />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <ButtonStatus
                      item={item}
                      onSuccess={() => dispatch(getWo(woQuery))}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="size-8" size="icon" variant="ghost">
                          <MoreVertical className="size-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/service/queue/${item.id}`)}
                        >
                          <EyeIcon /> Detail Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            dispatch(
                              setMechanic(
                                item.mechanics?.map((item) => item.id),
                              ),
                            );
                            setOpenModal(true);
                            setWoId(item.id);
                          }}
                        >
                          <UserCircleIcon /> Pilih Mekanik
                        </DropdownMenuItem>
                        {item.progress === "queue" && (
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="text-red-600" />
                            Batalkan Antrean
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            <CustomPagination
              meta={orders?.meta!}
              onPageChange={(page) => dispatch(setWoQuery({ page }))}
            />
          </TableCaption>
        </Table>
      </Card>
    </div>
  );
}
