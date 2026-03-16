import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardFooter,
  Button,
  CardHeader,
  Input,
  Tooltip,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { PackageSearch, Trash2 } from "lucide-react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";

import ModalProductOrder from "./modal-product-order";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import {
  ISparepart,
  removeWoProduct,
  setWoProducts,
} from "@/stores/features/work-order/wo-slice";
import { getCustomerList } from "@/stores/features/customer/customer-action";
import InputNumber from "@/components/input-number";

const schema = z.object({
  customer_id: z.number().optional().nullable(),
  no_po: z.string().optional().nullable(),
});

type FormValue = z.infer<typeof schema>;

export default function PanelProduct() {
  const { products } = useAppSelector((state) => state.wo);
  const { data } = useAppSelector((state) => state.customer);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const grandTotal = products.reduce(
    (sum, a) => sum + Number(a.total_price ?? 0),
    0,
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getCustomerList());
    }
  }, []);

  const { control, watch } = useForm<FormValue>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });

  function updateRow(item: ISparepart) {
    const disc_val = item.disc_value || 0;
    const price = Number(item.sell_price ?? 0);
    const qty = Number(item.qty ?? 0);

    const subTotal = price * qty - disc_val;
    const ppn = (subTotal * (item.tax || 0)) / 100;
    const total = subTotal + ppn;

    dispatch(
      setWoProducts({
        ...item,
        sell_price: String(price),
        qty: qty,
        disc_value: disc_val,
        total_price: total,
      }),
    );
  }

  return (
    <div className="w-full md:w-2/3 overflow-auto">
      <Card className="min-h-full flex flex-col w-full">
        <CardHeader>
          <div className="grid grid-cols-3 gap-2">
            <Controller
              control={control}
              name="no_po"
              render={({ field }) => (
                <Input
                  {...(field as any)}
                  label="No PO"
                  placeholder="#Order Customer"
                  size="sm"
                />
              )}
            />
            <Controller
              control={control}
              name="customer_id"
              render={({ field }) => (
                <Autocomplete
                  items={data}
                  label="Pelanggan"
                  placeholder="Pilih Pelanggan"
                  selectedKey={field.value}
                  size="sm"
                  onSelectionChange={field.onChange}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
          </div>
        </CardHeader>
        <CardBody className="gap-2 flex flex-col overflow-y-auto scrollbar-modern">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Produk</TableColumn>
              <TableColumn className="text-center">Harga</TableColumn>
              <TableColumn className="text-center">Qty</TableColumn>
              <TableColumn className="text-center">Disc %</TableColumn>
              <TableColumn className="text-center">Nilai Disc</TableColumn>
              <TableColumn className="text-center">PPN %</TableColumn>
              <TableColumn className="text-center">Jumlah</TableColumn>
              <TableColumn className="text-center w-20">Aksi</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="flex flex-col items-center text-center">
                    {/* Visual Indicator */}
                    <div className="p-4 bg-white rounded-full shadow-sm">
                      <PackageSearch className="text-slate-400" size={40} />
                    </div>

                    <div className="mt-2">
                      <p className="text-xl font-bold text-slate-800">
                        Produk Tidak Ditemukan
                      </p>
                      <p className="text-sm text-gray-500 max-w-64">
                        silahkan pilih product di sebelah kiri
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              {products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-col">
                      <Tooltip color="primary" content={item.name}>
                        <p className="font-semibold text-[11px] text-nowrap truncate">
                          {item.name}
                        </p>
                      </Tooltip>
                      <p className="text-[10px] text-gray-500 italic">
                        {item.code}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-28"
                      classNames={{
                        input: "text-right  text-[11px]",
                      }}
                      size="sm"
                      startContent={<p className="text-xs">Rp</p>}
                      value={Number(item.sell_price).toString()}
                      onInput={(val) =>
                        updateRow({
                          ...item,
                          sell_price: val.toString(),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-14"
                      classNames={{
                        input: "text-center text-[11px]",
                      }}
                      size="sm"
                      value={(item.qty || 0).toString()}
                      onInput={(qty) => {
                        if (qty >= 0) {
                          updateRow({
                            ...item,
                            qty,
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-12"
                      classNames={{
                        input: "text-center text-[11px]",
                      }}
                      size="sm"
                      value={item.disc_percentage?.toString()}
                      onInput={(discPerc) => {
                        const price = Number(item.sell_price ?? 0);
                        const calculatedDiscValue = (
                          (discPerc / 100) *
                          price
                        ).toFixed(2);

                        updateRow({
                          ...item,
                          disc_percentage: discPerc,
                          disc_value: Number(calculatedDiscValue),
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-24"
                      classNames={{
                        input: "text-end text-[11px]",
                      }}
                      size="sm"
                      startContent={<p className="text-xs">Rp</p>}
                      value={item.disc_value?.toString()}
                      onInput={(disc) => {
                        const price = Number(item.sell_price ?? 0);
                        let calculatedPercentage = 0;

                        if (price > 0) {
                          calculatedPercentage = (disc / price) * 100;
                        }
                        updateRow({
                          ...item,
                          disc_percentage: Number(
                            calculatedPercentage.toFixed(2),
                          ),
                          disc_value: disc,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-12"
                      classNames={{
                        input: "text-center text-[11px]",
                      }}
                      size="sm"
                      value={item.tax?.toString()}
                      onInput={(tax) =>
                        updateRow({
                          ...item,
                          tax,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      isDisabled
                      className="w-28"
                      classNames={{
                        input: "text-end text-[11px]",
                      }}
                      size="sm"
                      startContent={<p className="text-xs">Rp</p>}
                      value={String(item.total_price)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => dispatch(removeWoProduct(item))}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter className="px-5">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4 items-center">
              <p className="font-bold">Sub Total</p>
              <p className="font-semibold text-[18px]">
                {formatIDR(grandTotal)}
              </p>
            </div>
            <div>
              <ModalProductOrder
                customerId={watch("customer_id")!}
                disable={products.length === 0}
                poNo={watch("no_po") || ""}
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
