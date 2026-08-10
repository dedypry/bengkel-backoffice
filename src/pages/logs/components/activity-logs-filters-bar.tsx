import type { DateRangeValue } from "./types";
import type {
  AuditLogStatus,
  IActivityLogFilterOptions,
} from "@/utils/interfaces/ILogs";

import { useMemo } from "react";
import { CircleCheck, Link2, Search, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Input,
} from "@heroui/react";

import CustomDateRangePicker from "@/components/forms/date-range-picker";

type Props = {
  dateRangeValue: DateRangeValue;
  search: string;
  action: string;
  url: string;
  status: string;
  options: IActivityLogFilterOptions;
  onDateChange: (range: { start?: string; end?: string }) => void;
  onSearchChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

const fieldClassNames = {
  label: "text-xs font-bold uppercase text-secondary-500",
  input: "text-sm text-secondary-700",
  inputWrapper: "min-h-11 h-11",
};

export default function ActivityLogsFiltersBar({
  dateRangeValue,
  search,
  action,
  url,
  status,
  options,
  onDateChange,
  onSearchChange,
  onActionChange,
  onUrlChange,
  onStatusChange,
}: Props) {
  const { t } = useTranslation();

  const actionItems = useMemo(
    () => options.actions.map((value) => ({ key: value, label: value })),
    [options.actions],
  );

  const urlItems = useMemo(
    () => options.urls.map((value) => ({ key: value, label: value })),
    [options.urls],
  );

  const statusItems = useMemo(
    () =>
      options.statuses.map((value) => ({
        key: value,
        label: t(`logs.activity.status.${value as AuditLogStatus}`),
      })),
    [options.statuses, t],
  );

  return (
    <Card className="mt-4 border border-secondary-100 shadow-sm text-secondary-600">
      <CardBody className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
        <CustomDateRangePicker
          showTime
          className="w-full min-w-0 md:col-span-2 xl:col-span-2"
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
        <Autocomplete
          isClearable
          aria-label={t("logs.filter.action")}
          className="w-full min-w-0"
          defaultItems={actionItems}
          inputProps={{ classNames: fieldClassNames }}
          label={t("logs.filter.action")}
          labelPlacement="outside"
          placeholder={t("logs.filter.action_placeholder")}
          selectedKey={action || null}
          size="md"
          startContent={
            <Zap className="shrink-0 text-secondary-400" size={18} />
          }
          onClear={() => onActionChange("")}
          onSelectionChange={(key) => onActionChange(key ? String(key) : "")}
        >
          {(item) => (
            <AutocompleteItem key={item.key} textValue={item.label}>
              <span className="font-mono text-xs">{item.label}</span>
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          isClearable
          aria-label={t("logs.filter.url")}
          className="w-full min-w-0"
          defaultItems={urlItems}
          inputProps={{ classNames: fieldClassNames }}
          label={t("logs.filter.url")}
          labelPlacement="outside"
          placeholder={t("logs.filter.url_placeholder")}
          selectedKey={url || null}
          size="md"
          startContent={
            <Link2 className="shrink-0 text-secondary-400" size={18} />
          }
          onClear={() => onUrlChange("")}
          onSelectionChange={(key) => onUrlChange(key ? String(key) : "")}
        >
          {(item) => (
            <AutocompleteItem key={item.key} textValue={item.label}>
              <span className="truncate text-xs">{item.label}</span>
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          isClearable
          aria-label={t("logs.filter.status")}
          className="w-full min-w-0"
          defaultItems={statusItems}
          inputProps={{ classNames: fieldClassNames }}
          label={t("logs.filter.status")}
          labelPlacement="outside"
          placeholder={t("logs.filter.status_placeholder")}
          selectedKey={status || null}
          size="md"
          startContent={
            <CircleCheck className="shrink-0 text-secondary-400" size={18} />
          }
          onClear={() => onStatusChange("")}
          onSelectionChange={(key) => onStatusChange(key ? String(key) : "")}
        >
          {(item) => (
            <AutocompleteItem key={item.key} textValue={item.label}>
              {item.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Input
          className="w-full min-w-0 md:col-span-2 xl:col-span-5"
          classNames={fieldClassNames}
          label={t("logs.filter.search")}
          labelPlacement="outside"
          placeholder={t("logs.activity.search_placeholder")}
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
