import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Car,
  Users,
  EyeIcon,
  Download,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Input,
  Chip,
  Avatar,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCustomer } from "@/stores/features/customer/customer-action";
import { getInitials, handleDownloadExcel } from "@/utils/helpers/global";
import { CustomPagination } from "@/components/custom-pagination";
import { setCustomerQuery } from "@/stores/features/customer/customer-slice";
import debounce from "@/utils/helpers/debounce";
import TableAction from "@/components/table-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { IPagination } from "@/utils/interfaces/IPagination";
import { ICustomer } from "@/utils/interfaces/IUser";
import PageSize from "@/components/page-size";

export default function MasterCustomerPage() {
  const { company } = useAppSelector((state) => state.auth);
  const { customers: cust, query } = useAppSelector((state) => state.customer);
  const customers = cust as IPagination<ICustomer>;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const custQuery = { ...query, isVehicle: true };

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getCustomer(custQuery));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [query, company, dispatch]);

  const searchDebounce = debounce((val) => {
    dispatch(setCustomerQuery({ q: val }));
  }, 800);

  function handleDelete(id: number) {
    http
      .delete(`/customers/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getCustomer(custQuery));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header - Menggunakan komponen yang sudah kita refaktor sebelumnya */}
      <HeaderAction
        actionContent={
          <div className="flex gap-2">
            <Button
              className="text-white"
              color="success"
              size="sm"
              startContent={<Download size={15} />}
              onPress={() =>
                handleDownloadExcel(
                  "/customers/export-excel",
                  custQuery,
                  "list-customer",
                )
              }
            >
              Download Excel
            </Button>
            <Button
              as={Link}
              color="primary"
              size="sm"
              startContent={<UserPlus size={15} />}
              to="/master/customers/create"
            >
              Tambah Pelanggan
            </Button>
          </div>
        }
        leadIcon={Users}
        subtitle="Kelola informasi kontak dan profil pemilik kendaraan bengkel."
        title="Database Pelanggan"
      />

      {/* Filters Area */}

      {/* Table Section */}
      <Card>
        <CardHeader className="flex justify-between">
          <PageSize
            selectedKeys={[query.pageSize.toString()]}
            onSelectionChange={(key) => {
              const val = Array.from(key)[0];

              dispatch(
                setCustomerQuery({
                  ...query,
                  pageSize: val,
                }),
              );
            }}
          />
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              fullWidth
              isClearable
              placeholder="Cari nama, email, atau nomor telepon..."
              startContent={<Search className="text-gray-400" size={18} />}
              onChange={(e) => searchDebounce(e.target.value)}
            />
            <Autocomplete
              classNames={{
                clearButton: "text-gray-500",
              }}
              defaultItems={customers?.stats?.vehicles || []}
              placeholder="Pilih Jenis Kendaraan"
              selectedKey={query.model}
              onSelectionChange={(val) => {
                const find = customers?.stats?.vehicles.find(
                  (e: any) => e.model === val,
                );

                dispatch(
                  setCustomerQuery({
                    model: find?.model,
                    brand: find?.brand,
                  }),
                );
              }}
            >
              {(item: any) => (
                <AutocompleteItem
                  key={item.model}
                  textValue={`${item.brand} ${item.model}`}
                >
                  {item?.brand?.toUpperCase()} {item?.model?.toUpperCase()}
                </AutocompleteItem>
              )}
            </Autocomplete>
            {/* <Select
              aria-label="Filter Status"
              className="w-full md:w-56"
              classNames={{
                trigger:
                  "border-gray-200 hover:border-gray-400 focus-within:border-gray-800 shadow-none",
                value: "text-small font-bold text-gray-600",
              }}
              placeholder="Pilih Jenis Kendaraan"
              selectedKeys={[vehileIndex.toString()]}
              startContent={<Info className="text-gray-400" size={16} />}
              variant="bordered"
              onSelectionChange={(key) => {
                const val = Array.from(key)[0];
                const find = customers?.stats?.vehicles?.[val];

                console.log(find);
                dispatch(
                  setCustomerQuery({
                    model: find.model,
                    brand: find.brand,
                  }),
                );
                setVehicleIndex(Number(val));
              }}
            >
              {(customers?.stats?.vehicles || []).map(
                (item: IVehicle, i: number) => (
                  <SelectItem key={i} textValue={`${item.brand} ${item.model}`}>
                    {item.brand.toUpperCase()} {item.model.toUpperCase()}
                  </SelectItem>
                ),
              )}
            </Select> */}
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper aria-label="Tabel Pelanggan">
            <TableHeader>
              <TableColumn>PROFIL PELANGGAN</TableColumn>
              <TableColumn>KONTAK</TableColumn>
              <TableColumn>ALAMAT</TableColumn>
              <TableColumn align="center">UNIT KENDARAAN</TableColumn>
              {/* <TableColumn align="center">STATUS</TableColumn> */}
              <TableColumn align="end"> </TableColumn>
            </TableHeader>
            <TableBody emptyContent="Data pelanggan tidak ditemukan">
              {(customers?.data || []).map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        isBordered
                        className="bg-gray-100"
                        name={getInitials(customer.name)}
                        radius="lg"
                        size="sm"
                        src={customer?.profile?.photo_url || ""}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-small uppercase tracking-tight">
                          {customer.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono italic">
                          ID: {customer.nik_ktp || "-"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-tiny text-gray-500">
                        <Mail className="size-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-tiny text-gray-700 font-bold">
                        <Phone className="size-3 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-start gap-1 max-w-[180px]">
                      <MapPin className="size-3 text-gray-400 mt-1 shrink-0" />
                      <span className="text-tiny text-gray-500 line-clamp-2 leading-relaxed">
                        {customer.profile?.address || "Alamat belum diisi"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-start">
                    {customer.vehicles?.map((e, i) => {
                      if (i === 0) {
                        return (
                          <div key={e.id} className="flex flex-col gap-2">
                            <p>
                              {e.brand.toUpperCase()} {e.model.toUpperCase()}
                            </p>
                            <div className="flex w-full gap-2">
                              <Chip
                                startContent={<Car size={18} />}
                                variant="flat"
                              >
                                {e.plate_number}
                              </Chip>
                              {customer.total_vehicle > 1 && (
                                <Popover>
                                  <PopoverTrigger>
                                    <Chip
                                      className="cursor-pointer text-white"
                                      color="warning"
                                      size="sm"
                                    >
                                      + {customer.total_vehicle - 1}
                                    </Chip>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    {customer.vehicles?.map((ve) => (
                                      <div
                                        key={ve.id}
                                        className="flex gap-2 p-1 justify-start items-start text-start w-xs"
                                      >
                                        <p>
                                          {ve.brand.toUpperCase()}{" "}
                                          {ve.model.toUpperCase()}
                                        </p>
                                        <Chip
                                          startContent={<Car size={18} />}
                                          variant="flat"
                                        >
                                          {ve.plate_number}
                                        </Chip>
                                      </div>
                                    ))}
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </TableCell>

                  {/* <TableCell>
                    <Chip
                      className="font-bold text-[10px] uppercase"
                      color={
                        customer.status === "active" ? "success" : "default"
                      }
                      size="sm"
                      variant="dot"
                    >
                      {customer.status}
                    </Chip>
                  </TableCell> */}

                  <TableCell>
                    <Button
                      isIconOnly
                      as={Link}
                      color="success"
                      radius="full"
                      size="sm"
                      to={`/master/customers/${customer.id}`}
                      variant="light"
                    >
                      <EyeIcon size={16} />
                    </Button>
                    <TableAction
                      onDelete={() => handleDelete(customer.id)}
                      onDetail={() =>
                        navigate(`/master/customers/${customer.id}`)
                      }
                      onEdit={() =>
                        navigate(`/master/customers/${customer.id}/edit`)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter>
          <CustomPagination
            className="w-full"
            meta={customers?.meta!}
            onPageChange={(page) => dispatch(setCustomerQuery({ page }))}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
