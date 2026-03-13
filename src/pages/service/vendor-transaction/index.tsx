import { EyeIcon, Handshake } from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import DetailTrx from "./detail";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatNumber } from "@/utils/helpers/format";
import {
  getVendorTransaction,
  getVendorTrxDetail,
} from "@/stores/features/vendor/vendor-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setVendorQuery } from "@/stores/features/vendor/vendor-slice";
import debounce from "@/utils/helpers/debounce";
import PageSize from "@/components/page-size";

export default function VendorTrxPage() {
  const { transactions, vendorQuery } = useAppSelector((state) => state.vendor);
  const [search, setSearch] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;

      dispatch(getVendorTransaction(vendorQuery));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [vendorQuery]);

  const searchDebounce = debounce((q) => dispatch(setVendorQuery({ q })), 1000);

  function getDetail(id: number) {
    dispatch(getVendorTrxDetail(id));
  }

  return (
    <>
      <DetailTrx open={openDetail} setOpen={setOpenDetail} />
      <HeaderAction
        leadIcon={Handshake}
        subtitle="Layanan Pihak Ketiga"
        title="Daftar jasa yang dikelola oleh vendor."
      />
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between">
            <PageSize
              selectedKeys={[vendorQuery.pageSize.toString()]}
              onChange={(e) =>
                dispatch(setVendorQuery({ pageSize: e.target.value }))
              }
            />
            <div className="flex gap-2 w-sm">
              <Input
                placeholder="Cari Supplier"
                value={search}
                onValueChange={(val) => {
                  setSearch(val);
                  searchDebounce(val);
                }}
              />
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Supplier</TableColumn>
              <TableColumn>Kode</TableColumn>
              <TableColumn>Total Items</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody>
              {(transactions?.data || []).map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{formatNumber(item.total_item)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      isIconOnly
                      color="success"
                      radius="full"
                      size="sm"
                      variant="bordered"
                      onPress={() => {
                        getDetail(item.id);
                        setOpenDetail(true);
                      }}
                    >
                      <EyeIcon size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter>
          <div className="w-full">
            <CustomPagination
              meta={transactions?.meta!}
              onPageChange={(page) => dispatch(setVendorQuery({ page }))}
            />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
