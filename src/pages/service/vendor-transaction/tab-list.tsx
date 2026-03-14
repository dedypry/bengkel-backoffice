import {
  Card,
  CardHeader,
  Input,
  CardBody,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CardFooter,
  Table,
} from "@heroui/react";
import { EyeIcon, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import DetailTrx from "./detail";

import { CustomPagination } from "@/components/custom-pagination";
import PageSize from "@/components/page-size";
import {
  getVendorTransaction,
  getVendorTrxDetail,
} from "@/stores/features/vendor/vendor-action";
import { setVendorQuery } from "@/stores/features/vendor/vendor-slice";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import debounce from "@/utils/helpers/debounce";
import { formatNumber } from "@/utils/helpers/format";

export default function TabList() {
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
                endContent={<Search className="text-gray-500" />}
                placeholder="Cari Supplier..."
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
            <TableBody emptyContent={<p>Belum ada data</p>}>
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
