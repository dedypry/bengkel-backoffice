import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Search } from "lucide-react";

import { getPaymentListService } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import debounce from "@/utils/helpers/debounce";
import { IWOItems } from "@/utils/interfaces/IUser";
import { IService } from "@/utils/interfaces/IService";

interface Props {
  supplierId?: number;
  onSave: (data: IWOItems<IService>[]) => void;
  selectedIds: number[];
}
export default function AddWoItems({ supplierId, onSave, selectedIds }: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const { servicePayments: data } = useAppSelector((state) => state.wo);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState({
    supplier_id: supplierId,
    q: "",
  });
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  const servicePayments = data.filter((e) => !selectedIds.includes(e.id));

  useEffect(() => {
    if (supplierId) {
      setQuery((cur) => ({ ...cur, supplier_id: supplierId }));
    }
  }, [supplierId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getPaymentListService(query));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [query]);

  const searchDebounce = debounce(
    (q) => setQuery((cur) => ({ ...cur, q })),
    1000,
  );

  function handleSave() {
    if (selectedKeys === "all") {
      onSave(servicePayments);
    } else {
      const ids = Array.from(selectedKeys);

      const data = servicePayments.filter((e) => ids.includes(String(e.id)));

      onSave(data);
    }
  }

  return (
    <>
      <Modal
        isOpen={open}
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={setOpen}
      >
        <ModalContent>
          <ModalHeader>List Jasa Service</ModalHeader>
          <ModalBody>
            <Input
              defaultValue={query.q}
              placeholder="Cari no. transaksi, nama jasa.."
              startContent={<Search className="text-gray-600" size={18} />}
              onValueChange={searchDebounce}
            />
            <Table
              isHeaderSticky
              removeWrapper
              aria-label="Detail Jasa Table"
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              onSelectionChange={setSelectedKeys}
            >
              <TableHeader>
                <TableColumn>No. Trx</TableColumn>
                <TableColumn>Deskripsi</TableColumn>
                <TableColumn>Harga</TableColumn>
              </TableHeader>
              <TableBody items={servicePayments}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="text-xs">{item.trx_no}</p>
                      <p className="text-[10px] italic">
                        {dayjs(item.created_at).format("DD MMM YY")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{item.data.name}</p>
                      <p className="text-xs">{item.data.code}</p>
                    </TableCell>
                    <TableCell>{formatIDR(item.total_price)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <div className="flex gap-2">
              <Button size="sm">Batal</Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => {
                  handleSave();
                  setOpen(false);
                }}
              >
                Simpan
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button color="primary" size="sm" onPress={() => setOpen(true)}>
        Tambah Data
      </Button>
    </>
  );
}
