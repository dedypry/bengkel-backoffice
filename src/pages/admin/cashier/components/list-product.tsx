import { Typography, Box, Stack } from "@mui/joy"; // Asumsi menggunakan Joy UI sesuai konteks sebelumnya

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/utils/helpers/format";
import { setWoProducts } from "@/stores/features/work-order/wo-slice";

export default function ListProduct() {
  const { products } = useAppSelector((state) => state.product);
  const { products: datas } = useAppSelector((state) => state.wo);

  const dispatch = useAppDispatch();

  return (
    <div className="space-y-3">
      {products?.data.map((item) => {
        const isSelected = datas.map((e) => e.id).includes(item.id);

        return (
          <Item
            key={item.id}
            className={`cursor-pointer ${isSelected ? "border-primary" : ""}`}
            variant="outline"
            onClick={() =>
              dispatch(
                setWoProducts({
                  ...item,
                  qty: 1,
                }),
              )
            }
          >
            <ItemContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  mb: 1,
                }}
              >
                <Stack>
                  <Typography color="primary" fontWeight="bold" level="body-xs">
                    {item.category?.name}
                  </Typography>
                  <ItemTitle>{item.name}</ItemTitle>
                  <Typography level="body-xs" sx={{ font: "monospace" }}>
                    Code: {item.code}
                  </Typography>
                </Stack>

                <Typography color="success" fontWeight="xl" level="title-md">
                  {formatIDR(Number(item.sell_price))}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Badge
                    color={item.stock <= item.min_stock ? "danger" : "neutral"}
                    variant="outline"
                  >
                    Stok: {item.stock} {item.unit}
                  </Badge>
                  <Badge color="neutral" variant="outline">
                    Loc: {item.location}
                  </Badge>
                </Stack>

                <Typography level="body-xs" sx={{ fontStyle: "italic" }}>
                  Unit: {item.uom?.name}
                </Typography>
              </Box>
            </ItemContent>
          </Item>
        );
      })}
    </div>
  );
}
