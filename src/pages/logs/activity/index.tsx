import type {
  IActivityLogFilterOptions,
  IActivityLogItem,
  ILogsQuery,
} from "@/utils/interfaces/ILogs";
import type { IPagination } from "@/utils/interfaces/IPagination";

import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Activity, FileJson } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@heroui/react";

import ActivityBodyModal from "../components/activity-body-modal";
import ActivityLogsFiltersBar from "../components/activity-logs-filters-bar";
import { LogsTableSkeleton } from "../components/logs-table-skeleton";

import HeaderAction from "@/components/header-action";
import { CustomPagination } from "@/components/custom-pagination";
import PageSize from "@/components/page-size";
import SuperAdminGuard from "@/utils/guard/super-admin-guard";
import debounce from "@/utils/helpers/debounce";
import { notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

const defaultEndAt = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
const defaultStartAt = dayjs()
  .subtract(7, "day")
  .startOf("day")
  .format("YYYY-MM-DD HH:mm:ss");

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  return dayjs(value).format("DD MMM YYYY HH:mm");
}

export default function ActivityLogsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IPagination<IActivityLogItem> | null>(null);
  const [search, setSearch] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IActivityLogItem | null>(
    null,
  );
  const [query, setQuery] = useState<ILogsQuery>({
    start_at: defaultStartAt,
    end_at: defaultEndAt,
    page: 1,
    pageSize: 10,
  });
  const [filterOptions, setFilterOptions] = useState<IActivityLogFilterOptions>(
    {
      actions: [],
      urls: [],
      statuses: [],
    },
  );
  const hasFetched = useRef(false);

  const dateRangeValue = useMemo(
    () => ({
      start: query.start_at ? dayjs(query.start_at).toDate() : undefined,
      end: query.end_at ? dayjs(query.end_at).toDate() : undefined,
    }),
    [query.start_at, query.end_at],
  );

  useEffect(() => {
    http
      .get<IActivityLogFilterOptions>("/logs/activities/options")
      .then(({ data }) => setFilterOptions(data))
      .catch((err) => notifyError(err));
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
    }

    setLoading(true);
    http
      .get("/logs/activities", {
        params: {
          start_at: query.start_at || undefined,
          end_at: query.end_at || undefined,
          search: query.search || undefined,
          action: query.action || undefined,
          url: query.url || undefined,
          status: query.status || undefined,
          page: query.page,
          pageSize: query.pageSize,
        },
      })
      .then(({ data }) => setList(data))
      .catch((err) => notifyError(err))
      .finally(() => {
        setLoading(false);
        hasFetched.current = false;
      });
  }, [query]);

  const searchDebounce = debounce((value: string) => {
    setQuery((prev) => ({ ...prev, search: value, page: 1 }));
  }, 500);

  const openDetail = (item: IActivityLogItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  return (
    <SuperAdminGuard>
      <div className="text-secondary-600">
        <div className="[&_h1]:text-secondary-600 [&_p]:text-secondary-500">
          <HeaderAction
            leadIcon={Activity}
            subtitle={t("logs.activity.subtitle")}
            title={t("logs.activity.title")}
          />
        </div>

        <ActivityLogsFiltersBar
          action={query.action || ""}
          dateRangeValue={dateRangeValue}
          options={filterOptions}
          search={search}
          status={query.status || ""}
          url={query.url || ""}
          onActionChange={(value) =>
            setQuery((prev) => ({ ...prev, action: value, page: 1 }))
          }
          onDateChange={(range) => {
            setQuery((prev) => ({
              ...prev,
              start_at: range.start ?? "",
              end_at: range.end ?? "",
              page: 1,
            }));
          }}
          onSearchChange={(value) => {
            setSearch(value);
            searchDebounce(value);
          }}
          onStatusChange={(value) =>
            setQuery((prev) => ({
              ...prev,
              status: value as ILogsQuery["status"],
              page: 1,
            }))
          }
          onUrlChange={(value) =>
            setQuery((prev) => ({ ...prev, url: value, page: 1 }))
          }
        />

        <Card className="mt-4 border border-secondary-100 shadow-sm">
          <Table
            aria-label={t("logs.activity.title")}
            bottomContent={
              list?.meta ? (
                <div className="flex flex-col items-center justify-between gap-3 px-2 py-4 sm:flex-row text-secondary-600">
                  <PageSize
                    selectedKeys={[String(query.pageSize)]}
                    onSelectionChange={(keys) => {
                      const val = Number(Array.from(keys)[0]) || 10;

                      setQuery((prev) => ({
                        ...prev,
                        pageSize: val,
                        page: 1,
                      }));
                    }}
                  />
                  <CustomPagination
                    meta={list.meta}
                    onPageChange={(page) =>
                      setQuery((prev) => ({ ...prev, page }))
                    }
                  />
                </div>
              ) : null
            }
            classNames={{
              emptyWrapper: "text-secondary-500",
            }}
          >
            <TableHeader>
              <TableColumn>{t("logs.activity.columns.user")}</TableColumn>
              <TableColumn>{t("logs.activity.columns.action")}</TableColumn>
              <TableColumn>{t("logs.activity.columns.url")}</TableColumn>
              <TableColumn>{t("logs.activity.columns.session")}</TableColumn>
              <TableColumn>{t("logs.activity.columns.status")}</TableColumn>
              <TableColumn>{t("logs.activity.columns.body")}</TableColumn>
              <TableColumn>{t("logs.activity.columns.created_at")}</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={t("logs.activity.empty")}
              isLoading={loading}
              loadingContent={<LogsTableSkeleton columns={7} />}
            >
              {(list?.data || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <User
                      classNames={{
                        name: "text-secondary-700",
                        description: "text-secondary-500",
                      }}
                      description={row.user.email || "-"}
                      name={row.user.name || "-"}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-secondary-700">
                      {row.action || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-secondary-600">
                      {row.url || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.session ? (
                      <div className="text-xs text-secondary-600">
                        <p className="font-medium text-secondary-700">
                          {row.session.device_label}
                        </p>
                        <p className="text-secondary-500">
                          {row.session.browser} · {row.session.ip_address}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-secondary-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.status ? (
                      <Chip
                        color={row.status === "success" ? "success" : "danger"}
                        size="sm"
                        variant="flat"
                      >
                        {t(`logs.activity.status.${row.status}`)}
                      </Chip>
                    ) : (
                      <span className="text-xs text-secondary-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.body == null && row.response_message == null ? (
                      <span className="text-xs text-secondary-400">-</span>
                    ) : (
                      <Tooltip content={t("logs.activity.view_detail")}>
                        <Button
                          isIconOnly
                          aria-label={t("logs.activity.view_detail")}
                          color="primary"
                          size="sm"
                          variant="flat"
                          onPress={() => openDetail(row)}
                        >
                          <FileJson size={16} />
                        </Button>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-secondary-600">
                      {formatDateTime(row.created_at)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <ActivityBodyModal
        item={selectedItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </SuperAdminGuard>
  );
}
