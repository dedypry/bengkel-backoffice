import type { IProduct } from "@/utils/interfaces/IProduct";

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
import { Search, X } from "lucide-react";

import { getProduct } from "@/stores/features/product/product-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { CustomPagination } from "@/components/custom-pagination";
import { setProductQuery } from "@/stores/features/product/product-slice";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import debounce from "@/utils/helpers/debounce";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  onProducts: (val: IProduct[]) => void;
}
export default function ModalPart({ open, setOpen, onProducts }: Props) {
  const { productQuery, products } = useAppSelector((state) => state.product);
  const [selectionKeys, setSelectionKeys] = useState<Selection>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(productQuery.q || "");
  const dispatch = useAppDispatch();

  const hasFetch = useRef(false);

  useEffect(() => {
    if (hasFetch.current) return;
    hasFetch.current = true;
    dispatch(
      getProduct({
        ...productQuery,
        noStats: 1,
      }),
    );
    setTimeout(() => {
      hasFetch.current = false;
    }, 1000);
  }, [productQuery]);

  function onSubmit() {
    let productIds = "";

    if (selectionKeys instanceof Set) {
      productIds = Array.from(selectionKeys).join(",");
    } else if (Array.isArray(selectionKeys)) {
      productIds = selectionKeys.join(",");
    } else {
      productIds = selectionKeys || "";
    }

    http
      .get("/products/get-by-ids", { params: { ids: productIds } })
      .then(({ data }) => {
        onProducts(data);
        setLoading(false);
        setOpen(false);
      })
      .catch(notifyError)
      .finally(() => {
        setLoading(false);
      });
  }

  const searchProduct = debounce((q) => dispatch(setProductQuery({ q })), 500);

  return (
    <Modal isOpen={open} size="5xl" onClose={() => setOpen(false)}>
      <ModalContent>
        <ModalHeader>List Sparepart</ModalHeader>
        <ModalBody>
          <Input
            endContent={
              search && (
                <X
                  className="cursor-pointer"
                  size={18}
                  onClick={() => {
                    dispatch(setProductQuery({ q: "" }));
                    setSearch("");
                  }}
                />
              )
            }
            placeholder="Cari sparepart"
            startContent={<Search size={18} />}
            value={search}
            onValueChange={(val) => {
              setSearch(val);
              searchProduct(val);
            }}
          />
          <Table
            removeWrapper
            bottomContent={
              <CustomPagination
                meta={products?.meta as any}
                onPageChange={(page) => dispatch(setProductQuery({ page }))}
              />
            }
            selectedKeys={selectionKeys}
            selectionMode="multiple"
            onSelectionChange={setSelectionKeys}
          >
            <TableHeader>
              <TableColumn>Kode Barang</TableColumn>
              <TableColumn>Nama Barang</TableColumn>
              <TableColumn>Stok</TableColumn>
              <TableColumn>Harga</TableColumn>
              <TableColumn>Satuan</TableColumn>
              <TableColumn>Rak</TableColumn>
            </TableHeader>
            <TableBody>
              {(products?.data || [])?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.purchase_price}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={loading}
            size="sm"
            variant="bordered"
            onPress={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button
            color="primary"
            isLoading={loading}
            size="sm"
            onPress={onSubmit}
          >
            Tambah
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
