import type { IUser } from "@/utils/interfaces/IUser";

import {
  Wrench,
  Star,
  Zap,
  ChevronRight,
  Award,
  Clock,
  Target,
  LayoutGrid,
  List,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
} from "@heroui/react";

import MechanicReviewsModal from "./components/mechanic-reviews-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getMechanic } from "@/stores/features/mechanic/mechanic-action";
import {
  calculatePerformance,
  getAvatarByName,
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

type ViewMode = "grid" | "table";

function RatingBadge({
  rating,
  onPress,
}: {
  rating: number | string | undefined;
  onPress: () => void;
}) {
  return (
    <button
      className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 transition-colors hover:bg-amber-50"
      type="button"
      onClick={onPress}
    >
      <Star className="fill-warning text-warning" size={14} />
      <span className="text-xs font-black text-gray-700">
        {formatNumber(rating || 0)}
      </span>
      <span className="text-gray-300">/</span>
      <span className="text-[10px] font-bold text-gray-400">5.0</span>
    </button>
  );
}

function MechanicGridCard({
  mec,
  onOpenProfile,
  onOpenReviews,
}: {
  mec: IUser;
  onOpenProfile: (id: number) => void;
  onOpenReviews: (mec: IUser) => void;
}) {
  const { t } = useTranslation();
  const performance = calculatePerformance(mec?.rating, mec?.total_work);

  return (
    <Card className="group border border-gray-100 transition-all hover:border-primary">
      <CardHeader className="flex items-start justify-between p-5 pb-0">
        <RatingBadge rating={mec.rating} onPress={() => onOpenReviews(mec)} />
        <Chip
          color={statusColors[mec.work_status as keyof typeof statusColors]}
          size="sm"
          variant="dot"
        >
          {t(`mechanic.status.${mec.work_status}`)}
        </Chip>
      </CardHeader>

      <CardBody className="p-6">
        <div className="mb-6 flex flex-col items-center">
          <Avatar
            isBordered
            className="mb-4 h-24 w-24 transition-all duration-500"
            name={getInitials(mec.name)}
            radius="lg"
            src={mec.profile?.photo_url}
          />
          <h3 className="text-lg font-black uppercase text-gray-500">
            {mec.name}
          </h3>
          <span className="text-[10px] font-bold uppercase text-gray-400">
            {t("reports.mechanics.id_prefix")}
            {mec.id.toString().padStart(3, "0")}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-3">
            <Award className="mb-1 text-gray-400" size={16} />
            <p className="text-[9px] font-black uppercase text-gray-400">
              {t("reports.mechanics.skill_level")}
            </p>
            <p className="text-xs font-black text-gray-700">
              {mec.level || t("reports.mechanics.pro")}
            </p>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-3">
            <Clock className="mb-1 text-gray-400" size={16} />
            <p className="text-[9px] font-black uppercase text-gray-400">
              {t("reports.mechanics.tenure")}
            </p>
            <p className="text-xs font-black text-gray-700">
              {getJoinDuration(
                mec?.profile?.join_date || new Date().toISOString(),
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <Wrench className="text-gray-600" size={16} />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-black uppercase leading-none text-gray-400">
                {t("reports.mechanics.specialization")}
              </p>
              <p className="text-xs font-bold leading-none text-gray-700">
                {mec.specialty}
              </p>
            </div>
          </div>

          <Divider className="opacity-50" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="fill-warning text-warning" size={14} />
                <span className="text-[10px] font-black uppercase italic text-gray-500">
                  {t("reports.mechanics.power_index")}
                </span>
              </div>
              <span className="text-xs font-black text-gray-800">
                {performance}%
              </span>
            </div>
            <Progress
              className="max-w-full"
              color={performance > 80 ? "success" : "warning"}
              size="sm"
              value={performance}
            />
          </div>
        </div>

        <Button
          fullWidth
          className="mt-6 font-black uppercase"
          color="primary"
          endContent={<ChevronRight size={18} />}
          onPress={() => onOpenProfile(mec.id)}
        >
          {t("reports.mechanics.view_profile")}
        </Button>
      </CardBody>
    </Card>
  );
}

function MechanicTableView({
  mechanics,
  onOpenProfile,
  onOpenReviews,
}: {
  mechanics: IUser[];
  onOpenProfile: (id: number) => void;
  onOpenReviews: (mec: IUser) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden border border-gray-100">
      <Table
        removeWrapper
        aria-label={t("reports.mechanics.table_aria")}
        classNames={{
          th: "bg-gray-50 text-gray-600 font-bold text-xs uppercase",
          td: "py-4",
        }}
      >
        <TableHeader>
          <TableColumn>{t("reports.mechanics.table.mechanic")}</TableColumn>
          <TableColumn>{t("reports.mechanics.rating")}</TableColumn>
          <TableColumn>{t("reports.mechanics.table.status")}</TableColumn>
          <TableColumn>{t("reports.mechanics.unit")}</TableColumn>
          <TableColumn>{t("reports.mechanics.skill_level")}</TableColumn>
          <TableColumn>{t("reports.mechanics.tenure")}</TableColumn>
          <TableColumn>{t("reports.mechanics.specialization")}</TableColumn>
          <TableColumn>{t("reports.mechanics.power_index")}</TableColumn>
          <TableColumn align="center">{t("common.actions")}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("reports.mechanics.no_data")}>
          {mechanics.map((mec) => {
            const performance = calculatePerformance(
              mec?.rating,
              mec?.total_work,
            );

            return (
              <TableRow key={mec.id} className="border-b border-gray-100">
                <TableCell>
                  <User
                    avatarProps={{
                      radius: "lg",
                      size: "sm",
                      src: mec.profile?.photo_url || getAvatarByName(mec.name),
                    }}
                    classNames={{
                      name: "text-sm font-bold text-gray-800",
                      description: "text-[10px] text-gray-400",
                    }}
                    description={`${t("reports.mechanics.id_prefix")}${mec.id.toString().padStart(3, "0")}`}
                    name={mec.name}
                  />
                </TableCell>
                <TableCell>
                  <RatingBadge
                    rating={mec.rating}
                    onPress={() => onOpenReviews(mec)}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    color={
                      statusColors[mec.work_status as keyof typeof statusColors]
                    }
                    size="sm"
                    variant="dot"
                  >
                    {t(`mechanic.status.${mec.work_status}`)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-gray-700">
                    {formatNumber(mec.total_work || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-gray-700">
                    {mec.level || t("reports.mechanics.pro")}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {getJoinDuration(
                      mec?.profile?.join_date || new Date().toISOString(),
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{mec.specialty}</span>
                </TableCell>
                <TableCell>
                  <div className="min-w-[120px] space-y-1">
                    <span className="text-xs font-bold text-gray-700">
                      {performance}%
                    </span>
                    <Progress
                      color={performance > 80 ? "success" : "warning"}
                      size="sm"
                      value={performance}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    size="sm"
                    variant="flat"
                    onPress={() => onOpenProfile(mec.id)}
                  >
                    {t("common.detail")}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

export default function ReportMechanic() {
  const { company } = useAppSelector((state) => state.auth);
  const { mechanics, mechanicQuery } = useAppSelector(
    (state) => state.mechanic,
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    mechanicId: number | null;
    mechanicName?: string;
  }>({ open: false, mechanicId: null });

  const bestMechanic = mechanics?.[0] || null;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getMechanic(mechanicQuery));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, mechanicQuery, dispatch]);

  const openProfile = (id: number) => navigate(`/hr/employees/${id}`);

  const openReviews = (mec: IUser) =>
    setReviewModal({
      open: true,
      mechanicId: mec.id,
      mechanicName: mec.name,
    });

  return (
    <div className="space-y-8">
      <Card
        className="relative overflow-hidden border-none bg-primary"
        shadow="none"
      >
        <CardBody className="z-10 flex flex-col items-center justify-between gap-8 p-10 md:flex-row">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative">
              <Avatar
                isBordered
                className="h-28 w-28 text-large"
                color="warning"
                radius="lg"
                src={bestMechanic?.profile?.photo_url}
              />
              <Chip
                className="absolute -right-3 -top-3 text-[10px] font-black uppercase italic"
                color="default"
                size="sm"
                variant="shadow"
              >
                {t("reports.mechanics.mvp")}
              </Chip>
            </div>

            <div className="text-center md:text-left">
              <p className="mb-2 text-lg font-black uppercase text-white">
                {t("reports.mechanics.best_month")}
              </p>
              <h1 className="mb-2 text-2xl font-black uppercase text-white">
                {bestMechanic?.name || t("reports.mechanics.no_data")}
              </h1>
              <div className="flex items-center justify-center gap-4 md:justify-start">
                <div className="flex items-center gap-2">
                  <Award className="text-gray-200" size={18} />
                  <span className="font-bold uppercase text-gray-200">
                    {t("reports.mechanics.score")}{" "}
                    {calculatePerformance(
                      bestMechanic?.rating,
                      bestMechanic?.total_work,
                    )}
                    {t("reports.mechanics.score_suffix")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-28 rounded-sm border border-white/20 bg-white/5 p-4 text-center backdrop-blur-md">
              <Target className="mx-auto mb-2 text-white" size={20} />
              <p className="text-2xl font-black text-white">
                {formatNumber(bestMechanic?.total_work || 0)}
              </p>
              <p className="text-[10px] font-bold uppercase text-gray-200">
                {t("reports.mechanics.unit")}
              </p>
            </div>
            <button
              className="w-28 rounded-sm border border-white/20 bg-white/5 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/10"
              type="button"
              onClick={() => bestMechanic && openReviews(bestMechanic)}
            >
              <Star className="mx-auto mb-2 text-warning" size={20} />
              <p className="text-2xl font-black text-white">
                {formatNumber(bestMechanic?.rating || 0)}
              </p>
              <p className="text-[10px] font-bold uppercase text-gray-200">
                {t("reports.mechanics.rating")}
              </p>
            </button>
          </div>
        </CardBody>
        <Wrench className="absolute -bottom-10 -right-10 size-64 -rotate-12 text-white/5" />
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Chip
          className="bg-gray-100 text-tiny font-bold uppercase"
          variant="flat"
        >
          {t("reports.mechanics.total_prefix")} {mechanics.length}
        </Chip>
        <Chip
          className="text-tiny font-bold uppercase"
          color="success"
          variant="flat"
        >
          {t("reports.mechanics.ready_prefix")}{" "}
          {mechanics.filter((e) => e.work_status === "ready").length}
        </Chip>
        <Chip
          className="text-tiny font-bold uppercase"
          color="danger"
          variant="flat"
        >
          {t("reports.mechanics.busy_prefix")}{" "}
          {mechanics.filter((e) => e.work_status === "busy").length}
        </Chip>
        <Chip
          className="text-tiny font-bold uppercase"
          color="warning"
          variant="flat"
        >
          {t("reports.mechanics.break_prefix")}{" "}
          {mechanics.filter((e) => e.work_status === "break").length}
        </Chip>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          isIconOnly
          aria-label={t("reports.mechanics.view_grid")}
          color={viewMode === "grid" ? "primary" : "default"}
          size="sm"
          variant={viewMode === "grid" ? "solid" : "flat"}
          onPress={() => setViewMode("grid")}
        >
          <LayoutGrid size={18} />
        </Button>
        <Button
          isIconOnly
          aria-label={t("reports.mechanics.view_table")}
          color={viewMode === "table" ? "primary" : "default"}
          size="sm"
          variant={viewMode === "table" ? "solid" : "flat"}
          onPress={() => setViewMode("table")}
        >
          <List size={18} />
        </Button>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mechanics.map((mec) => (
            <MechanicGridCard
              key={mec.id}
              mec={mec}
              onOpenProfile={openProfile}
              onOpenReviews={openReviews}
            />
          ))}
        </div>
      ) : (
        <MechanicTableView
          mechanics={mechanics}
          onOpenProfile={openProfile}
          onOpenReviews={openReviews}
        />
      )}

      <MechanicReviewsModal
        mechanicId={reviewModal.mechanicId}
        mechanicName={reviewModal.mechanicName}
        open={reviewModal.open}
        onClose={() =>
          setReviewModal({
            open: false,
            mechanicId: null,
            mechanicName: undefined,
          })
        }
      />
    </div>
  );
}
