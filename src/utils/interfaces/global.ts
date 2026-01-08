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
    color: "text-green-600",
    icon: CheckCircle2,
  },
  finish: {
    label: "Selesai",
    color: "text-gray-600",
    icon: Flag,
  },
};
