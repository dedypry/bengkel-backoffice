import type { IProductCategory } from "@/utils/interfaces/IProduct";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Layers,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tags,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import dayjs from "dayjs";

import ModalAddCategory from "./components/add-category";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/product/product-action";
import { formatNumber } from "@/utils/helpers/format";
import debounce from "@/utils/helpers/debounce";
import { setCategoryQuery } from "@/stores/features/product/product-slice";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import TableAction from "@/components/table-action";
import HeaderAction from "@/components/header-action";

type CategoryQueryState = {
  q: string;
  is_active: string;
  productFilter: string;
  subCategoryFilter: string;
  sortBy: string;
  sortOrder: string;
};

function getProductCount(cat: IProductCategory) {
  return Number(cat.total_product_all ?? cat.total_product ?? 0);
}

export default function InventoryCategoryPage() {
  const { categories, categoryQuery } = useAppSelector(
    (state) => state.product,
  );
  const { company } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<IProductCategory>();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const query = categoryQuery as CategoryQueryState;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      dispatch(getCategories(categoryQuery)).then(() => setLoading(false));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [categoryQuery, company, dispatch]);

  const searchBounce = debounce((q: string) => dispatch(setCategoryQuery({ q })), 800);

  const stats = useMemo(() => {
    const activeCount = categories.filter((cat) => cat.is_active).length;
    const withProducts = categories.filter((cat) => getProductCount(cat) > 0).length;
    const subCategoryTotal = categories.reduce(
      (sum, cat) => sum + (cat.children?.length || 0),
      0,
    );

    return {
      total: categories.length,
      activeCount,
      withProducts,
      subCategoryTotal,
    };
  }, [categories]);

  async function handleDelete(id: number) {
    http
      .delete(`/products/categories/${id}`)
      .then(({ data }) => {
        notify(data.message || data);
        dispatch(getCategories(categoryQuery));
      })
      .catch((err) => notifyError(err));
  }

  function handleEditData(data: IProductCategory) {
    setDetail(data);
    setModalOpen(true);
  }

  function handleResetFilters() {
    dispatch(
      setCategoryQuery({
        q: "",
        is_active: "all",
        productFilter: "all",
        subCategoryFilter: "all",
        sortBy: "created_at",
        sortOrder: "desc",
      }),
    );
  }

  function updateQuery(payload: Partial<CategoryQueryState>) {
    dispatch(setCategoryQuery(payload));
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <ModalAddCategory
        initialData={detail}
        open={modalOpen}
        setOpen={setModalOpen}
      />

      <HeaderAction
        actionIcon={Plus}
        actionTitle="Tambah Kategori"
        leadIcon={Tags}
        subtitle="Kelola pengelompokan produk bengkel Anda."
        title="Kategori Produk"
        onAction={() => {
          setDetail(undefined);
          setModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Kategori",
            value: formatNumber(stats.total),
            icon: Layers,
            card: "border-violet-200 bg-violet-50/40",
            iconWrap: "bg-violet-100 text-violet-600",
          },
          {
            label: "Kategori Aktif",
            value: formatNumber(stats.activeCount),
            icon: Tags,
            card: "border-emerald-200 bg-emerald-50/40",
            iconWrap: "bg-emerald-100 text-emerald-600",
          },
          {
            label: "Sub Kategori",
            value: formatNumber(stats.subCategoryTotal),
            icon: Package,
            card: "border-sky-200 bg-sky-50/40",
            iconWrap: "bg-sky-100 text-sky-600",
          },
          {
            label: "Memiliki Produk",
            value: formatNumber(stats.withProducts),
            icon: Package,
            card: "border-amber-200 bg-amber-50/40",
            iconWrap: "bg-amber-100 text-amber-600",
          },
        ].map((item) => (
          <Card key={item.label} className={`border shadow-sm ${item.card}`} shadow="none">
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className={`p-3 rounded-xl ${item.iconWrap}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500">
                  {item.label}
                </p>
                <p className="text-xl font-black text-gray-700">{item.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200 shadow-sm" shadow="none">
        <CardBody className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Input
              isClearable
              defaultValue={query.q}
              label="Cari Kategori"
              placeholder="Nama kategori, deskripsi, atau sub kategori..."
              startContent={<Search className="size-4 text-gray-400" />}
              variant="bordered"
              onClear={() => updateQuery({ q: "" })}
              onValueChange={searchBounce}
            />

            <Select
              label="Status"
              selectedKeys={[query.is_active || "all"]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                updateQuery({ is_active: value || "all" });
              }}
            >
              <SelectItem key="all">Semua Status</SelectItem>
              <SelectItem key="true">Aktif</SelectItem>
              <SelectItem key="false">Nonaktif</SelectItem>
            </Select>

            <Select
              label="Produk"
              selectedKeys={[query.productFilter || "all"]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                updateQuery({ productFilter: value || "all" });
              }}
            >
              <SelectItem key="all">Semua Produk</SelectItem>
              <SelectItem key="has">Ada Produk</SelectItem>
              <SelectItem key="empty">Tanpa Produk</SelectItem>
            </Select>

            <Select
              label="Sub Kategori"
              selectedKeys={[query.subCategoryFilter || "all"]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                updateQuery({ subCategoryFilter: value || "all" });
              }}
            >
              <SelectItem key="all">Semua</SelectItem>
              <SelectItem key="has">Ada Sub Kategori</SelectItem>
              <SelectItem key="empty">Tanpa Sub Kategori</SelectItem>
            </Select>

            <Select
              label="Urutkan"
              selectedKeys={[`${query.sortBy || "created_at"}:${query.sortOrder || "desc"}`]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                const [sortBy, sortOrder] = value.split(":");
                updateQuery({ sortBy, sortOrder });
              }}
            >
              <SelectItem key="created_at:desc">Terbaru</SelectItem>
              <SelectItem key="created_at:asc">Terlama</SelectItem>
              <SelectItem key="name:asc">Nama A-Z</SelectItem>
              <SelectItem key="name:desc">Nama Z-A</SelectItem>
              <SelectItem key="total_product:desc">Produk Terbanyak</SelectItem>
              <SelectItem key="total_product:asc">Produk Tersedikit</SelectItem>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Menampilkan{" "}
              <span className="font-bold text-gray-700">{categories.length}</span>{" "}
              kategori
            </p>
            <Button
              size="sm"
              startContent={<RefreshCw size={14} />}
              variant="flat"
              onPress={handleResetFilters}
            >
              Reset Filter
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-gray-200 shadow-sm" shadow="none">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner color="primary" />
            </div>
          ) : (
            <Table
              isStriped
              removeWrapper
              aria-label="Tabel kategori produk"
              classNames={{
                th: "bg-gray-50 text-[10px] font-black uppercase text-gray-500",
                td: "py-4 px-4 border-b border-gray-100",
              }}
            >
              <TableHeader>
                <TableColumn width={280}>KATEGORI</TableColumn>
                <TableColumn>SUB KATEGORI</TableColumn>
                <TableColumn>DESKRIPSI</TableColumn>
                <TableColumn align="center">PRODUK</TableColumn>
                <TableColumn align="center">STATUS</TableColumn>
                <TableColumn align="end">DIBUAT</TableColumn>
                <TableColumn align="center" width={80}>
                  AKSI
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="Kategori tidak ditemukan">
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <p className="font-black text-gray-700 uppercase text-xs">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {cat.slug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cat.children?.length ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cat.children.map((child) => (
                            <Chip
                              key={child.id}
                              className="text-[10px] font-bold"
                              size="sm"
                              variant="flat"
                            >
                              {child.name}
                            </Chip>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Tidak ada
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">
                        {cat.description || "Tidak ada deskripsi"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-black text-gray-700">
                          {formatNumber(getProductCount(cat))}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase">
                          Items
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Chip
                          color={cat.is_active ? "success" : "default"}
                          size="sm"
                          variant="flat"
                        >
                          {cat.is_active ? "Aktif" : "Nonaktif"}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-gray-500 text-end">
                        {dayjs(cat.created_at).format("DD MMM YYYY")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <TableAction
                          isDeleteSeparator={false}
                          viewDetail={false}
                          onDelete={() => handleDelete(cat.id)}
                          onEdit={() => handleEditData(cat)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Card className="border border-gray-200 shadow-sm" shadow="none">
        <CardBody className="flex flex-row gap-3 p-4">
          <AlertCircle className="size-5 text-gray-500 shrink-0" />
          <p className="text-tiny text-gray-600 leading-relaxed font-medium">
            <strong className="text-gray-900 uppercase tracking-tighter mr-1">
              Catatan Pengelola:
            </strong>
            Menghapus kategori yang masih memiliki produk aktif akan menyebabkan
            produk tersebut masuk ke kategori
            <i className="text-gray-900 font-bold ml-1">
              &quot;Tanpa Kategori&quot;
            </i>
            . Mohon pastikan kategori sudah kosong sebelum dihapus.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
