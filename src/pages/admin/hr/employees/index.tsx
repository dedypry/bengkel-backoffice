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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HeaderAction from "@/components/header-action";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/utils/helpers/global";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getEmploye,
  getEmployeSummary,
} from "@/stores/features/employe/employe-action";
import dayjs from "@/utils/helpers/dayjs";
import StatCard from "@/components/stat-card";
import TableAction from "@/components/table-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { CustomPagination } from "@/components/custom-pagination";
import { setQuerySearch } from "@/stores/features/employe/employe-slice";

export default function EmployeesPage() {
  const { summary, list, searchQuery } = useAppSelector(
    (state) => state.employe,
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEmployeSummary());
  }, []);

  useEffect(() => {
    dispatch(getEmploye(searchQuery));
  }, [searchQuery]);

  function handleDelete(id: number) {
    http
      .delete(`/employees/${id}`)
      .then(({ data }) => {
        notify(data.message);
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      <HeaderAction
        actionIcon={UserPlus}
        actionTitle="Tambah Karyawan"
        leadIcon={Users}
        subtitle="Kelola informasi personil dan dokumen legalitas timbengkel."
        title="Database Karyawan"
        onAction={() => navigate("/hr/employees/create")}
      />

      {/* Stats Cards - Cerah & Clean */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Karyawan",
            val: `${summary.total} Orang`,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Karyawan Tetap",
            val: `${summary.permanent} Orang`,
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Departemen",
            val: `${summary.department} Divisi`,
            icon: Briefcase,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Filter & Search Bar */}
      <Card className="shadow-lg shadow-gray-200">
        <CardContent className="flex gap-2">
          <div className="flex-1 flex gap-2 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-blue-400" />
            <Input
              className="h-14 pl-14 pr-6 rounded-2xl border-none bg-blue-50/30 font-bold text-slate-700 placeholder:text-blue-300"
              placeholder="Cari karyawan berdasarkan nama, ID, atau jabatan..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
              variant="outline"
            >
              <Filter size={18} /> Departemen
            </Button>
            <Button
              className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50"
              variant="outline"
            >
              <Download size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="shadow-gray-100 shadow-lg">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Tanggal Masuk</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(list?.data || []).map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="size-14 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={emp.profile?.photo_url} />
                        <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-800 text-mg leading-tight">
                          {emp.name}
                        </p>
                        <p className="text-xs font-semibold text-blue-500 mt-1">
                          {emp.roles.map((e) => e.name).join(" | ")}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {emp.department}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Mail className="text-slate-500" size={14} />{" "}
                        {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Phone className="text-slate-500" size={14} />{" "}
                        {emp.profile?.phone_number}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-lg px-3 py-1 font-semibold text-[9px] uppercase border-none
                      ${emp.status === "Permanent" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-slate-700">
                      {dayjs(emp.profile?.join_date || new Date()).format(
                        "ddd, DD MMM YYYY",
                      )}
                    </p>
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
          <CustomPagination
            meta={list?.meta!}
            onPageChange={(page) => {
              dispatch(
                setQuerySearch({
                  page,
                }),
              );
              console.log("PAGE", page);
            }}
          />
        </CardContent>
      </Card>

      {/* Info Alert - Soft Blue */}
      <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-[2rem] flex items-center gap-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-500">
          <CheckCircle2 size={24} />
        </div>
        <p className="text-sm font-bold text-blue-800 italic">
          &quot;Pastikan semua dokumen kontrak karyawan telah diperbarui di
          sistem untuk kepatuhan administrasi.&quot;
        </p>
      </div>
    </div>
  );
}
