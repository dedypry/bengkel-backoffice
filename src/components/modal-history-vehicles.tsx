import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Download } from "lucide-react";
import { useState } from "react";

import { useAppSelector } from "@/stores/hooks";
import { dateTimeFormat } from "@/utils/helpers/formater";
import { formatNumber } from "@/utils/helpers/format";
import { ICustomer, IVehicle } from "@/utils/interfaces/IUser";
import { handleDownload } from "@/utils/helpers/global";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  vehicle?: IVehicle;
  customer?: ICustomer;
}

export default function ModalHistotyVehicles({
  open,
  setOpen,
  vehicle,
  customer,
}: Props) {
  const { histories } = useAppSelector((state) => state.vehicle);
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={open} size="4xl" onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader>Riwayat Service Kendaraan</ModalHeader>
        <ModalBody>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <Input
                isDisabled
                classNames={{
                  label: "w-20",
                }}
                label="Pemilik"
                labelPlacement="outside-left"
                size="sm"
                value={customer?.name}
              />
              <Input
                isDisabled
                classNames={{
                  label: "w-20",
                }}
                label="No Polisi"
                labelPlacement="outside-left"
                size="sm"
                value={vehicle?.plate_number}
              />
            </div>
            <Button
              className="text-white"
              color="success"
              isLoading={loading}
              size="sm"
              startContent={!loading && <Download size={18} />}
              onPress={() =>
                handleDownload(
                  `/vehicles/${vehicle?.plate_number}?type=pdf`,
                  `history-${vehicle?.plate_number}`,
                  true,
                  setLoading,
                )
              }
            >
              Download PDF
            </Button>
          </div>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Tanggal</TableColumn>
              <TableColumn>No. Service</TableColumn>
              <TableColumn>Keluhan</TableColumn>
              <TableColumn>KM</TableColumn>
              <TableColumn>KM Selanjutnya</TableColumn>
            </TableHeader>
            <TableBody>
              {histories.map((item, i) => (
                <>
                  <TableRow
                    key={i}
                    className={i > 0 ? "border-t border-t-gray-300" : ""}
                  >
                    <TableCell>{dateTimeFormat(item.created_at)}</TableCell>
                    <TableCell>{item.trx_no}</TableCell>
                    <TableCell>{item.complaints}</TableCell>
                    <TableCell>{formatNumber(item.current_km)}</TableCell>
                    <TableCell>{formatNumber(item.next_km)}</TableCell>
                  </TableRow>
                  <TableRow key={`header-serv-${i}`}>
                    <TableCell className="font-bold italic">No</TableCell>
                    <TableCell className="font-bold italic">
                      Kode Jasa
                    </TableCell>
                    <TableCell className="font-bold italic">
                      Nama Jasa
                    </TableCell>
                    <TableCell className="font-bold italic">Qty</TableCell>
                    <TableCell className="font-bold italic">Satuan</TableCell>
                  </TableRow>
                  {item.services.map((serv, s) => (
                    <TableRow key={`item-serv-${s}`}>
                      <TableCell>{s + 1}</TableCell>
                      <TableCell>{serv.data.code}</TableCell>
                      <TableCell>{serv.data.name}</TableCell>
                      <TableCell>{Number(serv.qty)}</TableCell>
                      <TableCell>JOB</TableCell>
                    </TableRow>
                  ))}

                  <TableRow
                    key={`header-serv-${i}`}
                    className="border-b border-b-gray-200"
                  >
                    <TableCell className="font-bold italic">No</TableCell>
                    <TableCell className="font-bold italic">
                      Kode Part
                    </TableCell>
                    <TableCell className="font-bold italic">
                      Nama Part
                    </TableCell>
                    <TableCell className="font-bold italic">Qty</TableCell>
                    <TableCell className="font-bold italic">Satuan</TableCell>
                  </TableRow>
                  {(item.spareparts || []).map((part, p) => (
                    <TableRow key={`item-part-${p}`}>
                      <TableCell>{p + 1}</TableCell>
                      <TableCell>{part.data.code}</TableCell>
                      <TableCell>{part.data.name}</TableCell>
                      <TableCell>{Number(part.qty)}</TableCell>
                      <TableCell>{part.data.unit}</TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
