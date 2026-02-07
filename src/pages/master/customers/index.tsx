import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Car,
  Users,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  Select,
  SelectItem,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCustomer } from "@/stores/features/customer/customer-action";
import { getInitials } from "@/utils/helpers/global";
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

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getCustomer(query));

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
        dispatch(getCustomer(query));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header - Menggunakan komponen yang sudah kita refaktor sebelumnya */}
      <HeaderAction
        actionIcon={UserPlus}
        actionTitle="Tambah Pelanggan"
        leadIcon={Users}
        subtitle="Kelola informasi kontak dan profil pemilik kendaraan bengkel."
        title="Database Pelanggan"
        onAction={() => navigate("/master/customers/create")}
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
              isClearable
              className="flex-1"
              placeholder="Cari nama, email, atau nomor telepon..."
              startContent={<Search className="text-gray-400" size={18} />}
              variant="bordered"
              onChange={(e) => searchDebounce(e.target.value)}
            />
            <Select
              aria-label="Filter Status"
              className="w-full md:w-48"
              classNames={{
                trigger:
                  "border-gray-200 hover:border-gray-400 focus-within:border-gray-800 shadow-none",
                value: "text-small font-bold text-gray-600",
              }}
              placeholder="Status: Semua"
              selectedKeys={[query.status || "all"]}
              startContent={<Info className="text-gray-400" size={16} />}
              variant="bordered"
              onChange={(e) => {
                const val = e.target.value;

                dispatch(
                  setCustomerQuery({
                    status: val === "all" ? undefined : val,
                  }),
                );
              }}
            >
              <SelectItem key="all" textValue="Semua Status">
                <span className="text-small font-medium text-gray-600 italic">
                  Semua Status
                </span>
              </SelectItem>
              <SelectItem key="active" textValue="Aktif">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-small font-bold text-gray-800 uppercase tracking-tight">
                    Aktif
                  </span>
                </div>
              </SelectItem>
              <SelectItem key="inactive" textValue="Non-Aktif">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-gray-300" />
                  <span className="text-small font-bold text-gray-800 uppercase tracking-tight">
                    Non-Aktif
                  </span>
                </div>
              </SelectItem>
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper aria-label="Tabel Pelanggan">
            <TableHeader>
              <TableColumn>PROFIL PELANGGAN</TableColumn>
              <TableColumn>KONTAK</TableColumn>
              <TableColumn>ALAMAT</TableColumn>
              <TableColumn align="center">UNIT KENDARAAN</TableColumn>
              <TableColumn align="center">STATUS</TableColumn>
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

                  <TableCell>
                    <Chip
                      className="bg-gray-100 text-gray-700 font-bold text-tiny border-none"
                      startContent={<Car size={12} />}
                      variant="flat"
                    >
                      {customer.total_vehicle} Unit
                    </Chip>
                  </TableCell>

                  <TableCell>
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
                  </TableCell>

                  <TableCell>
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
