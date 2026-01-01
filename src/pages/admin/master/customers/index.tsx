import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Car,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCustomer } from "@/stores/features/customer/customer-action";
import { getInitials } from "@/utils/helpers/global";
import { formatNumber } from "@/utils/helpers/format";
import { CustomPagination } from "@/components/custom-pagination";
import { setCustomerQuery } from "@/stores/features/customer/customer-slice";
import debounce from "@/utils/helpers/debounce";
import TableAction from "@/components/table-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function MasterPelanggan() {
  const { company } = useAppSelector((state) => state.auth);
  const { customers, query } = useAppSelector((state) => state.customer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCustomer(query));
  }, [query, company]);

  const searchDebounce = debounce((val) => {
    dispatch(setCustomerQuery({ q: val }));
  }, 1000);

  function handleDelete(id: number) {
    http
      .delete(`/customers/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getCustomer(query));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <HeaderAction
        actionIcon={UserPlus}
        actionTitle="Tambah Pelanggan Baru"
        leadIcon={Users}
        subtitle="Kelola informasi kontak dan profil pemilik kendaraan."
        title="Database Pelanggan"
        onAction={() => navigate("/master/customers/create")}
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Cari nama, email, atau nomor telepon..."
            onChange={(e) => searchDebounce(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            Status: Semua
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-xs uppercase font-bold text-slate-500">
              <th className="p-4">Profil Pelanggan</th>
              <th className="p-4">Kontak</th>
              <th className="p-4">Alamat</th>
              <th className="p-4 text-center">Unit Kendaraan</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers?.data.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border">
                      <AvatarImage
                        src={
                          customer?.profile?.photo_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`
                        }
                      />
                      <AvatarFallback>
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-slate-800">
                        {customer.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {customer.nik_ktp}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail className="size-3 text-slate-400" />{" "}
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Phone className="size-3 text-emerald-500" />{" "}
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-start gap-1 max-w-50">
                    <MapPin className="size-3 text-slate-400 mt-1 shrink-0" />
                    <span className="text-xs text-slate-500 line-clamp-2">
                      {customer.profile?.address}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    <Car className="size-3" />
                    {customer.total_vehicle} Unit
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Badge
                    className={
                      customer.status === "active"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "opacity-50"
                    }
                    variant={
                      customer.status === "active" ? "default" : "secondary"
                    }
                  >
                    {customer.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <TableAction
                    onDelete={() => handleDelete(customer.id)}
                    onDetail={() =>
                      navigate(`/master/customers/${customer.id}`)
                    }
                    onEdit={() =>
                      navigate(`/master/customers/${customer.id}/edit`)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <CustomPagination
          meta={customers?.meta!}
          onPageChange={(page) => {
            dispatch(setCustomerQuery({ page }));
          }}
        />
      </div>

      {/* Info Card */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900">
              Total Pelanggan Terdaftar
            </p>
            <p className="text-xs text-indigo-700">{customers?.stats?.label}</p>
          </div>
        </div>
        <h2 className="text-3xl font-black text-indigo-900 pr-4">
          {formatNumber(customers?.meta.total || 0)}
        </h2>
      </div>
    </div>
  );
}
