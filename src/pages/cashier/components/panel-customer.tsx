import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  CardFooter,
  Input,
  Chip,
  Button,
  Alert,
  Divider,
} from "@heroui/react";
import { Edit, Eye, Printer, Receipt, Trash2 } from "lucide-react";
import dayjs from "dayjs";

import { PaymentSchema, paymentSchema } from "./order-schema";
import { BillingSkeleton } from "./billing-skeleton";
import ModalProductOrder from "./modal-product-order";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getWo, getWoDetail } from "@/stores/features/work-order/wo-action";
import { buildCashierWoQuery } from "@/pages/cashier/cashier-query";
import InputNumber from "@/components/input-number";
import { formatIDR } from "@/utils/helpers/format";
import {
  removeRowPart,
  removeRowService,
  setWoService,
  setWoSparepart,
  updateRowPart,
  updateRowService,
} from "@/stores/features/work-order/wo-slice";
import { handleDownload } from "@/utils/helpers/global";
import ModalAddService from "@/pages/service/add/components/modal-add-service";
import StatusQueue from "@/components/status-queue";
import SumaryTable from "@/components/sumary";

export default function PanelCustomer() {
  const { t } = useTranslation();
  const { workOrder, woQuery, tabCashier, isLoadingDetail } = useAppSelector(
    (state) => state.wo,
  );
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDisable, setIsDisable] = useState(false);
  const hasSet = useRef(false);

  useEffect(() => {
    setIsDisable(workOrder?.status === "closed");
  }, [workOrder]);

  const { control, watch, handleSubmit, setValue, reset } =
    useForm<PaymentSchema>({
      resolver: zodResolver(paymentSchema),
      mode: "onChange",
      defaultValues: {
        payment_method: "CASH",
        other_fee: 0,
        disc_percentage: 0,
        disc_value: 0,
        tax: 0,
        total: 0,
      },
    });

  useEffect(() => {
    if (workOrder) {
      dispatch(
        setWoSparepart(
          (workOrder.spareparts || []).map((item) => ({
            ...item.data,
            qty: item.qty,
            price: item.price,
          })),
        ),
      );
      dispatch(
        setWoService(
          (workOrder.services || []).map((item) => ({
            ...item.data,
            supplier_id: item.supplier_id,
            qty: item.qty,
            price: item.price,
          })),
        ),
      );

      setValue("disc_percentage", workOrder.disc_percentage);
      setValue("disc_value", workOrder.disc_value);
      setValue("other_fee", workOrder.other_fee);
      setValue("tax", workOrder.ppn_percent);
    }
  }, [workOrder]);

  useEffect(() => {
    if (workOrder) {
      const sparepart = workOrder.spareparts || [];
      const services = workOrder.services || [];
      const data = [...sparepart, ...services];

      const rawSubTotal = data.reduce((acc, item) => {
        const price = Number(item.price ?? 0);
        const qty = Number(item.qty ?? 0);
        const disc = Number(item.disc_value ?? 0);

        return acc + price * qty - disc;
      }, 0);

      const discFinalNominal = Number(watch("disc_value") ?? 0);
      const otherFee = Number(watch("other_fee") ?? 0);

      const discRatio = rawSubTotal > 0 ? discFinalNominal / rawSubTotal : 0;

      let totalTax = 0;

      data.forEach((item) => {
        const qty = Number(item.qty ?? 0);
        const price = Number(item.price ?? 0);
        const disc = Number(item.disc_value ?? 0);
        const itemAmount = price * qty - disc;

        const taxRate = Number(item.tax_percentage ?? 0) / 100;

        if (taxRate > 0) {
          const itemAllocatedDisc = itemAmount * discRatio;
          const itemNetForTax = itemAmount - itemAllocatedDisc;

          totalTax += itemNetForTax * taxRate;
        }
      });

      const grandTotal = rawSubTotal - discFinalNominal + totalTax + otherFee;

      setValue("sub_total", rawSubTotal);
      setValue("tax", Math.round(totalTax));
      setValue("total", Math.round(grandTotal));
      setValue("customer_id", workOrder.customer_id);
    }
  }, [workOrder, watch("disc_value"), watch("other_fee")]);

  async function onSubmit(data: PaymentSchema) {
    if (!workOrder) return;
    setLoading(true);

    const payload = {
      woId: workOrder.id,
      ...data,
      products: [
        ...(workOrder.services || []).map((item) => ({
          id: item.id,
          product_id: item.data.id,
          price: Number(item.price),
          qty: Number(item.qty),
          total_price: Number(item.total_price),
          tax: Number(item.tax_percentage),
          disc_percentage: Number(item.disc_percentage),
          disc_value: Number(item.disc_value),
          type: "service",
        })),
        ...(workOrder.spareparts || []).map((item) => ({
          id: item.id,
          product_id: item.data.id,
          price: Number(item.price),
          qty: Number(item.qty),
          total_price: Number(item.total_price),
          tax: Number(item.tax_percentage),
          disc_percentage: Number(item.disc_percentage),
          disc_value: Number(item.disc_value),
          type: "sparepart",
        })),
      ],
    };

    if (data.proof_image && data.proof_image.length > 0) {
      if (data.proof_image[0] instanceof File) {
        const photo = await uploadFile(data.proof_image[0]);

        setValue("proof_image", [photo]);
        payload.proof_image = photo;
      } else {
        payload.proof_image = data.proof_image[0];
      }
    }

    http
      .post("/payments", payload)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getWoDetail(workOrder.id.toString()));
        const refreshParams = buildCashierWoQuery(tabCashier as any, woQuery);

        if (refreshParams) {
          dispatch(getWo(refreshParams as any));
        }
        reset();
        hasSet.current = false;
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  // function handleSendMail(id: number) {
  //   http
  //     .post(`/invoices/${id}/send`)
  //     .then(({ data }) => {
  //       notify(data.message);
  //     })
  //     .catch((err) => notifyError(err));
  // }

  if (isLoadingDetail) return <BillingSkeleton />;

  return (
    <div className="w-full md:w-2/3 overflow-y-auto scrollbar-modern">
      {workOrder?.id ? (
        <Card className="min-h-full h-full">
          <CardHeader className="w-full flex justify-between">
            <div>
              <p className="text-sm font-bold">
                {t("cashier.panel.bill_detail", { trxNo: workOrder.trx_no })}
              </p>
              <p className="text-sm font-bold">
                {t("cashier.panel.plate_no", {
                  plate: workOrder.vehicle.plate_number,
                })}
              </p>
            </div>
            <div className="flex gap-2">
              {!isDisable && <ModalAddService isSave />}
              {workOrder?.status === "closed" && isDisable && (
                <Button
                  className="text-white font-semibold uppercase"
                  color="warning"
                  size="sm"
                  startContent={<Edit size={18} />}
                  onPress={() => setIsDisable(false)}
                >
                  {t("cashier.panel.edit")}
                </Button>
              )}

              <Button
                className="text-white font-semibold uppercase"
                color="success"
                size="sm"
                startContent={<Eye size={18} />}
                onPress={() => navigate(`/service/queue/${workOrder.id}`)}
              >
                {t("cashier.panel.detail")}
              </Button>

              <Button
                isIconOnly
                isLoading={printLoading}
                size="sm"
                variant="bordered"
                onPress={() =>
                  handleDownload(
                    `/invoices/${workOrder.id}`,
                    workOrder.trx_no,
                    true,
                    setPrintLoading,
                  )
                }
              >
                <Printer className="size-5" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="gap-2 flex flex-col overflow-y-auto scrollbar-modern max-h-[calc(100vh-360px)]">
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>{t("cashier.table.service_desc")}</TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.sell_price")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.disc_pct")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.disc_value")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.amount")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.tax_pct")}
                </TableColumn>
                <TableColumn> </TableColumn>
              </TableHeader>
              <TableBody>
                {(workOrder.services || []).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[150px]  truncate whitespace-nowrap">
                      <Tooltip color="primary" content={item.data.name}>
                        <p className="text-xs">{item.data.name}</p>
                      </Tooltip>
                      <p className="text-[10px]">
                        {item.data.code}{" "}
                        <span>
                          / {item.data.estimated_duration}{" "}
                          {item.data.estimated_type}{" "}
                        </span>{" "}
                      </p>
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.price) as any}
                        onInput={(price) => {
                          dispatch(
                            updateRowService({
                              ...item,
                              price: String(price),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={100}
                        size="sm"
                        value={Number(item.disc_percentage) as any}
                        onInput={(disc_percentage) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          const calculatedDiscValue = (
                            (disc_percentage / 100) *
                            price
                          ).toFixed(2);

                          dispatch(
                            updateRowService({
                              ...item,
                              disc_percentage: disc_percentage,
                              disc_value: Number(calculatedDiscValue),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={
                          Number(item.price ?? 0) * Number(item.qty ?? 0)
                        }
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.disc_value) as any}
                        onInput={(dic_value) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          let calculatedPercentage = 0;

                          if (price > 0) {
                            calculatedPercentage = (dic_value / price) * 100;
                          }
                          dispatch(
                            updateRowService({
                              ...item,
                              disc_percentage: Number(
                                calculatedPercentage.toFixed(2),
                              ),
                              disc_value: dic_value,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        isDisabled
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.total_price) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        value={Number(item.tax_percentage) as any}
                        onInput={(tax_percentage) => {
                          dispatch(
                            updateRowService({
                              ...item,
                              tax_percentage,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {!isDisable && (
                        <Trash2
                          className="cursor-pointer hover:text-danger"
                          size={15}
                          onClick={() => dispatch(removeRowService(item))}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Table removeWrapper className="mt-1">
              <TableHeader>
                <TableColumn>{t("cashier.table.part_desc")}</TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.sell_price")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.qty")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.disc_pct")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.disc_value")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.amount")}
                </TableColumn>
                <TableColumn className="text-center">
                  {t("cashier.table.tax_pct")}
                </TableColumn>
                <TableColumn> </TableColumn>
              </TableHeader>
              <TableBody>
                {(workOrder.spareparts || []).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[150px] truncate whitespace-nowrap">
                      <Tooltip color="primary" content={item.data.name}>
                        <p className="text-xs">{item.data.name}</p>
                      </Tooltip>
                      <p className="text-[10px]">{item.data.code} </p>
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.price) as any}
                        onInput={(price) => {
                          dispatch(
                            updateRowPart({
                              ...item,
                              price: String(price),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        value={Number(item.qty) as any}
                        onInput={(qty) => {
                          dispatch(
                            updateRowPart({
                              ...item,
                              qty,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={100}
                        size="sm"
                        value={Number(item.disc_percentage) as any}
                        onInput={(disc_percentage) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          const calculatedDiscValue = (
                            (disc_percentage / 100) *
                            price
                          ).toFixed(2);

                          dispatch(
                            updateRowPart({
                              ...item,
                              disc_percentage: disc_percentage,
                              disc_value: Number(calculatedDiscValue),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={
                          Number(item.price ?? 0) * Number(item.qty ?? 0)
                        }
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.disc_value) as any}
                        onInput={(dic_value) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          let calculatedPercentage = 0;

                          if (price > 0) {
                            calculatedPercentage = (dic_value / price) * 100;
                          }

                          dispatch(
                            updateRowPart({
                              ...item,
                              disc_percentage: Number(
                                calculatedPercentage.toFixed(2),
                              ),
                              disc_value: dic_value,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        isDisabled
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.total_price) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        value={Number(item.tax_percentage) as any}
                        onInput={(tax_percentage) => {
                          dispatch(
                            updateRowPart({
                              ...item,
                              tax_percentage,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {!isDisable && (
                        <Trash2
                          className="cursor-pointer hover:text-danger"
                          size={15}
                          onClick={() => dispatch(removeRowPart(item))}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
          <Divider />
          <CardFooter className="px-5 flex flex-col">
            <div className="grid grid-cols-3 w-full gap-3">
              <div className="col-span-2 space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <Input
                      isDisabled
                      classNames={{
                        label: "w-24",
                        mainWrapper: "w-34",
                      }}
                      label={t("cashier.panel.customer")}
                      labelPlacement="outside-left"
                      placeholder={t("cashier.panel.order_placeholder")}
                      size="sm"
                      value={workOrder.customer.name}
                    />
                  </div>
                  <div className="ml-2">
                    <StatusQueue wo={workOrder} />
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="w-24 text-xs pl-2">{t("cashier.panel.mechanic")}</p>
                  <div className="flex flex-wrap gap-1">
                    {(workOrder.mechanics || []).map((item) => (
                      <Chip key={item.id} size="sm" variant="bordered">
                        {item.name}
                      </Chip>
                    ))}
                  </div>
                </div>

                {isDisable && (
                  <Alert className="mb-2 mt-5" color="success" variant="faded">
                    <div className="w-full">
                      <p className="font-semibold text-sm">
                        {t("cashier.panel.payment_success", {
                          ref: workOrder.payment?.reference_no,
                        })}
                      </p>

                      <Divider className="my-1 opacity-50" />

                      <div className="grid grid-cols-2 gap-y-1 mt-2">
                        <p className="font-bold text-xs">
                          {t("cashier.panel.payment_method", {
                            method: workOrder.payment?.method || "CASH",
                          })}
                        </p>
                        <p className="text-xs text-right">
                          {formatIDR(workOrder.payment?.amount)}
                        </p>

                        <p className="font-bold text-xs">{t("cashier.panel.time")}</p>
                        <p className="text-xs text-right">
                          {dayjs(
                            workOrder.payment?.payment_date ||
                              workOrder.updated_at,
                          ).format("DD MMM YY | HH:mm")}
                        </p>
                      </div>
                    </div>
                  </Alert>
                )}
              </div>
              <SumaryTable
                control={control}
                isDisable={isDisable}
                setValue={setValue}
                watch={watch}
              />
            </div>
            {!isDisable && (
              <div className="w-full flex justify-between mt-2 items-center">
                <p className="text-md font-bold">
                  {t("cashier.panel.total", {
                    amount: formatIDR(watch("total")),
                  })}
                </p>
                <ModalProductOrder
                  control={control}
                  isDisable={!workOrder}
                  loading={loading}
                  setValue={setValue}
                  watch={watch}
                  onSubmit={handleSubmit(onSubmit)}
                />
              </div>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="h-full flex flex-col items-center justify-center text-gray-500 border border-dashed rounded-xl">
          <div className="p-6 bg-slate-100 rounded-full mb-4">
            <Receipt className="w-12 h-12" />
          </div>
          <p>{t("cashier.panel.select_queue")}</p>
        </Card>
      )}
    </div>
  );
}
