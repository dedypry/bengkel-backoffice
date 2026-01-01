import {
  Wrench,
  Star,
  Phone,
  Zap,
  ChevronRight,
  Activity,
  Award,
  Clock,
  Search,
  Filter,
  Target,
} from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getMechanic } from "@/stores/features/mechanic/mechanic-action";
import { getInitials } from "@/utils/helpers/global";
import { Card, CardContent } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

const statusStyles = {
  ready: "bg-emerald-500 text-white shadow-emerald-200",
  busy: "bg-rose-500 text-white shadow-rose-200",
  break: "bg-amber-500 text-white shadow-amber-200",
  leave: "bg-slate-400 text-white shadow-slate-200",
};

export default function MasterMekanikPencarian() {
  const { company } = useAppSelector((state) => state.auth);
  const { mechanics } = useAppSelector((state) => state.mechanic);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getMechanic());
  }, [company]);

  return (
    <div className="space-y-8 pb-20 px-4">
      {/* Header Eksklusif */}
      <div className="relative overflow-hidden rounded-md bg-primary p-10 text-white shadow-2xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <Badge className="bg-amber-500 text-slate-900 font-black mb-4 px-4 py-1 rounded-full">
              🏆 MEKANIK TERBAIK BULAN INI
            </Badge>
            <div className="flex items-center gap-6">
              <Avatar className="size-24 border border-white shadow-white]">
                <AvatarImage src={mechanics?.[0]?.profile?.photo_url} />
              </Avatar>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">
                  {mechanics?.[0]?.name}
                </h1>
                <p className="text-white font-bold uppercase text-sm tracking-widest flex items-center gap-2 mt-1">
                  <Award className="size-4" /> Skor Performa: 9/100
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Unit Selesai",
                val: "347",
                icon: Target,
                color: "text-blue-400",
              },
              {
                label: "Avg Rating",
                val: "4.8",
                icon: Star,
                color: "text-amber-400",
              },
              {
                label: "Efisiensi",
                val: "89%",
                icon: Zap,
                color: "text-emerald-400",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/40 text-center"
              >
                <s.icon className={`size-5 mx-auto mb-2 ${s.color}`} />
                <p className="text-2xl font-semibold leading-none">{s.val}</p>
                <p className="text-[10px] text-white mt-1 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Center: Pencarian & Filter */}
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-primary" />
              <Input
                className="w-full h-14 pl-14 pr-6 rounded-md border-none bg-indigo-50/50 focus-visible:ring-2 focus-visible:ring-primary font-bold text-slate-700 placeholder:text-primary/60 transition-all"
                placeholder="Cari mekanik (nama, spesialisasi, atau ID)..."
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="h-14 px-6 rounded-2xl border-indigo-100 bg-white text-primary font-bold hover:bg-indigo-50 gap-2"
                variant="outline"
              >
                <Filter className="size-5" />
                Filter Status
              </Button>
              <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 cursor-pointer hover:bg-primary transition-all">
                <Activity className="size-6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistik Cepat */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {[
          `Total: ${mechanics.length}`,
          `Tersedia: ${mechanics.filter((e) => e.work_status === "ready").length}`,
          `Sibuk:  ${mechanics.filter((e) => e.work_status === "busy").length}`,
          `Istirahat: ${mechanics.filter((e) => e.work_status === "break").length}`,
        ].map((stat, i) => (
          <Badge
            key={i}
            className="px-6 py-2 rounded-md font-black text-xs bg-white border border-slate-100 text-slate-600 shadow-sm"
            variant="secondary"
          >
            {stat}
          </Badge>
        ))}
      </div>

      {/* Grid Kartu Mekanik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {mechanics.map((mec) => (
          <Card
            key={mec.id}
            className="group relative bg-white  shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden"
          >
            <CardContent>
              {/* Status Badge */}
              <div className="absolute top-4 right-4 left-4 z-20">
                <div className="flex gap-3 justify-between items-center">
                  <div className="flex items-center gap-2 mt-2 bg-slate-50 px-4 py-1 rounded-lg border border-primary">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-black text-slate-700 text-sm">
                      {mec.rating}
                    </span>
                    <span className="text-primary font-light">|</span>
                    <span className="text-[14px] font-semibold text-slate-400 uppercase tracking-widest">
                      11
                    </span>
                  </div>
                  <Badge
                    className={`px-5 py-2 rounded-md  text-[10px] uppercase tracking-widest border-none shadow-xl ${statusStyles[mec.work_status as keyof typeof statusStyles]}`}
                  >
                    {t(`mechanic.status.${mec.work_status}`)}
                  </Badge>
                </div>
              </div>
              <div className="pt-12">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative mb-4">
                    <div
                      className={`absolute inset-0 rounded-lg blur-2xl opacity-10 group-hover:opacity-30 transition-opacity bg-indigo-600`}
                    />
                    <Avatar className="size-28 rounded-lg border-8 border-white shadow-2xl relative z-10 transition-transform group-hover:scale-110 duration-500">
                      <AvatarImage src={mec.profile?.photo_url} />
                      <AvatarFallback className="font-semibold text-2xl">
                        {getInitials(mec.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    {mec.name}
                  </h3>
                </div>

                <Item variant="outline">
                  <ItemMedia>
                    <div className="p-3 bg-white/80 backdrop-blur-md rounded-md shadow-sm">
                      <Wrench className="size-5" />
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Keahlian Utama</ItemTitle>
                    <ItemDescription>{mec.specialty}</ItemDescription>
                  </ItemContent>
                </Item>

                {/* Experience & Level */}
                <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                  <div className="flex flex-col items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <Award className="size-4 text-indigo-500 mb-1" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      Level
                    </span>
                    <span className="text-xs font-black text-slate-700">
                      {mec.level} 1
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <Clock className="size-4 text-indigo-500 mb-1" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      Kerja
                    </span>
                    <span className="text-xs font-black text-slate-700">
                      {mec.experience} 12 tahun
                    </span>
                  </div>
                </div>

                {/* Efficiency Progress */}
                <div className="space-y-4 bg-indigo-50/30 p-3 rounded-md border border-indigo-100">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Zap className="size-4 fill-current text-primary" />{" "}
                      Efisiensi
                    </span>
                    <span className="text-sm font-black text-primary">
                      {mec.efficiency || 60}%
                    </span>
                  </div>
                  <Progress
                    className="h-3 rounded-full bg-white border border-indigo-100"
                    value={mec.efficiency || 60}
                  />
                </div>
              </div>
              <Separator className="my-5" />
              <div className="flex items-center gap-2">
                <Button variant="ghost">
                  <Phone className="size-6" />
                </Button>
                <Button className="flex-1 group">
                  <span className="flex-1">PROFIL </span>
                  <ChevronRight className="ml-2 size-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
