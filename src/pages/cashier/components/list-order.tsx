import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@heroui/react";

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

export default function ListOrder() {
  const { orders, tabCashier } = useAppSelector((state) => state.wo);
  const { productQuery, products } = useAppSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();
  const isProduct = tabCashier === "product";

  useEffect(() => {
    dispatch(getProduct({ ...productQuery, pageSize: 50 }));
  }, [productQuery]);

  const debounceSearch = debounce(
    (q) => dispatch(isProduct ? setProductQuery({ q }) : setWoQuery({ q })),
    500,
  );

  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader className="pb-3 flex flex-col gap-2">
          <Tabs
            fullWidth
            selectedKey={tabCashier}
            onSelectionChange={(key) => dispatch(setTabCashier(key as string))}
          >
            <Tab key="customer" title="Customer" />
            <Tab key="product" title="Produk" />
          </Tabs>
          <Input
            className="placeholder:text-xs"
            placeholder="Cari plat nomor atau nama..."
            startContent={<Search size={20} />}
            value={searchTerm}
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
