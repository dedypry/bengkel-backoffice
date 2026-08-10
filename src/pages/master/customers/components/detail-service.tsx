import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Table,
  Button,
  Tooltip,
  Input,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Eye, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ServiceHistoryEmptyState from "./service-history-empty";
import { renderServiceHistorySkeletonRows } from "./service-history-skeleton";

import { getWo } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import debounce from "@/utils/helpers/debounce";
import { CustomPagination } from "@/components/custom-pagination";
import CustomDateRangePicker from "@/components/forms/date-range-picker";

interface Props {
  id: number | string;
}
export default function DetailServiceTab({ id }: Props) {
  const { t } = useTranslation();
  const { woQuery, orders, isLoadingOrder } = useAppSelector(
    (state) => state.wo,
  );
  const [loading, setLoading] = useState<number[]>([]);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const query = useMemo(
    () => ({
      ...woQuery,
      isHistory: 1,
      noAuth: 1,
      customerId: id,
      date: "",
      date_from: dateFrom,
      date_to: dateTo,
    }),
    [woQuery, id, dateFrom, dateTo],
  );

  useEffect(() => {
    setDateFrom("");
    setDateTo("");
    dispatch(setWoQuery({ date_from: "", date_to: "", page: 1, q: "" }));
  }, [id, dispatch]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getWo(query));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [query, dispatch]);

  const searcDebounce = debounce(
    (q) => dispatch(setWoQuery({ q, page: 1 })),
    1000,
  );

  function handleLoading(id: number, isLoad: boolean) {
    if (isLoad) {
      setLoading((val) => [...val, id]);
    } else {
      setLoading((val) => val.filter((e) => e != id));
    }
  }

  function handleExportPdf() {
    const params = new URLSearchParams();

    if (woQuery.q) params.set("q", woQuery.q);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);

    const queryString = params.toString();

    void handleDownload(
      `/customers/${id}/service-history/export/pdf${queryString ? `?${queryString}` : ""}`,
      `riwayat-servis-${id}`,
      false,
      setExportingPdf,
    );
  }

  const hasServiceItems =
    !isLoadingOrder && (orders?.meta?.total ?? orders?.data?.length ?? 0) > 0;

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          isClearable
          className="flex-1"
          defaultValue={woQuery.q}
          placeholder={t("master.customers.service_search")}
          startContent={<Search className="size-4 text-default-400" />}
          variant="bordered"
          onValueChange={searcDebounce}
        />
        <CustomDateRangePicker
          className="w-full md:w-[280px] shrink-0"
          placeholder={t("master.customers.service_date_all")}
          value={{
            start: dateFrom ? dayjs(dateFrom).toDate() : undefined,
            end: dateTo ? dayjs(dateTo).toDate() : undefined,
          }}
          onChange={(val) => {
            setDateFrom(val?.start || "");
            setDateTo(val?.end || "");
            dispatch(setWoQuery({ page: 1 }));
          }}
        />
        {hasServiceItems ? (
          <Button
            className="w-full shrink-0 bg-rose-50 font-bold text-rose-700 md:w-auto"
            isLoading={exportingPdf}
            startContent={!exportingPdf ? <FileText size={16} /> : undefined}
            variant="flat"
            onPress={handleExportPdf}
          >
            {t("master.customers.service_export_pdf")}
          </Button>
        ) : null}
      </CardHeader>
      <CardBody className="gap-4">
        <Table removeWrapper aria-label="History Table" shadow="none">
          <TableHeader>
            <TableColumn>
              {t("master.customers.service_table.date_id")}
            </TableColumn>
            <TableColumn>
              {t("master.customers.service_table.vehicle")}
            </TableColumn>
            <TableColumn>
              {t("master.customers.service_table.service")}
            </TableColumn>
            <TableColumn align="end">
              {t("master.customers.service_table.total")}
            </TableColumn>
            <TableColumn align="center">
              {t("master.customers.service_table.status")}
            </TableColumn>
            <TableColumn align="center">
              {t("master.customers.service_table.actions")}
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              !isLoadingOrder ? <ServiceHistoryEmptyState /> : undefined
            }
          >
            {isLoadingOrder
              ? renderServiceHistorySkeletonRows()
              : (orders?.data || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-default-700">
                          {dayjs(item.created_at).format("DD MMM YYYY")}
                        </span>
                        <span className="text-tiny text-gray-400 font-mono tracking-tighter">
                          {item.trx_no}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-default-800 uppercase tracking-wide">
                          {item.vehicle.plate_number}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase">
                          {item.vehicle.brand} {item.vehicle.model} •{" "}
                          {item.customer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-small text-default-700 font-medium">
                          {item.services.map((e) => e.data.name).join(", ")}
                        </span>
                        <Chip
                          className="h-5 text-[10px] font-bold uppercase"
                          color="primary"
                          size="sm"
                          variant="flat"
                        >
                          {t("master.customers.mechanic_label", {
                            names: item.mechanics
                              ?.map((e) => e.name)
                              .join(", "),
                          })}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-default-900">
                        {formatIDR(item.grand_total)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        className="font-bold"
                        color={item.status === "closed" ? "success" : "danger"}
                        variant="dot"
                      >
                        {item.status === "closed"
                          ? t("master.customers.status_success")
                          : t("master.customers.status_cancelled")}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Tooltip content={t("master.customers.view_detail")}>
                          <Button
                            isIconOnly
                            as={Link}
                            color="primary"
                            size="sm"
                            to={`/service/queue/${item.id}`}
                            variant="light"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content={t("master.customers.invoice_file")}>
                          <Button
                            isIconOnly
                            color="default"
                            isLoading={loading.includes(item.id)}
                            size="sm"
                            variant="light"
                            onPress={() =>
                              handleDownload(
                                `/invoices/${item.id}`,
                                item.trx_no,
                                false,
                                (val) => handleLoading(item.id, val),
                              )
                            }
                          >
                            <FileText className="size-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <CustomPagination
          meta={orders?.meta!}
          onPageChange={(page) => dispatch(setWoQuery({ page }))}
        />
      </CardBody>
    </Card>
  );
}
