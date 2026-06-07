import type {
  IAttendance,
  IAttendanceDevice,
} from "@/utils/interfaces/IAttendance";

import { useEffect, useRef, useState } from "react";
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

const STATUS_CONFIG: Record<string, { label: string; color: any }> = {
  present: { label: "Hadir", color: "success" },
  late: { label: "Terlambat", color: "warning" },
  permit: { label: "Izin", color: "secondary" },
  sick: { label: "Sakit", color: "secondary" },
  leave: { label: "Cuti", color: "default" },
  absent: { label: "Alfa", color: "danger" },
};

function timeOnly(value: string | null) {
  if (!value) return "--:--";

  return dateTimeFormat(value, "HH:mm");
}

export default function AttendancePage() {
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

  const summaryCards = [
    {
      label: "Total Karyawan",
      value: summary.total,
      icon: Users,
      color: "text-gray-600 bg-gray-100",
    },
    {
      label: "Hadir",
      value: summary.present,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Terlambat",
      value: summary.late,
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "Izin/Cuti",
      value: summary.leave,
      icon: Clock,
      color: "text-indigo-600 bg-indigo-100",
    },
    {
      label: "Alfa",
      value: summary.absent,
      icon: CalendarOff,
      color: "text-rose-600 bg-rose-100",
    },
  ];

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
        actionTitle={tab === "daily" ? "Input Absensi" : "Tambah Mesin"}
        leadIcon={Clock}
        subtitle="Kelola kehadiran karyawan dari mesin absensi maupun input manual."
        title="Absensi Karyawan"
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
        aria-label="Menu Absensi"
        color="primary"
        selectedKey={tab}
        variant="underlined"
        onSelectionChange={(key) => setTab(key.toString())}
      >
        <Tab
          key="daily"
          title={
            <div className="flex items-center gap-2">
              <Clock size={16} /> Absensi Harian
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
                  placeholder="Cari nama atau NIK..."
                  startContent={<Search className="text-gray-400" size={20} />}
                  onValueChange={searchDebounce}
                />
              </div>
              <div className="flex items-center gap-2 md:w-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Tanggal
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
              aria-label="Tabel Absensi"
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>KARYAWAN</TableColumn>
                <TableColumn width={120}>TANGGAL</TableColumn>
                <TableColumn width={110}>MASUK</TableColumn>
                <TableColumn width={110}>PULANG</TableColumn>
                <TableColumn width={120}>STATUS</TableColumn>
                <TableColumn width={110}>SUMBER</TableColumn>
                <TableColumn align="center" width={80}>
                  AKSI
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="Belum ada data absensi pada tanggal ini">
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
                            {item.user?.department || "Karyawan"}
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
                        color={STATUS_CONFIG[item.status]?.color || "default"}
                        size="sm"
                        variant="dot"
                      >
                        {STATUS_CONFIG[item.status]?.label || item.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={item.source === "manual" ? "warning" : "primary"}
                        size="sm"
                        variant="flat"
                      >
                        {item.source === "manual" ? "Manual" : "Mesin"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <MoreVertical className="text-gray-400" size={20} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Aksi Absensi" variant="flat">
                          <DropdownItem
                            key="edit"
                            startContent={<Edit2 size={16} />}
                            onPress={() => {
                              setSelected(item);
                              setOpenManual(true);
                            }}
                          >
                            Koreksi
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
                            Hapus
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
              <Cpu size={16} /> Mesin Absensi
            </div>
          }
        >
          <div className="space-y-4">
            <Table
              aria-label="Tabel Mesin"
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>SERIAL NUMBER</TableColumn>
                <TableColumn>NAMA / LOKASI</TableColumn>
                <TableColumn width={180}>TERAKHIR AKTIF</TableColumn>
                <TableColumn width={120}>STATUS</TableColumn>
                <TableColumn align="center" width={80}>
                  AKSI
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="Belum ada mesin terdaftar">
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
                          {item.location || "Lokasi belum diatur"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">
                        {item.last_seen_at
                          ? dateTimeFormat(item.last_seen_at)
                          : "Belum pernah"}
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
                        {item.is_active ? "Aktif" : "Non-Aktif"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <MoreVertical className="text-gray-400" size={20} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Aksi Mesin" variant="flat">
                          <DropdownItem
                            key="edit"
                            startContent={<Edit2 size={16} />}
                            onPress={() => {
                              setSelectedDevice(item);
                              setOpenDevice(true);
                            }}
                          >
                            Edit
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
                            Hapus
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
