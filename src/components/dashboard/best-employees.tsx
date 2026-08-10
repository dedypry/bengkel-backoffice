import { ArrowRight, Award, Star, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  ScrollShadow,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { formatNumber } from "@/utils/helpers/format";
import { getAvatarByName, getInitials } from "@/utils/helpers/global";

const rankStyles = [
  "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50",
  "border-slate-200 bg-white",
  "border-slate-200 bg-white",
  "border-slate-200 bg-white",
  "border-slate-200 bg-white",
] as const;

export function BestEmployees() {
  const { t } = useTranslation();
  const { dashboard } = useAppSelector((state) => state.dashboard);
  const navigate = useNavigate();
  const employees = dashboard?.bestEmployees || [];

  return (
    <Card className="overflow-hidden border border-amber-100 bg-amber-50/40 shadow-sm">
      <CardHeader className="flex items-center justify-between px-5 pb-2 pt-5">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <Trophy className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">
              {t("dashboard.best_employees.title")}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t("dashboard.best_employees.subtitle")}
            </p>
          </div>
        </div>
        <Chip color="warning" size="sm" variant="flat">
          {t("dashboard.best_employees.top_count", { count: employees.length })}
        </Chip>
      </CardHeader>

      <CardBody className="px-5 pb-5">
        <ScrollShadow className="max-h-[320px] space-y-2 rounded-2xl bg-white/70 p-2">
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Award size={32} />
              <p className="mt-2 text-center text-sm">
                {t("dashboard.best_employees.empty")}
              </p>
            </div>
          ) : (
            employees.map((employee, index) => (
              <div
                key={employee.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors hover:bg-amber-50/60 ${rankStyles[index] ?? rankStyles[1]}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      index === 0
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <Avatar
                    name={getInitials(employee.name)}
                    radius="full"
                    size="sm"
                    src={
                      employee.profile?.photo_url ||
                      getAvatarByName(employee.name)
                    }
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {employee.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t("dashboard.best_employees.reviews", {
                        count: employee.review_count,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/80 px-2.5 py-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-slate-700">
                    {formatNumber(employee.rating)}
                  </span>
                </div>
              </div>
            ))
          )}
        </ScrollShadow>

        <Button
          fullWidth
          className="mt-4 font-semibold"
          color="warning"
          endContent={<ArrowRight className="size-4" />}
          size="sm"
          variant="flat"
          onPress={() => navigate("/master/mechanics")}
        >
          {t("dashboard.best_employees.view_all")}
        </Button>
      </CardBody>
    </Card>
  );
}
