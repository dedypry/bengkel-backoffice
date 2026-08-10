import type { LucideIcon } from "lucide-react";

import {
  ClipboardList,
  FileText,
  PlusCircle,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader } from "@heroui/react";

type QuickAction = {
  label: string;
  icon: LucideIcon;
  card: string;
  iconWrap: string;
  to: string;
};

export function QuickActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions: QuickAction[] = useMemo(
    () => [
      {
        label: t("dashboard.quick_actions.new_work_order"),
        icon: PlusCircle,
        card: "bg-sky-50/80 border-sky-100 hover:bg-sky-50",
        iconWrap: "bg-sky-100 text-sky-600",
        to: "/service/add",
      },
      {
        label: t("dashboard.quick_actions.add_customer"),
        icon: UserPlus,
        card: "bg-violet-50/80 border-violet-100 hover:bg-violet-50",
        iconWrap: "bg-violet-100 text-violet-600",
        to: "/master/customers/create",
      },
      {
        label: t("dashboard.quick_actions.cashier"),
        icon: FileText,
        card: "bg-emerald-50/80 border-emerald-100 hover:bg-emerald-50",
        iconWrap: "bg-emerald-100 text-emerald-600",
        to: "/cashier",
      },
      {
        label: t("dashboard.quick_actions.daily_report"),
        icon: ClipboardList,
        card: "bg-amber-50/80 border-amber-100 hover:bg-amber-50",
        iconWrap: "bg-amber-100 text-amber-600",
        to: "/reports/revenue",
      },
    ],
    [t],
  );

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex items-center gap-2 px-5 pb-0 pt-5">
        <Sparkles className="size-4 text-primary-500" />
        <h3 className="font-bold text-slate-700">
          {t("dashboard.quick_actions.title")}
        </h3>
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-3 p-5">
        {actions.map((action) => (
          <button
            key={action.to}
            className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm ${action.card}`}
            type="button"
            onClick={() => navigate(action.to)}
          >
            <div
              className={`mb-3 flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${action.iconWrap}`}
            >
              <action.icon size={20} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {action.label}
            </span>
          </button>
        ))}
      </CardBody>
    </Card>
  );
}
