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
import {
  ArrowLeft,
  BadgeCheck,
  CalendarRange,
  Pencil,
  Users,
  Wallet,
} from "lucide-react";

import ItemModal from "./components/item-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPayrollDetail } from "@/stores/features/payroll/payroll-action";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { dateFormat } from "@/utils/helpers/formater";
import { formatIDR } from "@/utils/helpers/format";

export default function PayrollDetailPage() {
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

      <div className="flex items-center justify-between">
        <Button
          startContent={<ArrowLeft size={18} />}
          variant="light"
          onPress={() => navigate("/hr/payroll")}
        >
          Kembali
        </Button>
        {!isPaid && (
          <Button
            color="success"
            startContent={<BadgeCheck size={18} />}
            onPress={() =>
              confirmSweat(handlePay, {
                title: "Tandai sudah dibayar?",
                text: "Setelah dibayar, penggajian tidak dapat diubah lagi.",
                confirmButtonText: "Ya, bayar",
                icon: "question",
              })
            }
          >
            Tandai Sudah Dibayar
          </Button>
        )}
      </div>

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
                    {isPaid ? "Dibayar" : "Draft"}
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
                    {detail?.period_type === "monthly" ? "Bulanan" : "Mingguan"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-gray-400">
                  <Users size={14} />
                  <span className="text-xs font-bold uppercase">Karyawan</span>
                </div>
                <p className="text-lg font-black text-gray-700">
                  {detail?.items?.length || 0}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase text-gray-400">
                  Total Gaji
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
        aria-label="Detail Gaji Karyawan"
        classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
      >
        <TableHeader>
          <TableColumn>KARYAWAN</TableColumn>
          <TableColumn>KEHADIRAN</TableColumn>
          <TableColumn>GAJI POKOK</TableColumn>
          <TableColumn>TUNJANGAN</TableColumn>
          <TableColumn>LEMBUR/BONUS</TableColumn>
          <TableColumn>POTONGAN</TableColumn>
          <TableColumn>GAJI BERSIH</TableColumn>
          <TableColumn align="center" width={70}>
            AKSI
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="Tidak ada data karyawan">
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
                    Hadir: {item.present_days}
                  </span>
                  <span className="text-amber-600">
                    Telat: {item.late_count}
                  </span>
                  <span className="text-rose-600">
                    Alfa: {item.absent_days}
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
