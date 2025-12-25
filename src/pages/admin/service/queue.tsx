import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Play,
  CheckCircle2,
  MoreVertical,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialQueues = [
  {
    id: "A-124",
    customer: "Budi Santoso",
    car: "Toyota Avanza",
    plate: "B 1234 GHO",
    status: "Waiting",
    time: "08:30",
    service: "Ganti Oli",
  },
  {
    id: "A-125",
    customer: "Lani Wijaya",
    car: "Honda HR-V",
    plate: "D 9999 RS",
    status: "In Progress",
    time: "09:15",
    service: "Tune Up",
    mechanic: "Agus",
  },
  {
    id: "A-126",
    customer: "Rian",
    car: "Mitsubishi Xpander",
    plate: "F 4567 JK",
    status: "Ready",
    time: "07:45",
    service: "Servis Rutin",
  },
];

export default function AntreanBengkel() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input className="pl-10" placeholder="Cari No. Polisi atau Nama..." />
        </div>

        <div className="flex items-center gap-2">
          <Button className="gap-2" size="sm" variant="outline">
            <Filter className="size-4" /> Filter
          </Button>
          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />
          <div className="flex p-1 bg-slate-100 rounded-lg">
            {["all", "waiting", "progress", "ready"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Antrean", count: 12, color: "text-blue-600" },
          { label: "Menunggu", count: 5, color: "text-amber-600" },
          { label: "Dikerjakan", count: 4, color: "text-indigo-600" },
          { label: "Selesai", count: 3, color: "text-emerald-600" },
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

      {/* Main Table / List */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Estimasi/Antrean
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Pelanggan & Unit
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Layanan
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Status
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialQueues.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 size-10 rounded-lg flex flex-col items-center justify-center border">
                      <span className="text-[10px] font-bold text-slate-500 leading-none mb-1">
                        {item.time}
                      </span>
                      <span className="text-xs font-black text-primary leading-none">
                        {item.id.split("-")[1]}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-bold text-slate-800">{item.plate}</p>
                    <p className="text-xs text-slate-500">
                      {item.customer} • {item.car}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      className="font-medium bg-slate-50"
                      variant="outline"
                    >
                      {item.service}
                    </Badge>
                    {item.mechanic && (
                      <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                        <Timer className="size-3" /> {item.mechanic}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {item.status === "Waiting" && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Clock className="size-4" />
                      <span className="text-xs font-bold italic">Antre</span>
                    </div>
                  )}
                  {item.status === "In Progress" && (
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Play className="size-4 animate-pulse fill-current" />
                      <span className="text-xs font-bold italic">
                        Sedang Dikerjakan
                      </span>
                    </div>
                  )}
                  {item.status === "Ready" && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="size-4" />
                      <span className="text-xs font-bold italic">
                        Siap Diambil
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {item.status === "Waiting" && (
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-[10px] h-8 font-bold"
                        size="sm"
                      >
                        MULAI KERJA
                      </Button>
                    )}
                    {item.status === "In Progress" && (
                      <Button
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-[10px] h-8 font-bold"
                        size="sm"
                        variant="outline"
                      >
                        SELESAIKAN
                      </Button>
                    )}
                    {item.status === "Ready" && (
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-[10px] h-8 font-bold"
                        size="sm"
                      >
                        KASIR / PULANG
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="size-8" size="icon" variant="ghost">
                          <MoreVertical className="size-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Detail Order</DropdownMenuItem>
                        <DropdownMenuItem>Ganti Mekanik</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Batalkan Antrean
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
