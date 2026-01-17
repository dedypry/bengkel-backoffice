import {
  Search,
  Truck,
  Calendar as CalendarIcon,
  ArrowDownLeft,
  ChevronRight,
  PackagePlus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IconButton, Input } from "@mui/joy";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProductReceipt } from "@/stores/features/product/product-action";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { CustomPagination } from "@/components/custom-pagination";
import { setProductQuery } from "@/stores/features/product/product-slice";
import HeaderAction from "@/components/header-action";
import { DatePicker } from "@/components/date-picker";
import debounce from "@/utils/helpers/debounce";

export default function ProductIn() {
  const { recepipts, productQuery } = useAppSelector((state) => state.product);
  const { company } = useAppSelector((state) => state.auth);
  const [date, setDate] = useState(new Date().toISOString());
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      dispatch(getProductReceipt(productQuery));
    }
  }, [company, productQuery]);

  const searchDebounce = debounce((q) => dispatch(setProductQuery({ q })), 500);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <HeaderAction
        actionIcon={PackagePlus}
        actionTitle="Buat Penerimaan Baru"
        leadIcon={ArrowDownLeft}
        subtitle="Catat dan verifikasi kiriman sparepart dari supplier."
        title=" Penerimaan Barang Masuk"
        onAction={() => navigate("/inventory/in/add")}
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <Input
          endDecorator={
            <IconButton
              onClick={() => {
                searchDebounce("");
                setSearch("");
              }}
            >
              <X />
            </IconButton>
          }
          placeholder="Cari No. Referensi atau Supplier..."
          startDecorator={<Search />}
          sx={{ flex: 1 }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchDebounce(e.target.value);
          }}
        />

        <div className="flex gap-2">
          <DatePicker setValue={setDate} value={new Date(date)} />
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => navigate("/master/suppliers")}
          >
            <Truck className="size-4" /> Supplier
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">
                ID Transaksi & Tanggal
              </TableHead>
              <TableHead className="font-bold">Supplier</TableHead>
              <TableHead className="font-bold text-center">
                Jumlah Item
              </TableHead>
              <TableHead className="font-bold text-right">
                Total Pembelian
              </TableHead>
              {/* <TableHead className="font-bold text-center">Status</TableHead> */}
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {recepipts?.data.map((data) => (
              <TableRow
                key={data.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell>
                  <div className="font-bold text-slate-800 uppercase tracking-tighter">
                    {data.grn_number}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarIcon className="size-3" />{" "}
                    {dayjs(data.receipt_at).format("DD MMM YY")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-700">
                    {data.supplier?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Penerima: {data.received.name}
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold text-slate-600">
                  {formatNumber(Number(data.total_qty))}
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900 underline decoration-primary/20 underline-offset-4">
                  {formatIDR(Number(data.total_amount))}
                </TableCell>
                {/* <TableCell className="text-center">
                  <Badge
                    className={
                      data.status === "Verified"
                        ? "bg-emerald-500"
                        : "bg-amber-500 animate-pulse"
                    }
                  >
                    {data.status === "Verified" ? "Terverifikasi" : "Menunggu"}
                  </Badge>
                </TableCell> */}
                <TableCell className="text-right">
                  {/* <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      title="Cetak Label/Struk"
                      variant="ghost"
                    >
                      <Printer className="size-4 text-slate-400" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <ChevronRight className="size-5 text-slate-300" />
                    </Button>
                  </div> */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => navigate(`/inventory/in/${data.id}`)}
                  >
                    <ChevronRight className="size-5 text-slate-300" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            <CustomPagination
              meta={recepipts?.meta!}
              onPageChange={(page) => dispatch(setProductQuery({ page }))}
            />
          </TableCaption>
        </Table>
      </div>
    </div>
  );
}
