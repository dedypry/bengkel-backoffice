import type { ICustomer } from "@/utils/interfaces/IUser";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { Users } from "lucide-react";
import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCustomer } from "@/stores/features/customer/customer-action";

interface Props {
  value: any;
  onChange: (val: ICustomer | any) => void;
  placeholder?: string;
}

export default function CustomerSearch({
  value,
  onChange,
  placeholder,
}: Props) {
  const { customers: custom } = useAppSelector((state) => state.customer);
  const { company } = useAppSelector((state) => state.auth);
  const customers = (custom || []) as ICustomer[];
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(
        getCustomer({
          noStats: true,
          noPagination: true,
          isVehicle: true,
        }),
      );

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company]);

  const handleSelectionChange = (key: string | number | null) => {
    if (!key) return;

    const selected = customers.find(
      (item) => item.id.toString() === key.toString(),
    );

    if (selected) {
      onChange(selected);
    }
  };

  const handleInputChange = (val: string) => {
    // if (
    //   val &&
    //   !customers.some((c) => c.name.toLowerCase() === val.toLowerCase())
    // ) {
    // }
    const find = customers.find(
      (e) => e.name.toLowerCase() === val.toLowerCase(),
    );

    onChange(find ? find : { name: val, isNew: true });

    // if (!val) {
    //   onChange({ name: "", isNew: false });
    // }
  };

  return (
    <Autocomplete
      allowsCustomValue
      className="max-w-full"
      defaultItems={customers || []}
      inputValue={typeof value === "string" ? value : value?.name || ""}
      label="Nama Pelanggan"
      labelPlacement="outside"
      listboxProps={{
        emptyContent:
          "Pelanggan tidak ditemukan, tekan Enter untuk tambah baru.",
      }}
      placeholder={placeholder || "Cari nama pelanggan..."}
      scrollShadowProps={{
        isEnabled: false,
      }}
      startContent={<Users />}
      onInputChange={handleInputChange}
      onSelectionChange={(key) => handleSelectionChange(key as string)}
    >
      {(item) => (
        <AutocompleteItem
          key={item.id}
          className="capitalize"
          textValue={item.name}
        >
          <div className="flex gap-3 items-center">
            <Avatar
              alt={item.name}
              className="flex-shrink-0"
              size="sm"
              src={
                item.profile?.photo_url ||
                `https://ui-avatars.com/api/?name=${item.name}&background=random`
              }
            />
            <div className="flex flex-col">
              <span className="text-small font-bold">{item.name}</span>
              <span className="text-tiny text-gray-500">
                {item.phone || "Tidak ada nomor"}
              </span>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
