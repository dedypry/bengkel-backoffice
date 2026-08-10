import type { DateRangeValue } from "./types";

import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Input } from "@heroui/react";

import CustomDateRangePicker from "@/components/forms/date-range-picker";

type Props = {
  dateRangeValue: DateRangeValue;
  search: string;
  searchPlaceholder: string;
  onDateChange: (range: { start?: string; end?: string }) => void;
  onSearchChange: (value: string) => void;
};

export default function LogsFiltersBar({
  dateRangeValue,
  search,
  searchPlaceholder,
  onDateChange,
  onSearchChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <Card className="mt-4 border border-secondary-100 shadow-sm text-secondary-600">
      <CardBody className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2 xl:grid-cols-[minmax(420px,1.5fr)_minmax(280px,1fr)] xl:items-end">
        <CustomDateRangePicker
          showTime
          className="w-full min-w-0"
          classNames={{
            label:
              "whitespace-nowrap text-xs font-bold uppercase text-secondary-500",
            input: "text-sm text-secondary-700",
            inputWrapper: "min-h-11 h-11",
          }}
          format="DD MMM YYYY"
          label={t("logs.filter.date_range")}
          labelPlacement="outside"
          placeholder={t("common.all_dates")}
          size="md"
          value={dateRangeValue}
          onChange={onDateChange}
        />
        <Input
          className="w-full min-w-0"
          classNames={{
            label: "text-xs font-bold uppercase text-secondary-500",
            input: "text-sm text-secondary-700",
            inputWrapper: "min-h-11 h-11",
          }}
          label={t("logs.filter.search")}
          labelPlacement="outside"
          placeholder={searchPlaceholder}
          size="md"
          startContent={
            <Search className="shrink-0 text-secondary-400" size={18} />
          }
          value={search}
          onValueChange={onSearchChange}
        />
      </CardBody>
    </Card>
  );
}
