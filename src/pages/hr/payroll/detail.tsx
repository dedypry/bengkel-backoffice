import type { IPayrollItem } from "@/utils/interfaces/IPayroll";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Card,
  CardBody,
  Avatar,
  Spinner,
} from "@heroui/react";
import { BadgeCheck, CalendarRange, Pencil, Users, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

import ItemModal from "./components/item-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPayrollDetail } from "@/stores/features/payroll/payroll-action";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { dateFormat } from "@/utils/helpers/formater";
import { formatIDR } from "@/utils/helpers/format";
import HeaderAction from "@/components/header-action";

export default function PayrollDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { detail, detailLoading } = useAppSelector((state) => state.payroll);

  const [openItem, setOpenItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IPayrollItem | null>();

  useEffect(() => {
    if (id) dispatch(getPayrollDetail(id));
  }, [id, dispatch]);

  const isPaid = detail?.status === "paid";

  const handlePay = () => {
    if (!id) return;
    http
      .post(`/payrolls/${id}/pay`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPayrollDetail(id));
      })
      .catch((err) => notifyError(err));
  };

  if (detailLoading && !detail) {
    return (
      <div className="flex justify-center py-20">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <ItemModal
        item={selectedItem}
        open={openItem}
        payrollId={Number(id)}
        setOpen={setOpenItem}
        onClose={() => setSelectedItem(null)}
      />

      <HeaderAction
        actionContent={
          !isPaid ? (
            <Button
              color="success"
              startContent={<BadgeCheck size={18} />}
              onPress={() =>
                confirmSweat(handlePay, {
                  title: t("hr.payroll.confirm_paid_title"),
                  text: t("hr.payroll.confirm_paid_text"),
                  confirmButtonText: t("hr.payroll.confirm_paid_yes"),
                  icon: "question",
                })
              }
            >
              {t("hr.payroll.mark_paid")}
            </Button>
          ) : undefined
        }
        leadIcon={Wallet}
        subtitle={`${dateFormat(detail?.period_start, "DD MMM YYYY")} - ${dateFormat(detail?.period_end, "DD MMM YYYY")}`}
        title={detail?.code || t("hr.payroll.title")}
        onBack={() => navigate("/hr/payroll")}
      />

      {/* Header info */}
      <Card className="border border-gray-100 shadow-none">
        <CardBody className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-14 rounded-sm bg-primary/10 text-primary">
                <Wallet size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-gray-700">
                    {detail?.code}
                  </h1>
                  <Chip
                    color={isPaid ? "success" : "warning"}
                    size="sm"
                    variant="dot"
                  >
                    {isPaid ? t("hr.common.paid") : t("hr.common.draft")}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                  <CalendarRange size={14} />
                  <span>
                    {dateFormat(detail?.period_start, "DD MMM YYYY")} -{" "}
                    {dateFormat(detail?.period_end, "DD MMM YYYY")}
                  </span>
                  <span>·</span>
                  <span className="capitalize">
                    {detail?.period_type === "monthly"
                      ? t("hr.common.monthly")
                      : t("hr.common.weekly")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-gray-400">
                  <Users size={14} />
                  <span className="text-xs font-bold uppercase">
                    {t("hr.payroll.stat_employees")}
                  </span>
                </div>
                <p className="text-lg font-black text-gray-700">
                  {detail?.items?.length || 0}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase text-gray-400">
                  {t("hr.payroll.stat_total_salary")}
                </span>
                <p className="text-2xl font-black text-primary">
                  {formatIDR(detail?.total_amount)}
                </p>
              </div>
            </div>
          </div>
          {detail?.note && (
            <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">
              {detail.note}
            </p>
          )}
        </CardBody>
      </Card>

      {/* Items */}
      <Table
        isStriped
        aria-label={t("hr.payroll.items_table_aria")}
        classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
      >
        <TableHeader>
          <TableColumn>{t("hr.payroll.col_employee")}</TableColumn>
          <TableColumn>{t("hr.payroll.col_attendance")}</TableColumn>
          <TableColumn>{t("hr.payroll.col_base_salary")}</TableColumn>
          <TableColumn>{t("hr.payroll.col_allowance")}</TableColumn>
          <TableColumn>{t("hr.payroll.col_overtime_bonus")}</TableColumn>
          <TableColumn>{t("hr.payroll.col_deduction")}</TableColumn>
          <TableColumn>{t("hr.payroll.col_net_salary")}</TableColumn>
          <TableColumn align="center" width={70}>
            {t("common.actions")}
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("hr.payroll.empty_items")}>
          {(detail?.items || []).map((item) => (
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
                      {item.user?.nik || "-"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-[10px] font-bold">
                  <span className="text-emerald-600">
                    {t("hr.common.attendance_present")}
                    {item.present_days}
                  </span>
                  <span className="text-amber-600">
                    {t("hr.common.attendance_late")}
                    {item.late_count}
                  </span>
                  <span className="text-rose-600">
                    {t("hr.common.attendance_absent")}
                    {item.absent_days}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs font-bold text-gray-700">
                  {formatIDR(item.base_salary)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-emerald-600 font-bold">
                  {formatIDR(item.allowance)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-indigo-600 font-bold">
                  {formatIDR(Number(item.overtime_amount) + Number(item.bonus))}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-rose-600 font-bold">
                  {formatIDR(item.deduction)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-black text-primary">
                  {formatIDR(item.net)}
                </span>
              </TableCell>
              <TableCell>
                {!isPaid && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setSelectedItem(item);
                      setOpenItem(true);
                    }}
                  >
                    <Pencil className="text-gray-400" size={16} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
