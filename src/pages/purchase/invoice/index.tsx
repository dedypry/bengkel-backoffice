import { Download, Plus, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { GridLoader } from "react-spinners";

import { ModalPoDetail } from "../po/modal-detail";

import HeaderAction from "@/components/header-action";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { fetchPo, fetchPoDetail } from "@/stores/features/po/po-action";
import {
  formatDate,
  capitalizeStatus,
  formatIDR,
} from "@/utils/helpers/format";
import TableAction from "@/components/table-action";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { CustomPagination } from "@/components/custom-pagination";
import { setPoQuery } from "@/stores/features/po/po-slice";
import debounce from "@/utils/helpers/debounce";
import { handleDownload } from "@/utils/helpers/global";
import DateRangePicker from "@/components/forms/date-range-picker";

export default function PoInvoicePage() {
  const { list, loading, poQuery } = useAppSelector((state) => state.po);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetch = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;
      dispatch(
        fetchPo({
          ...poQuery,
          status: "invoice",
        }),
      );

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, [poQuery]);

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

  const searchDebounce = debounce((q) => dispatch(setPoQuery({ q })), 500);

  return (
    <>
      <ModalPoDetail open={open} onOpen={setOpen} />
      <HeaderAction
        actionIcon={Plus}
        actionTitle="Tambah Faktur"
        subtitle="Daftar faktur pembelian"
        title="Faktur Pembelian"
        onAction={() => navigate("/purchase/invoice/create")}
      />
      <Table
        bottomContent={
          <CustomPagination
            meta={list?.meta!}
            showPageSize={true}
            onPageChange={(page) => dispatch(setPoQuery({ page }))}
            onPageSizeChange={(pageSize) => dispatch(setPoQuery({ pageSize }))}
          />
        }
        topContent={
          <div className="flex justify-between">
            {/* <PageSize
              selectedKeys={[poQuery.pageSize.toString()]}
              onSelectionChange={(key) => {
                const val = Array.from(key)[0].toString();

                dispatch(setPoQuery({ pageSize: val }));
              }}
            /> */}
            <Autocomplete
              className="w-xs"
              classNames={{
                clearButton: "text-gray-500",
              }}
              defaultItems={list?.stats?.suppliers ?? []}
              placeholder="Filter berdasarkan supplier"
              selectedKey={(poQuery.supplier_id || "").toString()}
              onClear={() => dispatch(setPoQuery({ supplier_id: undefined }))}
              onSelectionChange={(val) => {
                if (val) {
                  dispatch(
                    setPoQuery({ supplier_id: val ? Number(val) : undefined }),
                  );
                }
              }}
            >
              {(item: any) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <div className="flex gap-2">
              <DateRangePicker
                placeholder="Cari tanggal invoice"
                value={
                  {
                    start: poQuery.date_from,
                    end: poQuery.date_to,
                  } as any
                }
                onChange={(val: any) =>
                  dispatch(
                    setPoQuery({
                      date_from: val?.start,
                      date_to: val?.end,
                    }),
                  )
                }
              />
              <Input
                endContent={
                  search && (
                    <X
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        setSearch("");
                        dispatch(setPoQuery({ q: "" }));
                      }}
                    />
                  )
                }
                placeholder="Cari PO"
                startContent={<Search size={18} />}
                value={search}
                onValueChange={(val) => {
                  setSearch(val);
                  searchDebounce(val);
                }}
              />
            </div>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>No. Invoice</TableColumn>
          <TableColumn>Tanggal</TableColumn>
          <TableColumn>Supplier</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Aksi</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="Data Kosong"
          isLoading={loading}
          loadingContent={<GridLoader color="#0096FF" />}
        >
          {(list?.data || []).map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    className="hover:text-primary text-xs"
                    to={`/purchase/invoice/${item.id}`}
                  >
                    {item.po_no}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {item.invoice_no}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatDate(item.date)}</TableCell>
              <TableCell>{item.supplier?.name}</TableCell>
              <TableCell>{capitalizeStatus(item.status)}</TableCell>
              <TableCell>{formatIDR(item.total)}</TableCell>
              <TableCell>
                <TableAction
                  items={[
                    {
                      title: "Download Invoice",
                      onPress: () =>
                        handleDownload(
                          `/po/invoice/download/${item.id}`,
                          item.po_no,
                          true,
                        ),
                      icon: Download as any,
                    },
                  ]}
                  onDelete={() => handleDelete(item.id)}
                  onDetail={() => handleDetail(item.id)}
                  onEdit={() => navigate(`${item.id}`)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
