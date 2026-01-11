import type { ReactNode } from "react";

import { CheckCircle2, Clock, Flag, Play } from "lucide-react";

export interface IChild {
  children?: ReactNode;
}

export interface IQuery {
  pageSize?: number;
  page?: number;
  q?: string;
}

export const PROGRESS_CONFIG = {
  queue: {
    label: "Antre",
    color: "text-orange-500",
    icon: Clock,
  },
  on_progress: {
    label: "Sedang Dikerjakan",
    color: "text-indigo-600",
    icon: Play,
  },
  ready: {
    label: "Siap Diambil",
    color: "text-primary",
    icon: CheckCircle2,
  },
  finish: {
    label: "Selesai",
    color: "text-green-600",
    icon: Flag,
  },
};

export const MECHANIC_STATUS_CONFIG = {
  ready: {
    label: "Tersedia",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  busy: {
    label: "Sibuk",
    bg: "bg-rose-100",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  break: {
    label: "Istirahat",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  leave: {
    label: "Cuti",
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
  },
};
