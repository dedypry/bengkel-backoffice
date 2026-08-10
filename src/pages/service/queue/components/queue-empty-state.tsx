import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function QueueEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
        <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20">
          <ClipboardList className="size-10 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-black uppercase tracking-wide text-gray-500">
          {t("service.queue.empty")}
        </p>
        <p className="text-xs font-medium text-gray-400">
          {t("service.queue.empty_desc")}
        </p>
      </div>
    </div>
  );
}
