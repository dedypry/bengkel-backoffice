import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Briefcase,
  Download,
  Filter,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Button,
  Input,
  Chip,
  User,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

import HeaderAction from "@/components/header-action";
import { getInitials } from "@/utils/helpers/global";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getEmploye,
  getEmployeSummary,
} from "@/stores/features/employe/employe-action";
import dayjs from "@/utils/helpers/dayjs";
import TableAction from "@/components/table-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { CustomPagination } from "@/components/custom-pagination";
import { setQuerySearch } from "@/stores/features/employe/employe-slice";
import StatCard from "@/components/stat-card";

export default function EmployeesPage() {
  const { summary, list, searchQuery } = useAppSelector(
    (state) => state.employe,
  );
  const { company } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEmployeSummary());
  }, [company, dispatch]);

  useEffect(() => {
    dispatch(getEmploye(searchQuery));
  }, [searchQuery, company, dispatch]);

  const handleDelete = (id: number) => {
    http
      .delete(`/employees/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getEmploye(searchQuery));
      })
      .catch((err) => notifyError(err));
  };

  return (
    <div className="space-y-10 pb-20 px-4 max-w-7xl mx-auto">
      <HeaderAction
        actionIcon={UserPlus}
        actionTitle="Tambah Karyawan"
        leadIcon={Users}
        subtitle="Kelola informasi personil dan dokumen legalitas tim bengkel secara terpusat."
        title="Database Karyawan"
        onAction={() => navigate("/hr/employees/create")}
      />

      {/* Stats Section - Industrial Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "Total Personil",
            val: summary.total,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50/50",
            suffix: "Orang",
          },
          {
            label: "Karyawan Tetap",
            val: summary.permanent,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-50/50",
            suffix: "Personil",
          },
          {
            label: "Divisi Aktif",
            val: summary.department,
            icon: Briefcase,
            color: "text-orange-500",
            bg: "bg-orange-50/50",
            suffix: "Departemen",
          },
        ].map((stat, i) => (
          <StatCard key={i} {...(stat as any)} />
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-gray-50">
        <Input
          isClearable
          className="w-full md:max-w-md"
          classNames={{
            inputWrapper:
              "rounded-2xl border-gray-100 group-data-[focus=true]:border-blue-500 h-14",
          }}
          placeholder="Cari nama, ID, atau jabatan..."
          startContent={<Search className="text-gray-400" size={20} />}
          value={searchQuery.q || ""}
          variant="bordered"
          onValueChange={(val) =>
            dispatch(setQuerySearch({ name: val, page: 1 }))
          }
        />
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            className="h-14 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex-1 md:flex-none"
            startContent={<Filter size={18} />}
            variant="flat"
          >
            Filter
          </Button>
          <Button
            className="h-14 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex-1 md:flex-none"
            startContent={<Download size={18} />}
            variant="flat"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Table
        aria-label="Tabel Karyawan"
        classNames={{
          base: "rounded-[2.5rem] border border-gray-50 bg-white overflow-hidden",
          th: "bg-gray-50/50 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] py-6 italic",
          td: "py-5 border-b border-gray-50/50",
        }}
        shadow="none"
      >
        <TableHeader>
          <TableColumn>PERSONIL</TableColumn>
          <TableColumn>KONTAK & AKSES</TableColumn>
          <TableColumn>STATUS KERJA</TableColumn>
          <TableColumn>MASA KERJA</TableColumn>
          <TableColumn align="center">AKSI</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Data karyawan tidak ditemukan">
          {(list?.data || []).map((emp) => (
            <TableRow
              key={emp.id}
              className="hover:bg-gray-50/30 transition-colors group"
            >
              <TableCell>
                <User
                  avatarProps={{
                    radius: "lg",
                    src: emp.profile?.photo_url,
                    fallback: getInitials(emp.name),
                    className:
                      "size-12 font-black italic text-gray-400 bg-gray-100 border-2 border-white shadow-sm",
                  }}
                  description={
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-blue-500 tracking-tighter">
                        {emp.roles.map((e) => e.name).join(" • ")}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">
                        {emp.department || "No Department"}
                      </span>
                    </div>
                  }
                  name={
                    <span className="font-black italic uppercase text-gray-800 tracking-tight">
                      {emp.name}
                    </span>
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                    <Mail className="text-gray-300" size={12} /> {emp.email}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                    <Phone className="text-gray-300" size={12} />{" "}
                    {emp.profile?.phone_number || "-"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-black italic uppercase text-[9px] px-2 rounded-lg"
                  color={emp.status === "Permanent" ? "success" : "warning"}
                  size="sm"
                  variant="flat"
                >
                  {emp.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-black italic text-gray-700">
                    {dayjs(emp.profile?.join_date).format("DD MMM YYYY")}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Sejak Terdaftar
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <TableAction
                  onDelete={() => handleDelete(emp.id)}
                  onDetail={() => navigate(`/hr/employees/${emp.id}`)}
                  onEdit={() => navigate(`/hr/employees/${emp.id}/edit`)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center px-4">
        <p className="text-[10px] font-black uppercase text-gray-400 italic">
          Menampilkan {list?.data?.length || 0} dari {list?.meta?.total || 0}{" "}
          Personil
        </p>
        <CustomPagination
          meta={list?.meta!}
          onPageChange={(page) => dispatch(setQuerySearch({ page }))}
        />
      </div>

      {/* Decorative Policy Card */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            <CheckCircle2 className="text-emerald-400" size={32} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-xl font-black uppercase italic tracking-tighter">
              Integritas Data SDM
            </h4>
            <p className="text-gray-400 text-sm font-medium italic">
              &quot;Pastikan semua dokumen kontrak karyawan telah diperbarui di
              sistem untuk kepatuhan administrasi.&quot;
            </p>
          </div>
          <Button className="ml-auto bg-white text-gray-900 font-black italic uppercase text-xs h-12 px-8 rounded-2xl">
            Lihat Panduan HR
          </Button>
        </div>
      </div>
    </div>
  );
}
