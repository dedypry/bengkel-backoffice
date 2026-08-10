import type {
  IAttendance,
  IAttendanceDevice,
} from "@/utils/interfaces/IAttendance";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
  Avatar,
} from "@heroui/react";
import {
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CalendarOff,
  Users,
  Cpu,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import ManualAttendanceModal from "./components/manual-modal";
import DeviceModal from "./components/device-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getAttendance,
  getAttendanceDevices,
  getAttendanceSummary,
} from "@/stores/features/attendance/attendance-action";
import { setAttendanceQuery } from "@/stores/features/attendance/attendance-slice";
import { CustomPagination } from "@/components/custom-pagination";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";
import debounce from "@/utils/helpers/debounce";
import { dateFormat, dateTimeFormat } from "@/utils/helpers/formater";

function timeOnly(value: string | null) {
  if (!value) return "--:--";

  return dateTimeFormat(value, "HH:mm");
}

export default function AttendancePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { attendances, summary, devices, attendanceQuery } = useAppSelector(
    (state) => state.attendance,
  );
  const { company } = useAppSelector((state) => state.auth);

  const [tab, setTab] = useState("daily");
  const [openManual, setOpenManual] = useState(false);
  const [selected, setSelected] = useState<IAttendance | null>();
  const [openDevice, setOpenDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] =
    useState<IAttendanceDevice | null>();
  const hasFetched = useRef(false);

  const statusConfig = useMemo<
    Record<string, { label: string; color: any }>
  >(
    () => ({
      present: { label: t("hr.common.status_present"), color: "success" },
      late: { label: t("hr.common.status_late"), color: "warning" },
      permit: { label: t("hr.common.status_permit"), color: "secondary" },
      sick: { label: t("hr.common.status_sick"), color: "secondary" },
      leave: { label: t("hr.common.status_leave"), color: "default" },
      absent: { label: t("hr.common.status_absent"), color: "danger" },
    }),
    [t],
  );

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getAttendance(attendanceQuery));
      dispatch(getAttendanceSummary({ date: attendanceQuery.date }));
      dispatch(getAttendanceDevices());

      setTimeout(() => {
        hasFetched.current = false;
      }, 800);
    }
  }, [attendanceQuery, company, dispatch]);

  const searchDebounce = debounce((q: string) => {
    dispatch(setAttendanceQuery({ q, page: 1 }));
  }, 800);

  const handleDelete = (id: number) => {
    http
      .delete(`/attendances/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getAttendance(attendanceQuery));
        dispatch(getAttendanceSummary({ date: attendanceQuery.date }));
      })
      .catch((err) => notifyError(err));
  };

  const handleDeleteDevice = (id: number) => {
    http
      .delete(`/attendances/devices/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getAttendanceDevices());
      })
      .catch((err) => notifyError(err));
  };

  const summaryCards = useMemo(
    () => [
      {
        label: t("hr.attendance.stat_total"),
        value: summary.total,
        icon: Users,
        color: "text-gray-600 bg-gray-100",
      },
      {
        label: t("hr.attendance.stat_present"),
        value: summary.present,
        icon: CheckCircle2,
        color: "text-emerald-600 bg-emerald-100",
      },
      {
        label: t("hr.attendance.stat_late"),
        value: summary.late,
        icon: AlertTriangle,
        color: "text-amber-600 bg-amber-100",
      },
      {
        label: t("hr.attendance.stat_leave"),
        value: summary.leave,
        icon: Clock,
        color: "text-indigo-600 bg-indigo-100",
      },
      {
        label: t("hr.attendance.stat_absent"),
        value: summary.absent,
        icon: CalendarOff,
        color: "text-rose-600 bg-rose-100",
      },
    ],
    [summary, t],
  );

  return (
    <div className="space-y-6 pb-20">
      <ManualAttendanceModal
        attendance={selected}
        open={openManual}
        setOpen={setOpenManual}
        onClose={() => setSelected(null)}
      />
      <DeviceModal
        device={selectedDevice}
        open={openDevice}
        setOpen={setOpenDevice}
        onClose={() => setSelectedDevice(null)}
      />

      <HeaderAction
        actionIcon={Plus}
        actionTitle={
          tab === "daily"
            ? t("hr.attendance.add_manual")
            : t("hr.attendance.add_device")
        }
        leadIcon={Clock}
        subtitle={t("hr.attendance.subtitle")}
        title={t("hr.attendance.title")}
        onAction={() => {
          if (tab === "daily") {
            setSelected(null);
            setOpenManual(true);
          } else {
            setSelectedDevice(null);
            setOpenDevice(true);
          }
        }}
      />

      <Tabs
        aria-label={t("hr.attendance.tabs_aria")}
        color="primary"
        selectedKey={tab}
        variant="underlined"
        onSelectionChange={(key) => setTab(key.toString())}
      >
        <Tab
          key="daily"
          title={
            <div className="flex items-center gap-2">
              <Clock size={16} /> {t("hr.attendance.tab_daily")}
            </div>
          }
        >
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {summaryCards.map((card) => (
                <Card
                  key={card.label}
                  className="border border-gray-100 shadow-none"
                >
                  <CardBody className="flex flex-row items-center gap-3 p-4">
                    <div
                      className={`flex items-center justify-center size-10 rounded-sm ${card.color}`}
                    >
                      <card.icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-gray-700 leading-none">
                        {card.value}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        {card.label}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              <div>
                <Input
                  isClearable
                  className="md:max-w-xs"
                  defaultValue={attendanceQuery.q}
                  placeholder={t("hr.attendance.search_placeholder")}
                  startContent={<Search className="text-gray-400" size={20} />}
                  onValueChange={searchDebounce}
                />
              </div>
              <div className="flex items-center gap-2 md:w-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {t("common.date")}
                </span>
                <Input
                  className="md:w-44"
                  type="date"
                  value={attendanceQuery.date}
                  onValueChange={(date) =>
                    dispatch(setAttendanceQuery({ date, page: 1 }))
                  }
                />
              </div>
            </div>

            {/* Table */}
            <Table
              isStriped
              aria-label={t("hr.attendance.table_aria")}
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>{t("hr.attendance.col_employee")}</TableColumn>
                <TableColumn width={120}>
                  {t("hr.attendance.col_date")}
                </TableColumn>
                <TableColumn width={110}>
                  {t("hr.attendance.col_check_in")}
                </TableColumn>
                <TableColumn width={110}>
                  {t("hr.attendance.col_check_out")}
                </TableColumn>
                <TableColumn width={120}>
                  {t("hr.attendance.col_status")}
                </TableColumn>
                <TableColumn width={110}>
                  {t("hr.attendance.col_source")}
                </TableColumn>
                <TableColumn align="center" width={80}>
                  {t("hr.attendance.col_actions")}
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent={t("hr.attendance.empty_daily")}>
                {(attendances?.data || []).map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={item.user?.name}
                          size="sm"
                          src={item.user?.profile?.photo_url}
                        />
                        <div className="flex flex-col">
                          <p className="font-bold text-gray-700 text-xs uppercase">
                            {item.user?.name || "-"}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            {item.user?.nik || "-"} ·{" "}
                            {item.user?.department || t("hr.common.employee")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-gray-600">
                        {dateFormat(item.date, "DD MMM YYYY")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip color="success" size="sm" variant="flat">
                        {timeOnly(item.check_in)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip color="danger" size="sm" variant="flat">
                        {timeOnly(item.check_out)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={statusConfig[item.status]?.color || "default"}
                        size="sm"
                        variant="dot"
                      >
                        {statusConfig[item.status]?.label || item.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={item.source === "manual" ? "warning" : "primary"}
                        size="sm"
                        variant="flat"
                      >
                        {item.source === "manual"
                          ? t("hr.common.manual")
                          : t("hr.common.device")}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <MoreVertical className="text-gray-400" size={20} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label={t("hr.attendance.dropdown_aria")}
                          variant="flat"
                        >
                          <DropdownItem
                            key="edit"
                            startContent={<Edit2 size={16} />}
                            onPress={() => {
                              setSelected(item);
                              setOpenManual(true);
                            }}
                          >
                            {t("hr.common.correction")}
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 size={16} />}
                            onPress={() =>
                              confirmSweat(() => handleDelete(item.id))
                            }
                          >
                            {t("common.delete")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <CustomPagination
              meta={attendances?.meta!}
              onPageChange={(page) => dispatch(setAttendanceQuery({ page }))}
            />
          </div>
        </Tab>

        <Tab
          key="devices"
          title={
            <div className="flex items-center gap-2">
              <Cpu size={16} /> {t("hr.attendance.tab_devices")}
            </div>
          }
        >
          <div className="space-y-4">
            <Table
              aria-label={t("hr.attendance.devices_table_aria")}
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>{t("hr.attendance.col_serial")}</TableColumn>
                <TableColumn>{t("hr.attendance.col_name_location")}</TableColumn>
                <TableColumn width={180}>
                  {t("hr.attendance.col_last_active")}
                </TableColumn>
                <TableColumn width={120}>{t("common.status")}</TableColumn>
                <TableColumn align="center" width={80}>
                  {t("common.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent={t("hr.attendance.empty_devices")}>
                {(devices || []).map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <Chip
                        className="font-black rounded-sm"
                        size="sm"
                        variant="flat"
                      >
                        {item.serial_number}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="font-bold text-gray-700 text-xs uppercase">
                          {item.name || "-"}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {item.location || t("hr.attendance.location_unset")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">
                        {item.last_seen_at
                          ? dateTimeFormat(item.last_seen_at)
                          : t("hr.attendance.never_active")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={item.is_active ? "success" : "default"}
                        size="sm"
                        startContent={
                          item.is_active ? (
                            <Wifi size={12} />
                          ) : (
                            <WifiOff size={12} />
                          )
                        }
                        variant="flat"
                      >
                        {item.is_active
                          ? t("hr.common.active")
                          : t("hr.common.inactive")}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <MoreVertical className="text-gray-400" size={20} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label={t("hr.attendance.devices_dropdown_aria")}
                          variant="flat"
                        >
                          <DropdownItem
                            key="edit"
                            startContent={<Edit2 size={16} />}
                            onPress={() => {
                              setSelectedDevice(item);
                              setOpenDevice(true);
                            }}
                          >
                            {t("common.edit")}
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 size={16} />}
                            onPress={() =>
                              confirmSweat(() => handleDeleteDevice(item.id))
                            }
                          >
                            {t("common.delete")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
