import type { IEmployeeSalary } from "@/utils/interfaces/IPayroll";

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
  Select,
  SelectItem,
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
  Wallet,
  Eye,
  Receipt,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import GeneratePayrollModal from "./components/generate-modal";
import SalaryModal, { SALARY_TYPES } from "./components/salary-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getPayrolls,
  getPayrollSummary,
  getSalaries,
} from "@/stores/features/payroll/payroll-action";
import {
  setPayrollQuery,
  setSalaryQuery,
} from "@/stores/features/payroll/payroll-slice";
import { CustomPagination } from "@/components/custom-pagination";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";
import debounce from "@/utils/helpers/debounce";
import { dateFormat } from "@/utils/helpers/formater";
import { formatIDR } from "@/utils/helpers/format";

const salaryTypeLabel = (key: string) =>
  SALARY_TYPES.find((t) => t.key === key)?.label || key;

export default function PayrollPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { payrolls, salaries, summary, payrollQuery, salaryQuery } =
    useAppSelector((state) => state.payroll);
  const { company } = useAppSelector((state) => state.auth);

  const [tab, setTab] = useState("runs");
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openSalary, setOpenSalary] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<IEmployeeSalary | null>();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (company) {
      dispatch(getPayrolls(payrollQuery));
    }
  }, [payrollQuery, company, dispatch]);

  useEffect(() => {
    if (company) {
      dispatch(getSalaries(salaryQuery));
    }
  }, [salaryQuery, company, dispatch]);

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getPayrollSummary());
    }
  }, [company, dispatch]);

  const searchPayroll = debounce((q: string) => {
    dispatch(setPayrollQuery({ q, page: 1 }));
  }, 800);

  const searchSalary = debounce((q: string) => {
    dispatch(setSalaryQuery({ q, page: 1 }));
  }, 800);

  const handleDeletePayroll = (id: number) => {
    http
      .delete(`/payrolls/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPayrolls(payrollQuery));
        dispatch(getPayrollSummary());
      })
      .catch((err) => notifyError(err));
  };

  const handleDeleteSalary = (id: number) => {
    http
      .delete(`/payrolls/salaries/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getSalaries(salaryQuery));
      })
      .catch((err) => notifyError(err));
  };

  return (
    <div className="space-y-6 pb-20">
      <GeneratePayrollModal open={openGenerate} setOpen={setOpenGenerate} />
      <SalaryModal
        open={openSalary}
        salary={selectedSalary}
        setOpen={setOpenSalary}
        onClose={() => setSelectedSalary(null)}
      />

      <HeaderAction
        actionIcon={Plus}
        actionTitle={tab === "runs" ? "Buat Penggajian" : "Atur Gaji"}
        leadIcon={Wallet}
        subtitle="Kelola gaji karyawan secara mingguan maupun bulanan."
        title="Penggajian Karyawan"
        onAction={() => {
          if (tab === "runs") {
            setOpenGenerate(true);
          } else {
            setSelectedSalary(null);
            setOpenSalary(true);
          }
        }}
      />

      <Tabs
        aria-label="Menu Penggajian"
        color="primary"
        selectedKey={tab}
        variant="underlined"
        onSelectionChange={(key) => setTab(key.toString())}
      >
        <Tab
          key="runs"
          title={
            <div className="flex items-center gap-2">
              <Receipt size={16} /> Riwayat Penggajian
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="border border-gray-100 shadow-none">
                <CardBody className="flex flex-row items-center gap-3 p-4">
                  <div className="flex items-center justify-center size-10 rounded-sm bg-indigo-100 text-indigo-600">
                    <Layers size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-700 leading-none">
                      {summary.total_run}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                      Total Periode Penggajian
                    </span>
                  </div>
                </CardBody>
              </Card>
              <Card className="border border-gray-100 shadow-none">
                <CardBody className="flex flex-row items-center gap-3 p-4">
                  <div className="flex items-center justify-center size-10 rounded-sm bg-emerald-100 text-emerald-600">
                    <Wallet size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-700 leading-none">
                      {formatIDR(summary.paid_amount)}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                      Total Gaji Dibayar
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              <Input
                isClearable
                className="md:max-w-xs"
                defaultValue={payrollQuery.q}
                placeholder="Cari kode penggajian..."
                startContent={<Search className="text-gray-400" size={20} />}
                onValueChange={searchPayroll}
              />
              <div className="flex gap-2 w-full md:w-auto">
                <Select
                  className="md:w-40"
                  label="Tipe"
                  labelPlacement="outside-left"
                  selectedKeys={
                    payrollQuery.period_type ? [payrollQuery.period_type] : []
                  }
                  size="sm"
                  onSelectionChange={(keys) =>
                    dispatch(
                      setPayrollQuery({
                        period_type: Array.from(keys)[0]?.toString() || "",
                        page: 1,
                      }),
                    )
                  }
                >
                  <SelectItem key="">Semua</SelectItem>
                  <SelectItem key="monthly">Bulanan</SelectItem>
                  <SelectItem key="weekly">Mingguan</SelectItem>
                </Select>
              </div>
            </div>

            <Table
              isStriped
              aria-label="Tabel Penggajian"
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>KODE</TableColumn>
                <TableColumn>PERIODE</TableColumn>
                <TableColumn width={110}>TIPE</TableColumn>
                <TableColumn width={110}>KARYAWAN</TableColumn>
                <TableColumn>TOTAL</TableColumn>
                <TableColumn width={120}>STATUS</TableColumn>
                <TableColumn align="center" width={80}>
                  AKSI
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="Belum ada data penggajian">
                {(payrolls?.data || []).map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <Chip className="font-black rounded-sm" size="sm" variant="flat">
                        {item.code}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-gray-600">
                        {dateFormat(item.period_start, "DD MMM")} -{" "}
                        {dateFormat(item.period_end, "DD MMM YYYY")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          item.period_type === "monthly" ? "primary" : "secondary"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item.period_type === "monthly" ? "Bulanan" : "Mingguan"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-gray-600">
                        {item.total_employee || 0} orang
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-black text-gray-700">
                        {formatIDR(item.total_amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={item.status === "paid" ? "success" : "warning"}
                        size="sm"
                        variant="dot"
                      >
                        {item.status === "paid" ? "Dibayar" : "Draft"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <MoreVertical className="text-gray-400" size={20} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Aksi Penggajian" variant="flat">
                          <DropdownItem
                            key="detail"
                            startContent={<Eye size={16} />}
                            onPress={() => navigate(`/hr/payroll/${item.id}`)}
                          >
                            Lihat Detail
                          </DropdownItem>
                          {item.status !== "paid" ? (
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              startContent={<Trash2 size={16} />}
                              onPress={() =>
                                confirmSweat(() => handleDeletePayroll(item.id))
                              }
                            >
                              Hapus
                            </DropdownItem>
                          ) : null}
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <CustomPagination
              meta={payrolls?.meta!}
              onPageChange={(page) => dispatch(setPayrollQuery({ page }))}
            />
          </div>
        </Tab>

        <Tab
          key="salaries"
          title={
            <div className="flex items-center gap-2">
              <Wallet size={16} /> Master Gaji
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              <Input
                isClearable
                className="md:max-w-xs"
                defaultValue={salaryQuery.q}
                placeholder="Cari nama atau NIK..."
                startContent={<Search className="text-gray-400" size={20} />}
                onValueChange={searchSalary}
              />
            </div>

            <Table
              isStriped
              aria-label="Tabel Gaji"
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>KARYAWAN</TableColumn>
                <TableColumn width={110}>TIPE</TableColumn>
                <TableColumn>GAJI POKOK</TableColumn>
                <TableColumn>TUNJANGAN</TableColumn>
                <TableColumn>POTONGAN</TableColumn>
                <TableColumn width={110}>STATUS</TableColumn>
                <TableColumn align="center" width={80}>
                  AKSI
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent="Belum ada konfigurasi gaji">
                {(salaries?.data || []).map((item) => (
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
                      <Chip size="sm" variant="flat">
                        {salaryTypeLabel(item.salary_type)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-black text-gray-700">
                        {formatIDR(item.base_salary)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-emerald-600 font-bold">
                        {formatIDR(item.allowance)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-rose-600 font-bold">
                        {formatIDR(item.deduction)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={item.is_active ? "success" : "default"}
                        size="sm"
                        variant="dot"
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
                        <DropdownMenu aria-label="Aksi Gaji" variant="flat">
                          <DropdownItem
                            key="edit"
                            startContent={<Edit2 size={16} />}
                            onPress={() => {
                              setSelectedSalary(item);
                              setOpenSalary(true);
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
                              confirmSweat(() => handleDeleteSalary(item.id))
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
              meta={salaries?.meta!}
              onPageChange={(page) => dispatch(setSalaryQuery({ page }))}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
