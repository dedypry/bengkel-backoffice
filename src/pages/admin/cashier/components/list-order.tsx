import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CardActions, Tab, tabClasses, TabList, Tabs } from "@mui/joy";

import ListCustomer from "./list-customer";
import ListProduct from "./list-product";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import debounce from "@/utils/helpers/debounce";
import {
  setTabCashier,
  setWoQuery,
} from "@/stores/features/work-order/wo-slice";
import { CustomPagination } from "@/components/custom-pagination";
import { getProduct } from "@/stores/features/product/product-action";
import { setProductQuery } from "@/stores/features/product/product-slice";

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
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Tabs
              aria-label="tabs"
              size="sm"
              sx={{ bgcolor: "transparent", width: "100%" }}
              value={tabCashier}
              onChange={(_, val) => {
                dispatch(setTabCashier(val));
              }}
            >
              <TabList
                disableUnderline
                sx={{
                  p: 0.5,
                  gap: 0.5,
                  borderRadius: "xl",
                  width: "100%",
                  bgcolor: "background.level1",
                  [`& .${tabClasses.root}`]: {
                    flex: 1,
                    transition: "0.3s",
                    fontWeight: "md",
                  },
                  [`& .${tabClasses.root}[aria-selected="true"]`]: {
                    boxShadow: "sm",
                    bgcolor: "background.surface",
                  },
                }}
              >
                <Tab disableIndicator value="customer">
                  Customer
                </Tab>
                <Tab disableIndicator value="product">
                  Produk
                </Tab>
              </TabList>
            </Tabs>
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 placeholder:text-xs"
              placeholder="Cari plat nomor atau nama..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debounceSearch(e.target.value);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto scrollbar-modern flex-1">
          {tabCashier == "customer" ? <ListCustomer /> : <ListProduct />}
        </CardContent>
        <CardActions>
          <CustomPagination
            className="w-full"
            meta={isProduct ? products?.meta! : orders?.meta!}
            showDesc={false}
            showTotal={true}
            onPageChange={(page) =>
              dispatch(
                isProduct ? setProductQuery({ page }) : setWoQuery({ page }),
              )
            }
          />
        </CardActions>
      </Card>
    </div>
  );
}
