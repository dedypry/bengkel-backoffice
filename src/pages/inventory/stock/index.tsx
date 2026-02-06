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
import {
  Button,
  Input,
  Chip,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@heroui/react";

import SelectCategories from "./components/select-categories";
import UpdateStock from "./components/update-stock";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import { getProduct } from "@/stores/features/product/product-action";
import TableAction from "@/components/table-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setProductQuery } from "@/stores/features/product/product-slice";
import debounce from "@/utils/helpers/debounce";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function InventoryStockPage() {
  const { company } = useAppSelector((state) => state.auth);
  const { products, productQuery } = useAppSelector((state) => state.product);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProduct(productQuery));
  }, [company, productQuery, dispatch]);

  const searchDebounce = debounce((q) => dispatch(setProductQuery({ q })), 800);

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
          <div className="flex gap-2">
            <Button
              color="primary"
              startContent={<Download className="size-4" />}
              variant="flat"
              onPress={() =>
                handleDownloadExcel(
                  "/products/export/excel",
                  productQuery,
                  "product-list",
                )
              }
            >
              Export Excel
            </Button>
            <Button
              color="primary"
              startContent={<Plus className="size-4" />}
              onPress={() => navigate("/inventory/stock/add")}
            >
              Tambah Barang
            </Button>
          </div>
        }
        leadIcon={Package}
        subtitle="Kelola stok, harga, dan kategori barang bengkel Anda."
        title="Inventaris Sparepart"
      />

      {/* Overview Cards - Gray Minimalist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Item",
            value: formatNumber(products?.meta.total || 0),
            unit: "SKU",
            icon: <Package className="text-gray-600" size={22} />,
            color: "border-gray-200",
          },
          {
            label: "Stok Menipis",
            value: formatNumber(products?.stats?.low_stock_count || 0),
            unit: "Perlu Order",
            icon: <AlertCircle className="text-amber-600" size={22} />,
            color: "border-amber-400",
          },
          {
            label: "Nilai Inventaris",
            value: formatIDR(products?.stats?.total_inventory_value || 0),
            unit: "",
            icon: <ArrowUpDown className="text-gray-600" size={22} />,
            color: "border-gray-200",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className={`border-l-4 ${stat.color} border-y border-r border-gray-100`}
            shadow="none"
          >
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className="bg-gray-50 p-3 rounded-xl">{stat.icon}</div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-black text-gray-800 tracking-tight">
                    {stat.value}
                  </p>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {stat.unit}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filter & Table Area */}
      <Card className="border border-gray-200" shadow="none">
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <Input
            isClearable
            className="w-full md:max-w-sm"
            placeholder="Cari nama barang atau kode SKU..."
            startContent={<Search className="text-gray-400" size={18} />}
            variant="bordered"
            onChange={(e) => searchDebounce(e.target.value)}
          />
          <div className="w-full md:w-64">
            <SelectCategories />
          </div>
        </div>

        <Table
          aria-label="Tabel Inventaris"
          classNames={{
            wrapper: "p-0 rounded-none shadow-none",
            th: "bg-gray-50 text-gray-500 font-bold h-12 text-[12px] uppercase tracking-wider",
            td: "py-4 border-b border-gray-100 last:border-none",
          }}
          shadow="none"
        >
          <TableHeader>
            <TableColumn>INFO BARANG</TableColumn>
            <TableColumn align="center">STOK</TableColumn>
            <TableColumn align="center">KATEGORI</TableColumn>
            <TableColumn align="end">HARGA BELI</TableColumn>
            <TableColumn align="end">HARGA JUAL</TableColumn>
            <TableColumn align="center">STATUS</TableColumn>
            <TableColumn align="end"> </TableColumn>
          </TableHeader>
          <TableBody emptyContent="Barang tidak ditemukan">
            {(products?.data || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-small uppercase">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono italic tracking-tighter">
                      {item.code}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-end">
                      <div className="font-black text-small text-gray-700">
                        {item.stock}{" "}
                        <span className="text-tiny font-normal text-gray-500 uppercase">
                          {item.uom?.code}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 italic">
                        Min. {item.min_stock}
                      </span>
                    </div>
                    <UpdateStock
                      currentStock={item.stock}
                      id={item.id}
                      name={item.name}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <Chip
                    className="bg-gray-100 text-gray-600 border-none font-bold text-[10px] uppercase"
                    size="sm"
                    variant="flat"
                  >
                    {item.category?.name}
                  </Chip>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-gray-600 text-small">
                    {formatIDR(Number(item.purchase_price))}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-bold text-gray-800 text-small">
                    {formatIDR(Number(item.sell_price))}
                  </span>
                </TableCell>

                <TableCell>
                  {item.stock === 0 ? (
                    <Chip
                      className="font-bold text-tiny"
                      color="danger"
                      variant="dot"
                    >
                      Kosong
                    </Chip>
                  ) : item.stock <= item.min_stock ? (
                    <Chip
                      className="font-bold text-tiny"
                      color="warning"
                      variant="dot"
                    >
                      Menipis
                    </Chip>
                  ) : (
                    <Chip
                      className="font-bold text-tiny"
                      color="success"
                      variant="dot"
                    >
                      Aman
                    </Chip>
                  )}
                </TableCell>

                <TableCell>
                  <TableAction
                    onDelete={() => handleDelete(item.id)}
                    onDetail={() => navigate(`/inventory/stock/${item.id}`)}
                    onEdit={() => navigate(`/inventory/stock/${item.id}/edit`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider />

        <CustomPagination
          meta={products?.meta!}
          onPageChange={(page) => dispatch(setProductQuery({ page }))}
        />
      </Card>
    </div>
  );
}
