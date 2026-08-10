import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@heroui/react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import ListCustomer from "./list-customer";
import ListCustomerFinished from "./list-customer-finished";
import ListProduct from "./list-product";
import {
  getCashierWoStatus,
  type CashierTab,
} from "../cashier-query";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import debounce from "@/utils/helpers/debounce";
import {
  setTabCashier,
  setWoQuery,
} from "@/stores/features/work-order/wo-slice";
import { getProduct } from "@/stores/features/product/product-action";
import { setProductQuery } from "@/stores/features/product/product-slice";
import { CustomPagination } from "@/components/custom-pagination";
import CustomDatePicker from "@/components/forms/date-picker";

export default function ListOrder() {
  const { t } = useTranslation();
  const { orders, tabCashier, woQuery } = useAppSelector((state) => state.wo);
  const { productQuery, products } = useAppSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const activeTab = tabCashier as CashierTab;
  const isProduct = activeTab === "product";
  const isCustomerWo = activeTab === "customer" || activeTab === "finish";
  const woStatus = getCashierWoStatus(activeTab);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getProduct({ ...productQuery, pageSize: 50 }));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [productQuery]);

  const debounceSearch = debounce((q) => {
    if (isProduct) {
      dispatch(setProductQuery({ q, page: 1 }));

      return;
    }

    dispatch(
      setWoQuery({
        q,
        page: 1,
        status: woStatus,
      }),
    );
  }, 500);

  const handleTabChange = (key: string) => {
    const tab = key as CashierTab;

    dispatch(setTabCashier(tab));
    setSearchTerm("");

    if (tab === "product") return;

    dispatch(
      setWoQuery({
        q: "",
        page: 1,
        status: getCashierWoStatus(tab),
      }),
    );
  };

  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader className="pb-3 flex flex-col gap-2">
          <Tabs
            fullWidth
            classNames={{
              tabContent:
                "text-gray-600 font-medium group-data-[selected=true]:text-gray-800",
            }}
            selectedKey={activeTab}
            onSelectionChange={(key) => handleTabChange(String(key))}
          >
            <Tab key="customer" title={t("cashier.tabs.customer")} />
            <Tab key="finish" title={t("cashier.tabs.finish")} />
            <Tab key="product" title={t("cashier.tabs.product")} />
          </Tabs>

          {isCustomerWo && (
            <CustomDatePicker
              label={t("cashier.date")}
              labelPlacement="outside"
              placeholder={t("cashier.all_dates")}
              size="sm"
              value={
                woQuery.date
                  ? dayjs(woQuery.date).format("YYYY-MM-DD")
                  : ("" as any)
              }
              variant="bordered"
              onChange={(date) =>
                dispatch(
                  setWoQuery({
                    date: date || "",
                    page: 1,
                    status: woStatus,
                  }),
                )
              }
            />
          )}

          <Input
            aria-label={
              isProduct
                ? t("cashier.search.product_aria")
                : activeTab === "finish"
                  ? t("cashier.search.finish_aria")
                  : t("cashier.search.customer_aria")
            }
            className="placeholder:text-xs"
            placeholder={
              isProduct
                ? t("cashier.search.product_placeholder")
                : activeTab === "finish"
                  ? t("cashier.search.finish_placeholder")
                  : t("cashier.search.customer_placeholder")
            }
            size="sm"
            startContent={<Search size={18} />}
            value={searchTerm}
            variant="bordered"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debounceSearch(e.target.value);
            }}
          />
        </CardHeader>
        <CardBody className="overflow-y-auto scrollbar-modern flex-1">
          {activeTab === "customer" && <ListCustomer />}
          {activeTab === "finish" && <ListCustomerFinished />}
          {activeTab === "product" && <ListProduct />}
        </CardBody>
        <CardFooter>
          <CustomPagination
            className="w-full"
            meta={isProduct ? products?.meta! : orders?.meta!}
            showDesc={false}
            onPageChange={(page) =>
              dispatch(
                isProduct
                  ? setProductQuery({ page })
                  : setWoQuery({ page, status: woStatus }),
              )
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
