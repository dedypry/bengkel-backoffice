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
  Divider,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { GridLoader } from "react-spinners";

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
  const [search, setSearch] = useState(categoryQuery.q || "");
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

  const searchDebounce = useMemo(
    () => debounce((q: string) => dispatch(setCategoryQuery({ q })), 800),
    [dispatch],
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
    setSearch("");
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
    <div className="space-y-6 pb-10">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: t("inventory.categories.stats.total"),
            value: formatNumber(stats.total),
            icon: <Layers className="text-gray-600" size={22} />,
            color: "border-gray-200",
          },
          {
            label: t("inventory.categories.stats.active"),
            value: formatNumber(stats.activeCount),
            icon: <Tags className="text-emerald-600" size={22} />,
            color: "border-emerald-400",
          },
          {
            label: t("inventory.categories.stats.sub"),
            value: formatNumber(stats.subCategoryTotal),
            icon: <Package className="text-gray-600" size={22} />,
            color: "border-gray-200",
          },
          {
            label: t("inventory.categories.stats.with_products"),
            value: formatNumber(stats.withProducts),
            icon: <Package className="text-amber-600" size={22} />,
            color: "border-amber-400",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`border-l-4 ${stat.color} border-y border-r border-primary`}
          >
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className="rounded-xl bg-gray-50 p-3">{stat.icon}</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </p>
                <p className="text-xl font-black tracking-tight text-gray-800">
                  {stat.value}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-4 px-4 pt-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input
              isClearable
              className="w-full"
              placeholder={t("inventory.categories.search_placeholder")}
              startContent={<Search className="size-4 text-gray-400" />}
              value={search}
              variant="bordered"
              onClear={() => {
                setSearch("");
                updateQuery({ q: "" });
              }}
              onValueChange={(value) => {
                setSearch(value);
                searchDebounce(value);
              }}
            />

            <Select
              aria-label={t("common.status")}
              className="w-full"
              placeholder={t("common.status")}
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
              aria-label={t("inventory.categories.table.products")}
              className="w-full"
              placeholder={t("inventory.categories.table.products")}
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
              aria-label={t("inventory.categories.table.sub_category")}
              className="w-full"
              placeholder={t("inventory.categories.table.sub_category")}
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
              aria-label={t("inventory.categories.filter.sort")}
              className="w-full md:col-span-2 xl:col-span-1"
              placeholder={t("inventory.categories.filter.sort")}
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
        </div>

        <Table
          aria-label={t("inventory.categories.table.category")}
          shadow="none"
        >
          <TableHeader>
            <TableColumn>
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
            <TableColumn align="center"> </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={t("inventory.categories.table.empty")}
            isLoading={loading}
            loadingContent={<GridLoader color="#0096FF" />}
          >
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-small font-bold uppercase text-gray-800">
                      {cat.name}
                    </span>
                    <span className="font-mono text-[10px] italic tracking-tighter text-gray-400">
                      {cat.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {cat.children?.length ? (
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {cat.children.map((child) => (
                        <Chip
                          key={child.id}
                          classNames={{
                            base: "bg-gray-100 border-none h-6",
                            content:
                              "text-[10px] font-black uppercase text-gray-600",
                          }}
                          size="sm"
                          variant="flat"
                        >
                          {child.name}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <span className="text-tiny italic text-gray-400">
                      {t("inventory.categories.table.no_sub")}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-xs text-tiny text-gray-500">
                    {cat.description ||
                      t("inventory.categories.table.no_description")}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <span className="text-small font-black text-gray-700">
                      {formatNumber(getProductCount(cat))}
                    </span>
                    <p className="text-[9px] uppercase text-gray-400">
                      {t("inventory.categories.table.items")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    className="font-bold text-tiny"
                    color={cat.is_active ? "success" : "default"}
                    variant="dot"
                  >
                    {cat.is_active
                      ? t("inventory.categories.filter.active")
                      : t("inventory.categories.filter.inactive")}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-tiny text-gray-500">
                    {dayjs(cat.created_at).format("DD MMM YYYY")}
                  </span>
                </TableCell>
                <TableCell>
                  <TableAction
                    isDeleteSeparator={false}
                    viewDetail={false}
                    onDelete={() => handleDelete(cat.id)}
                    onEdit={() => handleEditData(cat)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider />

        <CardBody className="flex flex-row gap-3 py-4">
          <AlertCircle className="size-4 shrink-0 text-gray-400" />
          <p className="text-tiny font-medium leading-relaxed text-gray-500">
            <strong className="mr-1 uppercase tracking-tighter text-gray-700">
              {t("inventory.categories.note_title")}
            </strong>
            {t("inventory.categories.note_body")}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
