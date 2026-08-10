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
import { useTranslation } from "react-i18next";

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
import debounce from "@/utils/helpers/debounce";

export default function EmployeesPage() {
  const { t } = useTranslation();
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

  const searchDebounce = debounce((q) => dispatch(setQuerySearch({ q })), 1000);

  return (
    <div className="space-y-10 pb-20">
      <HeaderAction
        actionIcon={UserPlus}
        actionTitle={t("hr.employees.add")}
        leadIcon={Users}
        subtitle={t("hr.employees.subtitle")}
        title={t("hr.employees.title")}
        onAction={() => navigate("/hr/employees/create")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: t("hr.employees.stat_total"),
            val: summary.total,
            icon: Users,
            color: "text-primary",
            bg: "bg-blue-50/50",
            suffix: t("hr.employees.suffix_people"),
          },
          {
            label: t("hr.employees.stat_permanent"),
            val: summary.permanent,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-50/50",
            suffix: t("hr.employees.suffix_personnel"),
          },
          {
            label: t("hr.employees.stat_departments"),
            val: summary.department,
            icon: Briefcase,
            color: "text-orange-500",
            bg: "bg-orange-50/50",
            suffix: t("hr.employees.suffix_departments"),
          },
        ].map((stat, i) => (
          <StatCard key={i} {...(stat as any)} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex justify-end">
          <div>
            <Input
              isClearable
              defaultValue={searchQuery.q}
              placeholder={t("hr.employees.search_placeholder")}
              startContent={<Search className="text-gray-400" size={20} />}
              variant="bordered"
              onValueChange={searchDebounce}
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table
            removeWrapper
            aria-label={t("hr.employees.table_aria")}
            shadow="none"
          >
            <TableHeader>
              <TableColumn>{t("hr.employees.col_personnel")}</TableColumn>
              <TableColumn>{t("hr.employees.col_contact")}</TableColumn>
              <TableColumn>{t("hr.employees.col_status")}</TableColumn>
              <TableColumn>{t("hr.employees.col_tenure")}</TableColumn>
              <TableColumn align="center">
                {t("hr.employees.col_actions")}
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={t("hr.employees.empty")}>
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
                          "size-12 font-black  text-gray-400 bg-gray-100 border-2 border-white shadow-sm cursor-pointer",
                      }}
                      description={
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-primary">
                            {emp.roles.map((e) => e.name).join(" • ")}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            {emp.department || t("hr.common.no_department")}
                          </span>
                        </div>
                      }
                      name={
                        <span className="font-black uppercase text-gray-500  cursor-pointer hover:text-primary">
                          {emp.name}
                        </span>
                      }
                      onClick={() => navigate(`/hr/employees/${emp.id}`)}
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
                      {emp.status === "Permanent"
                        ? t("hr.common.status_permanent")
                        : t("hr.common.status_contract")}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-500">
                        {getJoinDuration(emp.profile?.join_date || "", true)}
                      </span>
                      <span className="text-[9px] font-bold text-gray-500 uppercase">
                        {t("hr.common.since_registered")}
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
          {t("hr.common.showing", {
            shown: list?.data?.length || 0,
            total: list?.meta?.total || 0,
          })}
        </p>
        <CustomPagination
          meta={list?.meta!}
          onPageChange={(page) => dispatch(setQuerySearch({ page }))}
        />
      </div>
    </div>
  );
}
