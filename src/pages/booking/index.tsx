import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Breadcrumbs,
  BreadcrumbItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
} from "@heroui/react";
import {
  Search,
  Plus,
  MoreVertical,
  ChevronRight,
  Home,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import ModalAdd from "./modal-add";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getBooking } from "@/stores/features/booking/booking-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setBookingQuery } from "@/stores/features/booking/booking-slice";
import CustomDatePicker from "@/components/forms/date-picker";
import HeaderAction from "@/components/header-action";
import { IBooking } from "@/utils/interfaces/IBooking";
import { formatTime } from "@/utils/helpers/global";

const getStatusColor = (
  status: string,
): "success" | "warning" | "primary" | "danger" | "default" => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "primary";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
};

export default function BookingPage() {
  const { bookingQuery, bookings } = useAppSelector((state) => state.booking);
  const { company } = useAppSelector((state) => state.auth);
  const [modalAdd, setModalAdd] = useState(false);
  const [data, setData] = useState<IBooking>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      dispatch(getBooking(bookingQuery));
    }
  }, [company, bookingQuery, dispatch]);

  return (
    <div className="flex-1 w-full space-y-6">
      <ModalAdd data={data} isOpen={modalAdd} setOpen={setModalAdd} />
      {/* Breadcrumbs HeroUI */}
      <Breadcrumbs
        className="pt-5"
        itemClasses={{ item: "text-gray-500 font-medium" }}
        separator={<ChevronRight size={14} />}
      >
        <BreadcrumbItem href="/" startContent={<Home size={16} />}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem>Booking</BreadcrumbItem>
      </Breadcrumbs>

      {/* Header Halaman */}
      <HeaderAction
        actionIcon={Plus}
        actionTitle="Tambah Booking"
        subtitle="Kelola antrean dan jadwal servis bengkel Anda."
        title="Data Booking"
        onAction={() => setModalAdd(true)}
      />

      {/* Filter & Search Section */}
      <Card className="border-none bg-default-50/50" shadow="sm">
        <CardBody className="flex flex-row flex-wrap gap-4 items-end">
          <Input
            className="flex-1 min-w-[240px]"
            label="Cari Customer / Kendaraan"
            labelPlacement="outside"
            placeholder="Ketik nama atau plat nomor..."
            startContent={<Search className="text-default-400" size={18} />}
            variant="bordered"
          />

          <Select
            className="w-full md:w-[180px]"
            defaultSelectedKeys={["all"]}
            label="Status"
            labelPlacement="outside"
            variant="bordered"
          >
            <SelectItem key="all">Semua Status</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="confirmed">Confirmed</SelectItem>
          </Select>

          <CustomDatePicker className="w-full md:w-[200px]" label="Tanggal" />
        </CardBody>
      </Card>

      {/* Tabel Data HeroUI */}
      <Table
        aria-label="Tabel Data Booking"
        classNames={{
          wrapper: "border border-default-100",
          th: "bg-default-50 text-default-600 font-bold",
        }}
        shadow="sm"
      >
        <TableHeader>
          <TableColumn>CUSTOMER</TableColumn>
          <TableColumn>KENDARAAN</TableColumn>
          <TableColumn>LAYANAN</TableColumn>
          <TableColumn>JADWAL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn align="center">AKSI</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Tidak ada data booking ditemukan">
          {(bookings?.data || []).map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <User
                  avatarProps={{
                    size: "sm",
                    radius: "full",
                    src: row.customer?.profile?.photo_url, // Opsional jika ada
                  }}
                  description={row.customer.phone}
                  name={row.customer.name}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-tiny text-gray-400">
                    {row.vehicle.brand} {row.vehicle.model}
                  </span>
                  <span className="text-small font-bold text-default-700">
                    {row.vehicle.plate_number}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Chip className="font-medium" size="sm" variant="flat">
                  {row.service_type}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-tiny text-gray-400">
                    {dayjs(row.booking_date).format("DD MMM YYYY")}
                  </span>
                  <span className="text-small font-bold text-default-700">
                    {formatTime(row.booking_time)} WIB
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-bold uppercase text-[10px]"
                  color={getStatusColor(row.status!)}
                  size="sm"
                  variant="flat"
                >
                  {row.status}
                </Chip>
              </TableCell>
              <TableCell>
                {row.status != "CONFIRMED" && (
                  <div className="relative flex justify-center items-center gap-2">
                    <Dropdown backdrop="blur">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <MoreVertical
                            className="text-default-400"
                            size={20}
                          />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Aksi Booking">
                        <DropdownItem
                          key="edit"
                          startContent={<Edit2 size={16} />}
                          onPress={() => {
                            setData(row);
                            setModalAdd(true);
                          }}
                        >
                          Edit Booking
                        </DropdownItem>
                        <DropdownItem
                          key="confirm"
                          color="success"
                          startContent={<CheckCircle size={16} />}
                          onPress={() =>
                            navigate(`/service/add?booking=${row.id}`)
                          }
                        >
                          Konfirmasi (WO)
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<Trash2 size={16} />}
                        >
                          Batalkan Booking
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        meta={bookings?.meta!}
        onPageChange={(page) => dispatch(setBookingQuery({ page }))}
      />
    </div>
  );
}
