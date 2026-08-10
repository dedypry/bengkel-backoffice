import type { ISupplier } from "@/utils/interfaces/ISupplier";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
} from "@heroui/react";
import {
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  Truck,
  Download,
} from "lucide-react";

import AddSupplierModal from "./components/add-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setSupplierQuery } from "@/stores/features/supplier/supplier-slice";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";
import debounce from "@/utils/helpers/debounce";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function MasterSupplierPage() {
  const { t } = useTranslation();
  const { suppliers, supplierQuery } = useAppSelector(
    (state) => state.supplier,
  );
  const { company } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>();
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getSupplier(supplierQuery));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [supplierQuery, company, dispatch]);

  const handleDelete = (id: number) => {
    http
      .delete(`/suppliers/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getSupplier(supplierQuery));
      })
      .catch((err) => notifyError(err));
  };

  const searchDebounce = debounce((q) => {
    dispatch(setSupplierQuery({ q }));
  }, 1000);

  return (
    <div className="space-y-6 pb-20">
      <AddSupplierModal
        open={open}
        setOpen={setOpen}
        supplier={selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
      />

      <HeaderAction
        actionContent={
          <div className="flex gap-2">
            <Button
              className="bg-emerald-50 text-emerald-700 font-bold"
              isLoading={isExcelLoading}
              startContent={
                !isExcelLoading ? <Download size={16} /> : undefined
              }
              variant="flat"
              onPress={() =>
                void handleDownloadExcel(
                  "/suppliers/export/excel",
                  supplierQuery,
                  "master-supplier",
                  setIsExcelLoading,
                )
              }
            >
              {t("master.suppliers.export")}
            </Button>
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onPress={() => setOpen(true)}
            >
              {t("master.suppliers.add")}
            </Button>
          </div>
        }
        leadIcon={Truck}
        subtitle={t("master.suppliers.subtitle")}
        title={t("master.suppliers.title")}
      />

      {/* Control Bar: Pencarian & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <Input
          isClearable
          defaultValue={supplierQuery.q}
          placeholder={t("master.suppliers.search_placeholder")}
          startContent={<Search className=" text-gray-400" size={20} />}
          onValueChange={searchDebounce}
        />

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            color="primary"
            onPress={() => dispatch(setSupplierQuery({ q: supplierQuery.q }))}
          >
            {t("common.search")}
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Table
        isStriped
        aria-label="Tabel Supplier"
        classNames={{
          td: "py-4 px-6 border-b border-gray-200",
        }}
      >
        <TableHeader>
          <TableColumn width={150}>
            {t("master.suppliers.table.code")}
          </TableColumn>
          <TableColumn>{t("master.suppliers.table.supplier")}</TableColumn>
          <TableColumn>{t("master.suppliers.table.contact")}</TableColumn>
          <TableColumn>{t("master.suppliers.table.info")}</TableColumn>
          <TableColumn width={120}>
            {t("master.suppliers.table.status")}
          </TableColumn>
          <TableColumn align="center" width={80}>
            {t("master.suppliers.table.actions")}
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("master.suppliers.table.empty")}>
          {(suppliers?.data || []).map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell>
                <Chip
                  className="font-black text-gray-600s rounded-sm"
                  size="sm"
                  variant="flat"
                >
                  {item.code}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <p className="font-black text-gray-600 uppercase text-xs truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin size={12} />
                    <span className="text-[10px] truncate max-w-[200px]">
                      {item.address || t("master.suppliers.no_address")}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="text-gray-500" size={14} />
                    <span className="text-xs font-bold">
                      {item.phone || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="text-gray-500" size={14} />
                    <span className="text-xs font-bold">
                      {item.email || "-"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase">
                    NPWP: {item.npwp || "-"}
                  </p>
                  {item.website && (
                    <a
                      className="flex items-center gap-1 text-blue-500 hover:underline text-[10px] font-bold"
                      href={`https://${item.website}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ExternalLink size={10} /> {item.website}
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-black uppercase text-[10px] border-none"
                  color={item.is_active ? "success" : "default"}
                  size="sm"
                  variant="dot"
                >
                  {item.is_active
                    ? t("master.suppliers.active")
                    : t("master.suppliers.inactive")}
                </Chip>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <MoreVertical className="text-gray-400" size={20} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Aksi Supplier" variant="flat">
                    <DropdownItem
                      key="edit"
                      startContent={<Edit2 size={16} />}
                      onPress={() => {
                        setSelectedSupplier(item);
                        setOpen(true);
                      }}
                    >
                      {t("master.suppliers.edit_data")}
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 size={16} />}
                      onPress={() => confirmSweat(() => handleDelete(item.id))}
                    >
                      {t("master.suppliers.delete_supplier")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        meta={suppliers?.meta!}
        onPageChange={(page) => dispatch(setSupplierQuery({ page }))}
      />
    </div>
  );
}
