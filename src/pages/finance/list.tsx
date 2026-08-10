import { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Input,
  Card,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import {
  Eye,
  Search,
  Hash,
  Calendar,
  CreditCard,
  Download,
  Receipt,
  UserCircle,
  UserCog,
} from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPayment } from "@/stores/features/payments/payment-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setPaymentQuery } from "@/stores/features/payments/payment-slice";
import { getCustomerList } from "@/stores/features/customer/customer-action";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { getAvatarByName } from "@/utils/helpers/global";
import { formatIDR } from "@/utils/helpers/format";
import { asArray } from "@/utils/helpers/as-array";

interface Props {
  noHeader?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export default function InvoiceListPage({
  noHeader = false,
  dateFrom,
  dateTo,
}: Props) {
  const { t } = useTranslation();
  const { payments, paymentQuery } = useAppSelector((state) => state.payment);
  const { company } = useAppSelector((state) => state.auth);
  const { data: customers } = useAppSelector((state) => state.customer);
  const { list: employees } = useAppSelector((state) => state.employe);
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const hasLoadedFilters = useRef(false);

  const customerItems = useMemo(() => asArray(customers), [customers]);
  const cashierItems = useMemo(
    () => asArray(employees?.data),
    [employees?.data],
  );

  useEffect(() => {
    if (!company || hasLoadedFilters.current) return;

    hasLoadedFilters.current = true;
    dispatch(getCustomerList());
    dispatch(getEmploye({ page: 1, pageSize: 200 }));
  }, [company, dispatch]);

  useEffect(() => {
    dispatch(
      setPaymentQuery({
        date_from: dateFrom || "",
        date_to: dateTo || "",
        page: 1,
      }),
    );
  }, [dateFrom, dateTo, dispatch]);

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getPayment(paymentQuery));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, paymentQuery, dispatch]);

  const onSearch = () => {
    dispatch(setPaymentQuery({ q: search }));
  };

  function handleExport() {}

  return (
    <div className="flex flex-col gap-6">
      {!noHeader && (
        <HeaderAction
          actionIcon={Download}
          actionTitle={t("finance.invoices.export")}
          leadIcon={Receipt}
          subtitle={t("finance.invoices.subtitle")}
          title={t("finance.invoices.title")}
          onAction={() => handleExport()}
        />
      )}

      <Card className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            placeholder={t("finance.invoices.search_placeholder")}
            startContent={
              <Search className="text-gray-500" size={20} values={search} />
            }
            onValueChange={setSearch}
          />
          <Autocomplete
            isClearable
            aria-label={t("finance.invoices.filter_customer")}
            defaultItems={customerItems}
            placeholder={t("finance.invoices.filter_customer_placeholder")}
            selectedKey={
              paymentQuery.customer_id ? String(paymentQuery.customer_id) : null
            }
            startContent={<UserCircle className="text-default-400" size={18} />}
            onClear={() =>
              dispatch(setPaymentQuery({ customer_id: "", page: 1 }))
            }
            onSelectionChange={(key) =>
              dispatch(
                setPaymentQuery({
                  customer_id: key ? String(key) : "",
                  page: 1,
                }),
              )
            }
          >
            {(item) => (
              <AutocompleteItem key={item.id} textValue={item.name}>
                {item.name}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            isClearable
            aria-label={t("finance.invoices.filter_cashier")}
            defaultItems={cashierItems}
            placeholder={t("finance.invoices.filter_cashier_placeholder")}
            selectedKey={
              paymentQuery.cashier_id ? String(paymentQuery.cashier_id) : null
            }
            startContent={<UserCog className="text-default-400" size={18} />}
            onClear={() =>
              dispatch(setPaymentQuery({ cashier_id: "", page: 1 }))
            }
            onSelectionChange={(key) =>
              dispatch(
                setPaymentQuery({
                  cashier_id: key ? String(key) : "",
                  page: 1,
                }),
              )
            }
          >
            {(item) => (
              <AutocompleteItem key={item.id} textValue={item.name}>
                {item.name}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Button
            color="primary"
            startContent={<Search size={18} />}
            onPress={onSearch}
          >
            {t("finance.invoices.search_button")}
          </Button>
        </div>
      </Card>

      <Table aria-label={t("finance.invoices.table_aria")}>
        <TableHeader>
          <TableColumn>{t("finance.invoices.col_invoice_ref")}</TableColumn>
          <TableColumn>{t("finance.invoices.col_customer")}</TableColumn>
          <TableColumn>{t("finance.invoices.col_total")}</TableColumn>
          <TableColumn>{t("finance.invoices.col_cashier")}</TableColumn>
          <TableColumn align="center">
            {t("finance.invoices.col_actions")}
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="p-6 bg-gray-50 rounded-full text-gray-300">
                <Hash size={40} />
              </div>
              <p className="font-black uppercase italic text-gray-400">
                {t("finance.invoices.empty")}
              </p>
            </div>
          }
        >
          {(payments?.data || []).map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-black text-gray-500 uppercase">
                    {item.payment_no}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {t("finance.invoices.ref_prefix")} {item.reference_no}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {item.work_order ? (
                  <User
                    avatarProps={{
                      size: "sm",
                      src:
                        item.work_order?.customer?.profile?.photo_url ||
                        getAvatarByName(item.work_order?.customer?.name!),
                      className: "border-1 border-gray-100",
                    }}
                    classNames={{
                      description: "text-[10px] font-medium text-gray-400",
                    }}
                    description={item.work_order?.customer?.phone}
                    name={
                      <span className="font-bold text-gray-500">
                        {item.work_order?.customer?.name}
                      </span>
                    }
                  />
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-black text-success">
                    {formatIDR(item.amount)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Chip
                      className="font-black uppercase text-[9px] rounded-sm"
                      color="primary"
                      size="sm"
                      startContent={<CreditCard size={12} />}
                      variant="flat"
                    >
                      {item.method}
                    </Chip>
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                      <Calendar size={10} />{" "}
                      {dayjs(item.created_at).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <User
                  avatarProps={{
                    size: "sm",
                    src:
                      item.cashier?.profile?.photo_url ||
                      getAvatarByName(item.cashier?.name!),
                  }}
                  classNames={{ description: "text-[10px]" }}
                  description={`${t("finance.invoices.nik_prefix")} ${item.cashier?.nik || "-"}`}
                  name={
                    <span className="font-bold text-gray-500 uppercase text-xs">
                      {item.cashier?.name}
                    </span>
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    navigate(
                      item.work_order_id
                        ? `/service/queue/${item.work_order_id}`
                        : `/finance/${item.id}`,
                    )
                  }
                >
                  <Eye size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        meta={payments?.meta!}
        onPageChange={(page) => dispatch(setPaymentQuery({ page }))}
      />
    </div>
  );
}
