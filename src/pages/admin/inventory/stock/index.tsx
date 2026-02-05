import {
  Search,
  Plus,
  Package,
  AlertCircle,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@mui/joy";

import SelectCategories from "./components/select-categories";
import UpdateStock from "./components/update-stock";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { getProduct } from "@/stores/features/product/product-action";
import TableAction from "@/components/table-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setProductQuery } from "@/stores/features/product/product-slice";
import debounce from "@/utils/helpers/debounce";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function StokBarang() {
  const { company } = useAppSelector((state) => state.auth);
  const { products, productQuery } = useAppSelector((state) => state.product);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProduct(productQuery));
  }, [company, productQuery]);

  const searchDebounce = debounce(
    (q) => dispatch(setProductQuery({ q })),
    1000,
  );

  function handleDelete(id: number) {
    http
      .delete(`/products/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getProduct(productQuery));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <HeaderAction
        actionContent={
          <>
            {/* <Button
              className="gap-2"
              variant="outline"
              onClick={() => navigate("/inventory/stock/logs")}
            >
              <History className="size-4" /> Log Stok
            </Button> */}
            <Button
              color="success"
              startDecorator={<Download className="size-4" />}
              onClick={() =>
                handleDownloadExcel(
                  "/products/export/excel",
                  productQuery,
                  "product-list",
                )
              }
            >
              Export Excel
            </Button>
            {/* <ImportProduct /> */}
            <Button
              startDecorator={<Plus className="size-4" />}
              onClick={() => navigate("/inventory/stock/add")}
            >
              Tambah Barang
            </Button>
          </>
        }
        leadIcon={Package}
        subtitle=" Kelola stok, harga, dan kategori barang bengkel Anda."
        title="Inventaris Sparepart"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Total Item
            </p>
            <p className="text-xl font-bold text-slate-900">
              {formatNumber(products?.meta.total || 0)}
              <span className="text-xs font-normal text-slate-400 font-mono ml-1">
                SKU
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm border-l-4 border-l-amber-500 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Stok Menipis
            </p>
            <p className="text-xl font-bold text-amber-600">
              {formatNumber(products?.stats?.low_stock_count | 0)}
              <span className="text-xs font-normal opacity-70 italic ml-1">
                Perlu Order
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <ArrowUpDown size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Nilai Inventaris
            </p>
            <p className="text-xl font-bold text-slate-900">
              {formatIDR(products?.stats?.total_inventory_value || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Table Area */}
      <Card className="shadow-lg">
        {/* <Card className="bg-white rounded-2xl border shadow-sm overflow-hidden"> */}
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Cari nama barang atau kode SKU..."
              onChange={(e) => searchDebounce(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-60">
            <SelectCategories />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50 text-slate-500 text-xs uppercase">
            <TableRow>
              <TableHead>Info Barang</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-center">Kategori</TableHead>
              <TableHead className="text-right">Harga Beli</TableHead>
              <TableHead className="text-right">Harga Jual</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-semibold text-sm text-slate-800">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
                    {item.code}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex gap-2">
                    <div className="flex flex-col">
                      <div className="font-semibold text-sm text-slate-700">
                        {item.stock}{" "}
                        <span className="text-[11px] text-slate-600 font-normal">
                          {item.uom?.code}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 italic">
                        Min. {item.min_stock}
                      </div>
                    </div>
                    <UpdateStock
                      currentStock={item.stock}
                      id={item.id}
                      name={item.name}
                    />
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className="font-medium text-[10px] uppercase"
                    variant="secondary"
                  >
                    {item.category?.name}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="font-semibold text-sm text-slate-900">
                    {formatIDR(Number(item.purchase_price))}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="font-semibold text-sm text-slate-900">
                    {formatIDR(Number(item.sell_price))}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {item.stock === 0 ? (
                    <Badge
                      className="text-[10px] animate-pulse"
                      variant="destructive"
                    >
                      Kosong
                    </Badge>
                  ) : item.stock <= item.min_stock ? (
                    <Badge className="bg-amber-500 text-[10px] hover:bg-amber-600">
                      Menipis
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500 text-[10px] hover:bg-emerald-600">
                      Aman
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <TableAction
                    onDelete={() => handleDelete(item.id)}
                    onDetail={() => navigate(`/inventory/stock/${item.id}`)}
                    onEdit={() => navigate(`/inventory/stock/${item.id}/edit`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            <CustomPagination
              meta={products?.meta!}
              onPageChange={(page) => dispatch(setProductQuery({ page }))}
            />
          </TableCaption>
        </Table>
      </Card>
    </div>
  );
}
