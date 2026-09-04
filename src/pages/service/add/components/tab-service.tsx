import type { IService } from "@/utils/interfaces/IService";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Chip,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";

import {
  addWoService,
  removeWoService,
} from "@/stores/features/work-order/wo-slice";
import { setServiceQuery } from "@/stores/features/service/service-slice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import debounce from "@/utils/helpers/debounce";
// Menggunakan InputNumber HeroUI kita
import InputQty from "@/components/input-qty";
import { ISupplier } from "@/utils/interfaces/ISupplier";
import InputNumber from "@/components/input-number";
import { asArray } from "@/utils/helpers/as-array";

export default function TabService() {
  const { t } = useTranslation();
  const { services, query } = useAppSelector((state) => state.service);
  const { services: selectedServices } = useAppSelector((state) => state.wo);
  const { suppliers } = useAppSelector((state) => state.supplier);
  const supplierOptions = asArray<ISupplier>(suppliers);

  const [search, setSearch] = useState(query.q ?? "");

  useEffect(() => {
    setSearch(query.q ?? "");
  }, [query.q]);

  const selectedIds = selectedServices.map((e) => e.id);
  const dispatch = useAppDispatch();

  function handleCheck(isCheck: boolean, item: IService) {
    if (isCheck) {
      dispatch(addWoService({ ...item, qty: 1 }));
    } else {
      dispatch(removeWoService(item));
    }
  }

  function handleQty(item: IService, qty: number) {
    if (qty > 0) {
      dispatch(addWoService({ ...item, qty }));
    } else {
      dispatch(removeWoService(item));
    }
  }

  function handleSupplier(val: any, item: IService) {
    if (val) {
      dispatch(
        addWoService({
          ...item,
          supplier_id: +val,
          qty: (item as any)?.qty || 1,
        }),
      );
    }
  }

  const handlePrice = debounce((val: number, item: IService) => {
    dispatch(
      addWoService({
        ...item,
        price: val as any,
      }),
    );
  }, 1000);

  function findQty(item: IService) {
    const find = selectedServices.find((e) => e.id === item.id);

    return find;
  }

  const searchDebounce = debounce((q: string) => {
    dispatch(setServiceQuery({ q, page: 1 }));
  }, 500);

  return (
    <div className="space-y-4">
      {/* Search Input HeroUI */}
      <Input
        isClearable
        className="max-w-full"
        placeholder={t("service.add.search_service")}
        startContent={<Search className="text-default-400" size={18} />}
        value={search}
        variant="bordered"
        onChange={(e) => {
          setSearch(e.target.value);
          searchDebounce(e.target.value);
        }}
        onClear={() => {
          setSearch("");
          dispatch(setServiceQuery({ q: "", page: 1 }));
        }}
      />

      <Table removeWrapper aria-label={t("service.add.service_table_aria")}>
        <TableHeader>
          <TableColumn width={40}>{t("service.add.select_col")}</TableColumn>
          <TableColumn>{t("service.add.service_name_col")}</TableColumn>
          <TableColumn>{t("service.add.supplier_col")}</TableColumn>
          <TableColumn align="end">
            {t("service.add.unit_price_col")}
          </TableColumn>
          <TableColumn align="center" width={160}>
            {t("service.add.qty_duration_col")}
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("service.add.service_empty")}>
          {(services?.data || []).map((item) => {
            const find = findQty(item);
            const isSelected = selectedIds.includes(item.id);
            const price = Number(find?.price || item.price).toString();
            const itemData = { ...item, ...find };

            return (
              <TableRow
                key={item.id}
                className="border-b border-default-50 last:border-none"
              >
                <TableCell>
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={(isSelected) =>
                      handleCheck(isSelected, item)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-default-700">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-tiny text-gray-400 font-mono">
                        {item.code}
                      </span>
                      <Chip
                        className="border-none h-4 text-[10px]"
                        color="primary"
                        size="sm"
                        variant="dot"
                      >
                        {t("service.add.service_chip")}
                      </Chip>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Autocomplete
                    classNames={{
                      clearButton: "text-gray-500",
                    }}
                    defaultItems={supplierOptions}
                    placeholder={t("service.add.search_supplier")}
                    selectedKey={find?.supplier_id?.toString()}
                    size="sm"
                    onSelectionChange={(val) => handleSupplier(val, itemData)}
                  >
                    {(supplier) => (
                      <AutocompleteItem
                        key={supplier.id.toString()}
                        textValue={supplier.name}
                      >
                        {supplier.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </TableCell>
                <TableCell>
                  <InputNumber
                    classNames={{
                      input: "text-right",
                    }}
                    isDisabled={!isSelected}
                    size="sm"
                    startContent="Rp"
                    value={price}
                    onInput={(val) => handlePrice(val, itemData)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <InputQty
                      handleQty={(newVal) => handleQty(itemData, newVal)}
                      value={find?.qty || 0}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
