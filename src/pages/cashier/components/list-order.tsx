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

import ListCustomer from "./list-customer";
import ListProduct from "./list-product";

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
  const { orders, tabCashier, woQuery } = useAppSelector((state) => state.wo);
  const { productQuery, products } = useAppSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const isProduct = tabCashier === "product";

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getProduct({ ...productQuery, pageSize: 50 }));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [productQuery]);

  const debounceSearch = debounce(
    (q) =>
      dispatch(
        isProduct
          ? setProductQuery({ q, page: 1 })
          : setWoQuery({ q, page: 1 }),
      ),
    500,
  );

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
            selectedKey={tabCashier}
            onSelectionChange={(key) => {
              dispatch(setTabCashier(key as string));
              setSearchTerm("");
            }}
          >
            <Tab key="customer" title="Customer" />
            <Tab key="product" title="Sparepart" />
          </Tabs>

          {!isProduct && (
            <CustomDatePicker
              label="Tanggal"
              labelPlacement="outside"
              placeholder="Semua tanggal"
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
                  }),
                )
              }
            />
          )}

          <Input
            className="placeholder:text-xs"
            placeholder={
              isProduct
                ? "Cari nama atau kode sparepart..."
                : "Cari plat nomor atau nama..."
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
          {tabCashier == "customer" ? <ListCustomer /> : <ListProduct />}
        </CardBody>
        <CardFooter>
          <CustomPagination
            className="w-full"
            meta={isProduct ? products?.meta! : orders?.meta!}
            showDesc={false}
            onPageChange={(page) =>
              dispatch(
                isProduct ? setProductQuery({ page }) : setWoQuery({ page }),
              )
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
