import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Divider,
} from "@heroui/react";
import { Download } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/stores/hooks";
import { dateFormat } from "@/utils/helpers/formater";
import { formatDate, formatIDR, formatNumber } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";

interface Props {
  open: boolean;
  onOpen: (val: boolean) => void;
}

export function ModalPoDetail({ open, onOpen }: Props) {
  const { t } = useTranslation();
  const { detail } = useAppSelector((state) => state.po);
  const [downloadLoading, setDownloadLoading] = useState(false);

  if (!detail) return null;

  return (
    <Modal
      isOpen={open}
      scrollBehavior="outside"
      size="5xl"
      onOpenChange={onOpen}
    >
      <ModalContent>
        <ModalHeader>{t("purchase.po.detail_title")}</ModalHeader>
        <ModalBody>
          <div className="flex justify-end">
            <Button
              color="success"
              isLoading={downloadLoading}
              size="sm"
              startContent={<Download size={18} />}
              variant="bordered"
              onPress={() =>
                handleDownload(
                  `/po/invoice/download/${detail.id}`,
                  detail.po_no,
                  true,
                  setDownloadLoading,
                )
              }
            >
              {t("purchase.shared.download_invoice")}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <InputDetail
                label={t("purchase.po.detail.po_no")}
                value={detail.po_no}
              />
              <InputDetail
                label={t("purchase.po.detail.date")}
                value={dateFormat(detail.created_at!)}
              />
            </div>

            <div className="space-y-1">
              <InputDetail
                label={t("purchase.po.detail.supplier")}
                value={detail.supplier?.name!}
              />
              <InputDetail
                label={t("purchase.po.detail.warehouse")}
                value={detail.warehouse?.name!}
              />
            </div>
          </div>

          <Table removeWrapper className="mt-5">
            <TableHeader>
              <TableColumn>{t("purchase.shared.table.code")}</TableColumn>
              <TableColumn>{t("purchase.shared.table.name")}</TableColumn>
              <TableColumn>{t("purchase.shared.table.unit")}</TableColumn>
              <TableColumn>{t("purchase.shared.table.quantity")}</TableColumn>
              <TableColumn className="text-right">
                {t("purchase.shared.table.price")}
              </TableColumn>
              <TableColumn className="text-center">
                {t("purchase.shared.table.disc_pct")}
              </TableColumn>
              <TableColumn className="text-right">
                {t("purchase.shared.table.disc_value")}
              </TableColumn>
              <TableColumn className="text-center">
                {t("purchase.shared.table.ppn_pct")}
              </TableColumn>
              <TableColumn className="text-right">
                {t("purchase.shared.total")}
              </TableColumn>
            </TableHeader>

            <TableBody>
              {(detail.items || []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.code}</TableCell>
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell>{item.product?.unit}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell className="text-right">
                    {formatIDR(item.price!)}
                  </TableCell>
                  <TableCell>{Number(item.disc_percentage)} %</TableCell>
                  <TableCell className="text-right">
                    {formatIDR(item.disc_value!)}
                  </TableCell>
                  <TableCell>{Number(item.ppn_percentage)} %</TableCell>
                  <TableCell className="text-right">
                    {formatIDR(item.total!)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider />
          <div className="grid grid-cols-4 gap-2 mt-5">
            <div className="col-span-3 space-y-1 flex flex-col justify-end">
              <TextValue
                label={t("purchase.po.detail.term")}
                value={`${formatNumber(detail.term_credit || 0)} ${t("purchase.shared.days")}`}
              />
              <TextValue
                label={t("purchase.po.detail.requested_date")}
                value={formatDate(detail.requested_date!)}
              />
              <TextValue
                label={t("purchase.po.detail.created_by")}
                value={detail.created_by?.name}
              />
              <TextValue
                label={t("purchase.po.detail.approved_by")}
                value={detail.signature?.name}
              />
              <TextValue
                label={t("purchase.po.detail.notes")}
                value={detail.notes}
              />
            </div>
            <div className="space-y-1">
              <TextValue
                label={t("purchase.shared.subtotal")}
                value={formatIDR(detail.sub_total)}
              />
              <TextValue
                label={t("purchase.po.detail.total_disc")}
                value={formatIDR(detail.disc_value)}
              />
              <TextValue
                label={t("purchase.shared.ppn")}
                value={formatIDR(detail.tax!)}
              />
              <TextValue
                label={t("purchase.po.detail.other_cost")}
                value={formatIDR(detail.other_fee!)}
              />
              <TextValue
                label={t("purchase.shared.grand_total")}
                value={formatIDR(detail.total!)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={() => onOpen(false)}>
            {t("common.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function InputDetail({ label, value }: { label: string; value?: any }) {
  return (
    <Input
      isDisabled
      classNames={{ label: "w-28 text-sm" }}
      label={label}
      labelPlacement="outside-left"
      size="sm"
      value={value || ""}
    />
  );
}

function TextValue({ label, value }: { label: string; value?: any }) {
  return (
    <div className="flex flex-row">
      <span className="text-sm text-gray-500 w-32">{label}</span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  );
}
