import {
  Wrench,
  Star,
  Zap,
  ChevronRight,
  Award,
  Clock,
  Target,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Progress,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
} from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getMechanic } from "@/stores/features/mechanic/mechanic-action";
import {
  calculatePerformance,
  getInitials,
  getJoinDuration,
} from "@/utils/helpers/global";
import { formatNumber } from "@/utils/helpers/format";

const statusColors = {
  ready: "success",
  busy: "danger",
  break: "warning",
  leave: "default",
} as const;

export default function ReportMechanic() {
  const { company } = useAppSelector((state) => state.auth);
  const { mechanics, mechanicQuery } = useAppSelector(
    (state) => state.mechanic,
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const bestMechanic = mechanics?.[0] || null;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getMechanic(mechanicQuery));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, mechanicQuery]);

  return (
    <div className="space-y-8">
      {/* Hero Section: Best Mechanic */}
      <Card
        className="bg-primary border-none overflow-hidden relative"
        shadow="none"
      >
        <CardBody className="z-10 p-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar
                isBordered
                className="w-28 h-28 text-large"
                color="warning"
                radius="lg"
                src={bestMechanic?.profile?.photo_url}
              />
              <Chip
                className="absolute -top-3 -right-3 font-black italic uppercase text-[10px]"
                color="default"
                size="sm"
                variant="shadow"
              >
                MVP
              </Chip>
            </div>

            <div className="text-center md:text-left">
              <p className="text-white font-black uppercase text-lg mb-2">
                🏆 Mekanik Terbaik Bulan Ini
              </p>
              <h1 className="text-2xl font-black text-white uppercase mb-2">
                {bestMechanic?.name || "No Data"}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Award className="text-gray-200" size={18} />
                  <span className="text-gray-200 font-bold uppercase">
                    Skor:{" "}
                    {calculatePerformance(
                      bestMechanic?.rating,
                      bestMechanic?.total_work,
                    )}
                    /100
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-sm border border-white/20 w-28 text-center">
              <Target className="mx-auto mb-2 text-white" size={20} />
              <p className="text-2xl font-black text-white">
                {formatNumber(bestMechanic?.total_work || 0)}
              </p>
              <p className="text-[10px] text-gray-200 font-bold uppercase">
                Unit
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-sm border border-white/20 w-28 text-center">
              <Star className="mx-auto mb-2 text-warning" size={20} />
              <p className="text-2xl font-black text-white">
                {formatNumber(bestMechanic?.rating || 0)}
              </p>
              <p className="text-[10px] text-gray-200 font-bold uppercase">
                Rating
              </p>
            </div>
          </div>
        </CardBody>
        {/* Background Decoration */}
        <Wrench className="absolute -right-10 -bottom-10 size-64 text-white/5 -rotate-12" />
      </Card>

      {/* Quick Stats Chips */}
      <div className="flex flex-wrap justify-center gap-3">
        <Chip
          className="bg-gray-100 font-bold uppercase text-tiny"
          variant="flat"
        >
          TOTAL: {mechanics.length}
        </Chip>
        <Chip
          className="font-bold uppercase text-tiny"
          color="success"
          variant="flat"
        >
          READY: {mechanics.filter((e) => e.work_status === "ready").length}
        </Chip>
        <Chip
          className="font-bold uppercase text-tiny"
          color="danger"
          variant="flat"
        >
          BUSY: {mechanics.filter((e) => e.work_status === "busy").length}
        </Chip>
        <Chip
          className="font-bold uppercase text-tiny"
          color="warning"
          variant="flat"
        >
          BREAK: {mechanics.filter((e) => e.work_status === "break").length}
        </Chip>
      </div>

      {/* Mechanic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((mec) => (
          <Card
            key={mec.id}
            className="border border-gray-100 hover:border-primary transition-all group"
          >
            <CardHeader className="flex justify-between items-start p-5 pb-0">
              <div className="flex gap-2 items-center bg-gray-50 px-3 py-1 rounded-full">
                <Star className="fill-warning text-warning" size={14} />
                <span className="font-black text-gray-700 text-xs">
                  {mec.rating}
                </span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-400 font-bold text-[10px]">5.0</span>
              </div>
              <Chip
                color={
                  statusColors[mec.work_status as keyof typeof statusColors]
                }
                size="sm"
                variant="dot"
              >
                {t(`mechanic.status.${mec.work_status}`)}
              </Chip>
            </CardHeader>

            <CardBody className="p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar
                  isBordered
                  className="w-24 h-24 mb-4 transition-all duration-500"
                  name={getInitials(mec.name)}
                  radius="lg"
                  src={mec.profile?.photo_url}
                />
                <h3 className="text-lg font-black uppercase text-gray-500">
                  {mec.name}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  ID: MEC-{mec.id.toString().padStart(3, "0")}
                </span>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center">
                  <Award className="text-gray-400 mb-1" size={16} />
                  <p className="text-[9px] font-black text-gray-400 uppercase">
                    Skill Level
                  </p>
                  <p className="text-xs font-black text-gray-700">
                    {mec.level || "PRO"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center">
                  <Clock className="text-gray-400 mb-1" size={16} />
                  <p className="text-[9px] font-black text-gray-400 uppercase">
                    Masa Kerja
                  </p>
                  <p className="text-xs font-black text-gray-700">
                    {getJoinDuration(
                      mec?.profile?.join_date || new Date().toISOString(),
                    )}
                  </p>
                </div>
              </div>

              {/* Specialty & Progress */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Wrench className="text-gray-600" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                      Spesialisasi
                    </p>
                    <p className="text-xs font-bold text-gray-700 leading-none">
                      {mec.specialty}
                    </p>
                  </div>
                </div>

                <Divider className="opacity-50" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="text-warning fill-warning" size={14} />
                      <span className="text-[10px] font-black text-gray-500 uppercase italic">
                        Power Index
                      </span>
                    </div>
                    <span className="text-xs font-black text-gray-800">
                      {calculatePerformance(mec?.rating, mec?.total_work)}%
                    </span>
                  </div>
                  <Progress
                    className="max-w-full"
                    color={
                      calculatePerformance(mec?.rating, mec?.total_work) > 80
                        ? "success"
                        : "warning"
                    }
                    size="sm"
                    value={calculatePerformance(mec?.rating, mec?.total_work)}
                  />
                </div>
              </div>

              <Button
                fullWidth
                className="mt-6 font-black uppercase"
                color="primary"
                endContent={<ChevronRight size={18} />}
                onPress={() => navigate(`/hr/employees/${mec.id}`)}
              >
                Detail Profil
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
