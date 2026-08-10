import type { ILoginLogItem, ILogsQuery } from "@/utils/interfaces/ILogs";
import type { IPagination } from "@/utils/interfaces/IPagination";

import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";

import { LogsTableSkeleton } from "../components/logs-table-skeleton";
import LogsFiltersBar from "../components/logs-filters-bar";

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

function StatusChip({ status }: { status: ILoginLogItem["status"] }) {
  const { t } = useTranslation();

  const color =
    status === "active"
      ? "success"
      : status === "revoked"
        ? "danger"
        : "warning";

  return (
    <Chip color={color} size="sm" variant="flat">
      {t(`logs.login.status.${status}`)}
    </Chip>
  );
}

export default function LoginLogsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IPagination<ILoginLogItem> | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<ILogsQuery>({
    start_at: defaultStartAt,
    end_at: defaultEndAt,
    page: 1,
    pageSize: 10,
  });
  const hasFetched = useRef(false);

  const dateRangeValue = useMemo(
    () => ({
      start: query.start_at ? dayjs(query.start_at).toDate() : undefined,
      end: query.end_at ? dayjs(query.end_at).toDate() : undefined,
    }),
    [query.start_at, query.end_at],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
    }

    setLoading(true);
    http
      .get("/logs/login-sessions", {
        params: {
          start_at: query.start_at || undefined,
          end_at: query.end_at || undefined,
          search: query.search || undefined,
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

  return (
    <SuperAdminGuard>
      <HeaderAction
        leadIcon={LogIn}
        subtitle={t("logs.login.subtitle")}
        title={t("logs.login.title")}
      />

      <LogsFiltersBar
        dateRangeValue={dateRangeValue}
        search={search}
        searchPlaceholder={t("logs.login.search_placeholder")}
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
      />

      <Card className="mt-4 border border-default-100 shadow-sm">
        <Table
          aria-label={t("logs.login.title")}
          bottomContent={
            list?.meta ? (
              <div className="flex flex-col items-center justify-between gap-3 px-2 py-4 sm:flex-row">
                <PageSize
                  selectedKeys={[String(query.pageSize)]}
                  onSelectionChange={(keys) => {
                    const val = Number(Array.from(keys)[0]) || 10;

                    setQuery((prev) => ({ ...prev, pageSize: val, page: 1 }));
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
        >
          <TableHeader>
            <TableColumn>{t("logs.login.columns.user")}</TableColumn>
            <TableColumn>{t("logs.login.columns.device")}</TableColumn>
            <TableColumn>{t("logs.login.columns.platform")}</TableColumn>
            <TableColumn>{t("logs.login.columns.browser")}</TableColumn>
            <TableColumn>{t("logs.login.columns.ip")}</TableColumn>
            <TableColumn>{t("logs.login.columns.login_at")}</TableColumn>
            <TableColumn>{t("logs.login.columns.last_used")}</TableColumn>
            <TableColumn>{t("logs.login.columns.status")}</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={t("logs.login.empty")}
            isLoading={loading}
            loadingContent={<LogsTableSkeleton columns={8} />}
          >
            {(list?.data || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <User
                    description={row.user.email || "-"}
                    name={row.user.name || "-"}
                  />
                </TableCell>
                <TableCell>{row.device_label}</TableCell>
                <TableCell className="uppercase">{row.platform}</TableCell>
                <TableCell>{row.browser}</TableCell>
                <TableCell>{row.ip_address}</TableCell>
                <TableCell>{formatDateTime(row.created_at)}</TableCell>
                <TableCell>{formatDateTime(row.last_used_at)}</TableCell>
                <TableCell>
                  <StatusChip status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </SuperAdminGuard>
  );
}
