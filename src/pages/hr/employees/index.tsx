import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Input,
  Chip,
  User,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";

import HeaderAction from "@/components/header-action";
import { getInitials, getJoinDuration } from "@/utils/helpers/global";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getEmploye,
  getEmployeSummary,
} from "@/stores/features/employe/employe-action";
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
  const hasFetched = useRef(false);
  const hasEmployeeFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getEmployeSummary());

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, dispatch]);

  useEffect(() => {
    if (!hasEmployeeFetched.current) {
      hasEmployeeFetched.current = true;
      dispatch(getEmploye(searchQuery));

      setTimeout(() => {
        hasEmployeeFetched.current = false;
      }, 1000);
    }
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
            color: "text-primary",
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

      {/* Table Section */}
      <Card>
        <CardHeader className="flex justify-end">
          <div>
            <Input
              isClearable
              placeholder="Cari nama, ID, atau jabatan..."
              startContent={<Search className="text-gray-400" size={20} />}
              value={searchQuery.q || ""}
              variant="bordered"
              onValueChange={(val) =>
                dispatch(setQuerySearch({ name: val, page: 1 }))
              }
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper aria-label="Tabel Karyawan" shadow="none">
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
                          "size-12 font-black  text-gray-400 bg-gray-100 border-2 border-white shadow-sm",
                      }}
                      description={
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-primary">
                            {emp.roles.map((e) => e.name).join(" • ")}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            {emp.department || "No Department"}
                          </span>
                        </div>
                      }
                      name={
                        <span className="font-black uppercase text-gray-500">
                          {emp.name}
                        </span>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] text-gray-600">
                        <Mail size={12} /> {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-600">
                        <Phone size={12} /> {emp.profile?.phone_number || "-"}
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
                      <span className="text-xs font-black text-gray-500">
                        {getJoinDuration(emp.profile?.join_date || "", true)}
                      </span>
                      <span className="text-[9px] font-bold text-gray-500 uppercase">
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
        </CardBody>
      </Card>

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
    </div>
  );
}
