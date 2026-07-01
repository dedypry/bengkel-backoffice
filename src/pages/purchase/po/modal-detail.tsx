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

import { useAppSelector } from "@/stores/hooks";
import { dateFormat } from "@/utils/helpers/formater";
import { formatDate, formatIDR, formatNumber } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";

interface Props {
  open: boolean;
  onOpen: (val: boolean) => void;
}

export function ModalPoDetail({ open, onOpen }: Props) {
  const { detail } = useAppSelector((state) => state.po);
  const [downloadLoading, setDownloadLoading] = useState(false);

  if (!detail) return null;

  return (
    <Modal isOpen={open} size="5xl" onOpenChange={onOpen}>
      <ModalContent>
        <ModalHeader>Detail Pesanan Pembelian</ModalHeader>
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
              Download Invoice
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <InputDetail label="No. PO" value={detail.po_no} />
              <InputDetail
                label="Tanggal"
                value={dateFormat(detail.created_at!)}
              />
            </div>

            <div className="space-y-1">
              <InputDetail label="Supplier" value={detail.supplier?.name!} />
              <InputDetail label="Gudang" value={detail.warehouse?.name!} />
            </div>
          </div>

          <Table removeWrapper className="mt-5">
            <TableHeader>
              <TableColumn>Kode Barang</TableColumn>
              <TableColumn>Nama Barang</TableColumn>
              <TableColumn>Unit</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn className="text-right">Harga</TableColumn>
              <TableColumn className="text-center">Disc (%)</TableColumn>
              <TableColumn className="text-right">Disc (Rp)</TableColumn>
              <TableColumn className="text-center">PPN (%)</TableColumn>
              <TableColumn className="text-right">Total</TableColumn>
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
                label="Termin"
                value={`${formatNumber(detail.term_credit || 0)} Hari`}
              />
              <TextValue
                label="Tanggal Diminta"
                value={formatDate(detail.requested_date!)}
              />
              <TextValue label="Dibuat Oleh" value={detail.created_by?.name} />
              <TextValue
                label="Disetujui Oleh"
                value={detail.signature?.name}
              />
              <TextValue label="Catatan" value={detail.notes} />
            </div>
            <div className="space-y-1">
              <TextValue label="Subtotal" value={formatIDR(detail.sub_total)} />
              <TextValue
                label="Total Disc"
                value={formatIDR(detail.disc_value)}
              />
              <TextValue label="PPN" value={formatIDR(detail.tax!)} />
              <TextValue
                label="Biaya Lainnya"
                value={formatIDR(detail.other_fee!)}
              />
              <TextValue label="Grand Total" value={formatIDR(detail.total!)} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={() => onOpen(false)}>
            Tutup
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
