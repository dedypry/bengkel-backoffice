import { Box, Download, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GridLoader } from "react-spinners";
import dayjs from "dayjs";

import { ModalPoDetail } from "./modal-detail";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchPo, fetchPoDetail } from "@/stores/features/po/po-action";
import {
  capitalizeStatus,
  formatDate,
  formatIDR,
} from "@/utils/helpers/format";
import TableAction from "@/components/table-action";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { CustomPagination } from "@/components/custom-pagination";
import { setPoQuery } from "@/stores/features/po/po-slice";
import PageSize from "@/components/page-size";
import debounce from "@/utils/helpers/debounce";
import { handleDownload } from "@/utils/helpers/global";
import DateRangePicker from "@/components/forms/date-range-picker";

export function PoPage() {
  const { t } = useTranslation();
  const { list, loading, poQuery } = useAppSelector((state) => state.po);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const hasFetch = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;
      dispatch(fetchPo(poQuery));

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, [poQuery, dispatch]);

  const selectedIds = useMemo(() => {
    if (selectedKeys === "all") {
      return (list?.data || []).map((item) => item.id);
    }

    return Array.from(selectedKeys).map(Number);
  }, [selectedKeys, list?.data]);

  const hasSelection = selectedKeys === "all" || selectedKeys.size > 0;

  const handleDetail = (id: number) => {
    dispatch(fetchPoDetail(id));
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    http
      .delete(`po/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(fetchPo(poQuery));
      })
      .catch(notifyError);
  };

  const handleBulkDownload = () => {
    if (!selectedIds.length) {
      return;
    }

    setBulkDownloading(true);
    http
      .post(
        "/po/invoice/download/bulk",
        { ids: selectedIds },
        { responseType: "blob" },
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `po-invoices-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(notifyError)
      .finally(() => setBulkDownloading(false));
  };

  const searchDebounce = debounce((q) => dispatch(setPoQuery({ q })), 500);

  const dateRangeValue = useMemo(
    () => ({
      start: poQuery.date_from ? dayjs(poQuery.date_from).toDate() : undefined,
      end: poQuery.date_to ? dayjs(poQuery.date_to).toDate() : undefined,
    }),
    [poQuery.date_from, poQuery.date_to],
  );

  return (
    <>
      <ModalPoDetail open={open} onOpen={setOpen} />
      <HeaderAction
        actionIcon={Plus}
        actionTitle={t("purchase.po.add")}
        leadIcon={Box}
        subtitle={t("purchase.po.subtitle")}
        title={t("purchase.po.title")}
        onAction={() => navigate("create")}
      />

      <Table
        bottomContent={
          <CustomPagination
            meta={list?.meta!}
            onPageChange={(page) => dispatch(setPoQuery({ page }))}
          />
        }
        className="mt-5"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        topContent={
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <PageSize
                  selectedKeys={[poQuery.pageSize.toString()]}
                  onSelectionChange={(key) => {
                    const val = Array.from(key)[0].toString();

                    dispatch(setPoQuery({ pageSize: val }));
                  }}
                />
                {hasSelection ? (
                  <Button
                    color="success"
                    isLoading={bulkDownloading}
                    size="sm"
                    startContent={<Download size={16} />}
                    variant="flat"
                    onPress={handleBulkDownload}
                  >
                    {t("purchase.po.bulk_download_invoice", {
                      count: selectedIds.length,
                    })}
                  </Button>
                ) : null}
              </div>
              <Input
                className="w-full sm:max-w-xs"
                endContent={
                  search ? (
                    <X
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        setSearch("");
                        dispatch(setPoQuery({ q: "" }));
                      }}
                    />
                  ) : null
                }
                placeholder={t("purchase.po.search_placeholder")}
                startContent={<Search size={18} />}
                value={search}
                onValueChange={(val) => {
                  setSearch(val);
                  searchDebounce(val);
                }}
              />
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <Autocomplete
                aria-label={t("purchase.po.filter_supplier")}
                className="w-full lg:max-w-xs"
                classNames={{
                  clearButton: "text-gray-500",
                }}
                defaultItems={list?.stats?.suppliers ?? []}
                placeholder={t("purchase.po.filter_supplier")}
                selectedKey={(poQuery.supplier_id || "").toString()}
                onClear={() => dispatch(setPoQuery({ supplier_id: undefined }))}
                onSelectionChange={(val) => {
                  if (val) {
                    dispatch(
                      setPoQuery({
                        supplier_id: val ? Number(val) : undefined,
                      }),
                    );
                  }
                }}
              >
                {(item: { id: number; name: string }) => (
                  <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                )}
              </Autocomplete>
              <DateRangePicker
                aria-label={t("purchase.po.filter_date")}
                className="w-full lg:max-w-sm"
                placeholder={t("purchase.po.filter_date")}
                value={dateRangeValue}
                onChange={(val) =>
                  dispatch(
                    setPoQuery({
                      date_from: val?.start,
                      date_to: val?.end,
                    }),
                  )
                }
              />
            </div>
          </div>
        }
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <TableColumn>{t("purchase.po.table.po_no")}</TableColumn>
          <TableColumn>{t("purchase.po.table.date")}</TableColumn>
          <TableColumn>{t("purchase.po.table.supplier")}</TableColumn>
          <TableColumn>{t("purchase.po.table.status")}</TableColumn>
          <TableColumn>{t("purchase.po.table.total")}</TableColumn>
          <TableColumn>{t("purchase.po.table.requested_date")}</TableColumn>
          <TableColumn>{t("purchase.po.table.notes")}</TableColumn>
          <TableColumn>{t("purchase.po.table.actions")}</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={t("purchase.shared.empty_data")}
          isLoading={loading}
          loadingContent={<GridLoader color="#0096FF" />}
        >
          {(list?.data || [])?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleDetail(item.id)}
                >
                  {item.po_no}
                </Button>
              </TableCell>
              <TableCell>{formatDate(item.date)}</TableCell>
              <TableCell>{item.supplier?.name}</TableCell>
              <TableCell>{capitalizeStatus(item.status)}</TableCell>
              <TableCell>{formatIDR(item.total)}</TableCell>
              <TableCell>{formatDate(item.requested_date)}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Tooltip content={t("purchase.shared.download_invoice")}>
                    <Button
                      isIconOnly
                      color="success"
                      isLoading={downloadingId === item.id}
                      size="sm"
                      variant="light"
                      onPress={() =>
                        handleDownload(
                          `/po/invoice/download/${item.id}`,
                          item.po_no,
                          true,
                          (isLoading) =>
                            setDownloadingId(isLoading ? item.id : null),
                        )
                      }
                    >
                      <Download className="size-4" />
                    </Button>
                  </Tooltip>
                  <TableAction
                    onDelete={() => handleDelete(item.id)}
                    onDetail={() => handleDetail(item.id)}
                    onEdit={() => navigate(`${item.id}`)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
