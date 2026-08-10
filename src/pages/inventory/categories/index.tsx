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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  const searchBounce = debounce(
    (q: string) => dispatch(setCategoryQuery({ q })),
    800,
  );

  const stats = useMemo(() => {
    const activeCount = categories.filter((cat) => cat.is_active).length;
    const withProducts = categories.filter(
      (cat) => getProductCount(cat) > 0,
    ).length;
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
        actionTitle={t("inventory.categories.add")}
        leadIcon={Tags}
        subtitle={t("inventory.categories.subtitle")}
        title={t("inventory.categories.title")}
        onAction={() => {
          setDetail(undefined);
          setModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: t("inventory.categories.stats.total"),
            value: formatNumber(stats.total),
            icon: Layers,
            card: "border-violet-200 bg-violet-50/40",
            iconWrap: "bg-violet-100 text-violet-600",
          },
          {
            label: t("inventory.categories.stats.active"),
            value: formatNumber(stats.activeCount),
            icon: Tags,
            card: "border-emerald-200 bg-emerald-50/40",
            iconWrap: "bg-emerald-100 text-emerald-600",
          },
          {
            label: t("inventory.categories.stats.sub"),
            value: formatNumber(stats.subCategoryTotal),
            icon: Package,
            card: "border-sky-200 bg-sky-50/40",
            iconWrap: "bg-sky-100 text-sky-600",
          },
          {
            label: t("inventory.categories.stats.with_products"),
            value: formatNumber(stats.withProducts),
            icon: Package,
            card: "border-amber-200 bg-amber-50/40",
            iconWrap: "bg-amber-100 text-amber-600",
          },
        ].map((item) => (
          <Card
            key={item.label}
            className={`border shadow-sm ${item.card}`}
            shadow="none"
          >
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
              label={t("inventory.categories.search_label")}
              placeholder={t("inventory.categories.search_placeholder")}
              startContent={<Search className="size-4 text-gray-400" />}
              variant="bordered"
              onClear={() => updateQuery({ q: "" })}
              onValueChange={searchBounce}
            />

            <Select
              label={t("common.status")}
              selectedKeys={[query.is_active || "all"]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;

                updateQuery({ is_active: value || "all" });
              }}
            >
              <SelectItem key="all">
                {t("inventory.categories.filter.all_status")}
              </SelectItem>
              <SelectItem key="true">
                {t("inventory.categories.filter.active")}
              </SelectItem>
              <SelectItem key="false">
                {t("inventory.categories.filter.inactive")}
              </SelectItem>
            </Select>

            <Select
              label={t("inventory.categories.table.products")}
              selectedKeys={[query.productFilter || "all"]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;

                updateQuery({ productFilter: value || "all" });
              }}
            >
              <SelectItem key="all">
                {t("inventory.categories.filter.all_products")}
              </SelectItem>
              <SelectItem key="has">
                {t("inventory.categories.filter.has_products")}
              </SelectItem>
              <SelectItem key="empty">
                {t("inventory.categories.filter.no_products")}
              </SelectItem>
            </Select>

            <Select
              label={t("inventory.categories.table.sub_category")}
              selectedKeys={[query.subCategoryFilter || "all"]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;

                updateQuery({ subCategoryFilter: value || "all" });
              }}
            >
              <SelectItem key="all">
                {t("inventory.categories.filter.all")}
              </SelectItem>
              <SelectItem key="has">
                {t("inventory.categories.filter.has_sub")}
              </SelectItem>
              <SelectItem key="empty">
                {t("inventory.categories.filter.no_sub")}
              </SelectItem>
            </Select>

            <Select
              label={t("inventory.categories.filter.sort")}
              selectedKeys={[
                `${query.sortBy || "created_at"}:${query.sortOrder || "desc"}`,
              ]}
              variant="bordered"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                const [sortBy, sortOrder] = value.split(":");

                updateQuery({ sortBy, sortOrder });
              }}
            >
              <SelectItem key="created_at:desc">
                {t("inventory.categories.filter.newest")}
              </SelectItem>
              <SelectItem key="created_at:asc">
                {t("inventory.categories.filter.oldest")}
              </SelectItem>
              <SelectItem key="name:asc">
                {t("inventory.categories.filter.name_az")}
              </SelectItem>
              <SelectItem key="name:desc">
                {t("inventory.categories.filter.name_za")}
              </SelectItem>
              <SelectItem key="total_product:desc">
                {t("inventory.categories.filter.most_products")}
              </SelectItem>
              <SelectItem key="total_product:asc">
                {t("inventory.categories.filter.least_products")}
              </SelectItem>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              {t("inventory.categories.filter.showing", {
                count: categories.length,
              })}
            </p>
            <Button
              size="sm"
              startContent={<RefreshCw size={14} />}
              variant="flat"
              onPress={handleResetFilters}
            >
              {t("inventory.categories.filter.reset")}
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
                <TableColumn width={280}>
                  {t("inventory.categories.table.category")}
                </TableColumn>
                <TableColumn>
                  {t("inventory.categories.table.sub_category")}
                </TableColumn>
                <TableColumn>
                  {t("inventory.categories.table.description")}
                </TableColumn>
                <TableColumn align="center">
                  {t("inventory.categories.table.products")}
                </TableColumn>
                <TableColumn align="center">
                  {t("inventory.categories.table.status")}
                </TableColumn>
                <TableColumn align="end">
                  {t("inventory.categories.table.created")}
                </TableColumn>
                <TableColumn align="center" width={80}>
                  {t("inventory.categories.table.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent={t("inventory.categories.table.empty")}>
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
                          {t("inventory.categories.table.no_sub")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">
                        {cat.description ||
                          t("inventory.categories.table.no_description")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-black text-gray-700">
                          {formatNumber(getProductCount(cat))}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase">
                          {t("inventory.categories.table.items")}
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
                          {cat.is_active
                            ? t("inventory.categories.filter.active")
                            : t("inventory.categories.filter.inactive")}
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
              {t("inventory.categories.note_title")}
            </strong>
            {t("inventory.categories.note_body")}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
