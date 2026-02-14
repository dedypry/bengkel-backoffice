import {
  ArrowDownCircle,
  Plus,
  Search,
  TrendingDown,
  MoreVertical,
  Calendar,
  ChevronRight,
  PieChart,
  ArrowDownLeft,
} from "lucide-react";
import {
  Button,
  Progress,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableColumn,
  TableRow,
} from "@heroui/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import ExpenseModal from "./components/add-expense";

import { formatIDR } from "@/utils/helpers/format";
import HeaderAction from "@/components/header-action";
import CustomDateRangePicker from "@/components/forms/date-range-picker";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getExpense } from "@/stores/features/expense/expense-action";

export default function FinanceExpensePage() {
  const { expense } = useAppSelector((state) => state.expense);
  const [modalAdd, setModalAdd] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getExpense());
  }, []);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Finance - Hero Style */}
      <ExpenseModal isOpen={modalAdd} onClose={() => setModalAdd(false)} />
      <HeaderAction
        actionIcon={Plus}
        actionTitle="Catat Baru"
        leadIcon={TrendingDown}
        subtitle=" Pantau setiap rupiah yang keluar untuk operasional bengkel Anda."
        title="Cash Flow Management"
        onAction={() => setModalAdd(true)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-5">
            <div className="bg-rose-50 p-4 rounded-md text-rose-600">
              <ArrowDownCircle size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase">
                Total Keluar (Bulan Ini)
              </p>
              <p className="text-lg font-black text-gray-500">
                {formatIDR(18950000)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
                <PieChart className="text-primary" size={32} /> Budget
                Operasional
              </p>
              <span className="text-xs font-black text-primary">75%</span>
            </div>
            <Progress
              aria-label="Budget"
              className="h-3"
              classNames={{ indicator: "bg-primary", track: "bg-gray-100" }}
              color="primary"
              value={75}
            />
            <p className="text-[10px] font-bold text-gray-400 italic text-right">
              Sisa: {formatIDR(5000000)}
            </p>
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm bg-gray-500 text-white p-4 overflow-hidden relative group cursor-pointer">
          <CardBody className="flex flex-row items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-gray-200 uppercase tracking-widest">
                Invoice Pending
              </p>
              <p className="text-lg font-black text-white uppercase">
                12 Dokumen
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl group-hover:bg-danger transition-colors">
              <ChevronRight className="text-white" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search Bar - Custom Industrial Style */}
      <Card>
        <CardBody>
          <div className="flex gap-4">
            <Input
              placeholder="Cari transaksi, supplier, atau kategori..."
              startContent={<Search className="text-gray-400" size={20} />}
            />
            <CustomDateRangePicker className="w-80" />
            <Button color="primary" startContent={<Search size={20} />}>
              Cari
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Expense List */}
      <Table aria-label="Tabel Pengeluaran">
        <TableHeader>
          <TableColumn width={300}>DESKRIPSI / KATEGORI</TableColumn>
          <TableColumn>TANGGAL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn align="end">NOMINAL</TableColumn>
          <TableColumn align="center" width={50}>
            {" "}
          </TableColumn>
        </TableHeader>
        <TableBody>
          {(expense?.data || []).map((exp) => (
            <TableRow
              key={exp.id}
              className="group hover:bg-gray-50/50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black text-gray-500 uppercase">
                        {exp.expense_code}
                      </span>
                      <Chip
                        className="font-black text-[10px] uppercase px-1"
                        size="sm"
                        variant="flat"
                      >
                        {exp.category?.name}
                      </Chip>
                    </div>
                    <p className="text-xs font-black text-gray-500 uppercase">
                      {exp.title}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  <Calendar className="text-primary" size={14} />
                  {dayjs(exp.date).format("DD MMM YYYY")}
                </div>
              </TableCell>

              <TableCell>
                <Chip
                  className="font-black uppercase"
                  color="warning"
                  size="sm"
                  variant="dot"
                >
                  {exp.updated?.name}
                </Chip>
              </TableCell>

              <TableCell>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-gray-500 flex items-center gap-1">
                    <ArrowDownLeft className="text-rose-500" size={16} />
                    {formatIDR(exp.amount)}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      className="text-gray-400"
                      radius="full"
                      size="sm"
                      variant="light"
                    >
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Aksi"
                    className="rounded-sm"
                    itemClasses={{
                      base: "text-[11px] font-black uppercase tracking-widest",
                    }}
                  >
                    <DropdownItem key="detail">Lihat Detail</DropdownItem>
                    <DropdownItem key="edit">Edit</DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
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
  );
}
