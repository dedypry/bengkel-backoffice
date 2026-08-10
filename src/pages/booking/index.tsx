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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import {
  Search,
  Plus,
  MoreVertical,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ModalAdd from "./modal-add";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getBooking } from "@/stores/features/booking/booking-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setBookingQuery } from "@/stores/features/booking/booking-slice";
import CustomDatePicker from "@/components/forms/date-picker";
import HeaderAction from "@/components/header-action";
import { IBooking } from "@/utils/interfaces/IBooking";
import { formatTime } from "@/utils/helpers/global";
import debounce from "@/utils/helpers/debounce";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

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

const getStatusLabel = (status: string, t: (key: string) => string): string => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return t("booking.status.confirmed");
    case "pending":
      return t("booking.status.pending");
    case "completed":
      return t("booking.status.completed");
    case "cancelled":
      return t("booking.status.cancelled");
    default:
      return status;
  }
};

export default function BookingPage() {
  const { t } = useTranslation();
  const { bookingQuery, bookings } = useAppSelector((state) => state.booking);
  const { company } = useAppSelector((state) => state.auth);
  const [modalAdd, setModalAdd] = useState(false);
  const [data, setData] = useState<IBooking>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getBooking(bookingQuery));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, bookingQuery, dispatch]);

  const searchDebounce = debounce(
    (q) => dispatch(setBookingQuery({ q })),
    1000,
  );

  const handleDelete = (id: number) => {
    http
      .delete(`/bookings/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getBooking(bookingQuery));
      })
      .catch((err) => notifyError(err));
  };

  return (
    <div className="space-y-6">
      <ModalAdd data={data} isOpen={modalAdd} setOpen={setModalAdd} />

      <HeaderAction
        actionIcon={Plus}
        actionTitle={t("booking.add")}
        subtitle={t("booking.subtitle")}
        title={t("booking.title")}
        onAction={() => setModalAdd(true)}
      />

      <Card>
        <CardHeader className="flex gap-4">
          <Input
            className="flex-1 min-w-[240px]"
            defaultValue={bookingQuery.q}
            label={t("booking.search_label")}
            placeholder={t("booking.search_placeholder")}
            startContent={<Search className="text-default-400" size={18} />}
            onValueChange={searchDebounce}
          />
          <Select
            className="w-full md:w-[180px]"
            defaultSelectedKeys={[bookingQuery.status]}
            label={t("booking.status_label")}
            onSelectionChange={(key) => {
              const status = Array.from(key)[0];

              dispatch(setBookingQuery({ status }));
            }}
          >
            <SelectItem key="all">{t("booking.status_all")}</SelectItem>
            <SelectItem key="pending">{t("booking.status.pending")}</SelectItem>
            <SelectItem key="confirmed">
              {t("booking.status.confirmed")}
            </SelectItem>
          </Select>

          <CustomDatePicker
            className="w-full md:w-[200px]"
            label={t("booking.date_label")}
            value={bookingQuery.date as any}
            onChange={(date) => dispatch(setBookingQuery({ date }))}
          />
        </CardHeader>
        <CardBody>
          <Table removeWrapper aria-label={t("booking.table_aria")}>
            <TableHeader>
              <TableColumn>{t("booking.columns.customer")}</TableColumn>
              <TableColumn>{t("booking.columns.vehicle")}</TableColumn>
              <TableColumn>{t("booking.columns.service")}</TableColumn>
              <TableColumn>{t("booking.columns.schedule")}</TableColumn>
              <TableColumn>{t("booking.columns.status")}</TableColumn>
              <TableColumn align="center">
                {t("booking.column_actions")}
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={t("booking.empty")}>
              {(bookings?.data || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <User
                      avatarProps={{
                        size: "sm",
                        radius: "full",
                        src: row.customer?.profile?.photo_url,
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
                        {formatTime(row.booking_time)} {t("booking.timezone")}
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
                      {getStatusLabel(row.status!, t)}
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
                                className="text-gray-500"
                                size={20}
                              />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label={t("booking.actions_aria")}>
                            <DropdownItem
                              key="edit"
                              startContent={<Edit2 size={16} />}
                              onPress={() => {
                                setData(row);
                                setModalAdd(true);
                              }}
                            >
                              {t("booking.edit_booking")}
                            </DropdownItem>
                            <DropdownItem
                              key="confirm"
                              color="success"
                              startContent={<CheckCircle size={16} />}
                              onPress={() =>
                                navigate(`/service/add?booking=${row.id}`)
                              }
                            >
                              {t("booking.confirm_wo")}
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              startContent={<Trash2 size={16} />}
                              onPress={() => {
                                confirmSweat(() => handleDelete(row.id), {
                                  title: t("booking.delete_confirm.title"),
                                  text: t("booking.delete_confirm.text"),
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#168BAB",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: t(
                                    "booking.delete_confirm.confirm",
                                  ),
                                  cancelButtonText: t("common.cancel"),
                                });
                              }}
                            >
                              {t("booking.cancel_booking")}
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
        </CardBody>
        <CardFooter>
          <CustomPagination
            className="w-full"
            meta={bookings?.meta!}
            onPageChange={(page) => dispatch(setBookingQuery({ page }))}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
