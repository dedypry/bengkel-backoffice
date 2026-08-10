import type { IEmployeeSalary } from "@/utils/interfaces/IPayroll";

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
import { useTranslation } from "react-i18next";

import GeneratePayrollModal from "./components/generate-modal";
import SalaryModal, { getSalaryTypes } from "./components/salary-modal";

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

export default function PayrollPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { payrolls, salaries, summary, payrollQuery, salaryQuery } =
    useAppSelector((state) => state.payroll);
  const { company } = useAppSelector((state) => state.auth);

  const [tab, setTab] = useState("runs");
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openSalary, setOpenSalary] = useState(false);
  const [selectedSalary, setSelectedSalary] =
    useState<IEmployeeSalary | null>();
  const hasFetched = useRef(false);

  const salaryTypes = useMemo(() => getSalaryTypes(t), [t]);

  const salaryTypeLabel = (key: string) =>
    salaryTypes.find((type) => type.key === key)?.label || key;

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
        actionTitle={
          tab === "runs"
            ? t("hr.payroll.create_payroll")
            : t("hr.payroll.configure_salary")
        }
        leadIcon={Wallet}
        subtitle={t("hr.payroll.subtitle")}
        title={t("hr.payroll.title")}
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
        aria-label={t("hr.payroll.tabs_aria")}
        color="primary"
        selectedKey={tab}
        variant="underlined"
        onSelectionChange={(key) => setTab(key.toString())}
      >
        <Tab
          key="runs"
          title={
            <div className="flex items-center gap-2">
              <Receipt size={16} /> {t("hr.payroll.tab_runs")}
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
                      {t("hr.payroll.stat_total_periods")}
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
                      {t("hr.payroll.stat_total_paid")}
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
                placeholder={t("hr.payroll.search_runs")}
                startContent={<Search className="text-gray-400" size={20} />}
                onValueChange={searchPayroll}
              />
              <div className="flex gap-2 w-full md:w-auto">
                <Select
                  className="md:w-40"
                  label={t("hr.payroll.filter_type")}
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
                  <SelectItem key="">{t("hr.common.all")}</SelectItem>
                  <SelectItem key="monthly">
                    {t("hr.common.monthly")}
                  </SelectItem>
                  <SelectItem key="weekly">{t("hr.common.weekly")}</SelectItem>
                </Select>
              </div>
            </div>

            <Table
              isStriped
              aria-label={t("hr.payroll.runs_table_aria")}
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>{t("hr.payroll.col_code")}</TableColumn>
                <TableColumn>{t("hr.payroll.col_period")}</TableColumn>
                <TableColumn width={110}>
                  {t("hr.payroll.col_type")}
                </TableColumn>
                <TableColumn width={110}>
                  {t("hr.payroll.col_employees")}
                </TableColumn>
                <TableColumn>{t("hr.payroll.col_total")}</TableColumn>
                <TableColumn width={120}>
                  {t("hr.payroll.col_status")}
                </TableColumn>
                <TableColumn align="center" width={80}>
                  {t("hr.payroll.col_actions")}
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent={t("hr.payroll.empty_runs")}>
                {(payrolls?.data || []).map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <Chip
                        className="font-black rounded-sm"
                        size="sm"
                        variant="flat"
                      >
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
                          item.period_type === "monthly"
                            ? "primary"
                            : "secondary"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item.period_type === "monthly"
                          ? t("hr.common.monthly")
                          : t("hr.common.weekly")}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-gray-600">
                        {item.total_employee || 0}{" "}
                        {t("hr.common.people_suffix")}
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
                        {item.status === "paid"
                          ? t("hr.common.paid")
                          : t("hr.common.draft")}
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
                          aria-label={t("hr.payroll.runs_dropdown_aria")}
                          variant="flat"
                        >
                          <DropdownItem
                            key="detail"
                            startContent={<Eye size={16} />}
                            onPress={() => navigate(`/hr/payroll/${item.id}`)}
                          >
                            {t("common.view_detail")}
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
                              {t("common.delete")}
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
              <Wallet size={16} /> {t("hr.payroll.tab_master")}
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              <Input
                isClearable
                className="md:max-w-xs"
                defaultValue={salaryQuery.q}
                placeholder={t("hr.payroll.search_master")}
                startContent={<Search className="text-gray-400" size={20} />}
                onValueChange={searchSalary}
              />
            </div>

            <Table
              isStriped
              aria-label={t("hr.payroll.master_table_aria")}
              classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
            >
              <TableHeader>
                <TableColumn>{t("hr.payroll.col_employee")}</TableColumn>
                <TableColumn width={110}>
                  {t("hr.payroll.col_type")}
                </TableColumn>
                <TableColumn>{t("hr.payroll.col_base_salary")}</TableColumn>
                <TableColumn>{t("hr.payroll.col_allowance")}</TableColumn>
                <TableColumn>{t("hr.payroll.col_deduction")}</TableColumn>
                <TableColumn width={110}>{t("common.status")}</TableColumn>
                <TableColumn align="center" width={80}>
                  {t("common.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody emptyContent={t("hr.payroll.empty_master")}>
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
                            {item.user?.department || t("hr.common.employee")}
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
                          aria-label={t("hr.payroll.master_dropdown_aria")}
                          variant="flat"
                        >
                          <DropdownItem
                            key="edit"
                            startContent={<Edit2 size={16} />}
                            onPress={() => {
                              setSelectedSalary(item);
                              setOpenSalary(true);
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
                              confirmSweat(() => handleDeleteSalary(item.id))
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
              meta={salaries?.meta!}
              onPageChange={(page) => dispatch(setSalaryQuery({ page }))}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
