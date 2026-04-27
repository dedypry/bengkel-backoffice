import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Edit, Search, Trash2 } from "lucide-react";

import ModalAdd from "./components/add-modal";

import HeaderAction from "@/components/header-action";
import {
  getMasterVehicle,
  getVehicle,
  getVehicleListMaster,
} from "@/stores/features/vehicle/vehicle-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { IVehicleItem } from "@/utils/interfaces/IMaster";
import { http } from "@/utils/libs/axios";
import { CustomPagination } from "@/components/custom-pagination";
import PageSize from "@/components/page-size";
import debounce from "@/utils/helpers/debounce";

export default function VehiclePage() {
  const { vehicleMaster, master } = useAppSelector((state) => state.vehicle);
  const { company } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<IVehicleItem>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState({
    q: "",
    page: 1,
    pageSize: 10,
    merk: "",
  });
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getVehicleListMaster(query));
      dispatch(getMasterVehicle());

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, dispatch]);

  function deleteItem(id: number) {
    http
      .delete(`/vehicle-master/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getVehicleListMaster(query));
      })
      .catch(notifyError);
  }

  function handleSearch(key: string, value: any) {
    const payload = {
      ...query,
      [key]: value,
    };

    setQuery(payload);
    dispatch(getVehicleListMaster(payload));
  }

  const searchVehicle = debounce((q) => handleSearch("q", q), 500);

  return (
    <>
      <ModalAdd
        data={data}
        open={open}
        setOpen={setOpen}
        onRefresh={() => dispatch(getVehicleListMaster(query))}
      />

      <HeaderAction
        actionTitle="Tambah Merk dan Type"
        subtitle="Daftar Merk dan Type Kendaraan"
        title="Daftar Kendaraan"
        onAction={() => {
          setOpen(true);
          setData(undefined);
        }}
      />

      <Table
        bottomContent={
          <CustomPagination
            meta={vehicleMaster?.meta!}
            onPageChange={(page) => {
              setQuery({ ...query, page });
              dispatch(
                getVehicle({
                  ...query,
                  page,
                }),
              );
            }}
          />
        }
        topContent={
          <div className="flex gap-4 flex-col md:flex-row">
            <PageSize
              className="w-52"
              label="Page Size"
              selectedKeys={[query.pageSize.toString()]}
              onSelectionChange={(key) => {
                const val = Array.from(key)[0];

                handleSearch("pageSize", val);
              }}
            />
            <Autocomplete
              className="w-56"
              defaultItems={master}
              label="Merk"
              onSelectionChange={(val) => {
                console.log(val);
                handleSearch("merk", val);
              }}
            >
              {(item) => (
                <AutocompleteItem key={item.type}>{item.type}</AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              label="Search"
              placeholder="Cari Merk/Type"
              startContent={<Search className="text-gray-500" />}
              value={query.q}
              onValueChange={(val) => {
                setQuery({
                  ...query,
                  q: val,
                });
                searchVehicle(val);
              }}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Merk</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>CC</TableColumn>
          <TableColumn className="w-32"> </TableColumn>
        </TableHeader>
        <TableBody>
          {(vehicleMaster?.data || []).map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.type || "Tidak Ada Nama"}</TableCell>
              <TableCell>{row.merk}</TableCell>
              <TableCell>{row.cc}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  onPress={() => {
                    setData(row);
                    setOpen(true);
                  }}
                >
                  <Edit className="text-warning" size={18} />
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  onPress={() => confirmSweat(() => deleteItem(row.id))}
                >
                  <Trash2 className="text-danger" size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
