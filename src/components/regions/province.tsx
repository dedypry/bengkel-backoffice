import { useEffect, useMemo } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProvince } from "@/stores/features/region/region-action";
import {
  setProvinceId,
  setCityId,
} from "@/stores/features/region/region-slice";

interface Props {
  value: number | string | undefined;
  onChange: (val: number) => void;
}

export default function Province({ value, onChange, ...props }: Props & any) {
  const { provinces } = useAppSelector((state) => state.region);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hanya fetch jika data provinsi masih kosong
    if (provinces.length === 0) {
      dispatch(getProvince());
    }
  }, [dispatch, provinces.length]);

  const mappedProvinces = useMemo(
    () =>
      provinces.map((p) => ({
        id: p.id,
        name: p.name,
      })),
    [provinces],
  );

  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      const val = Number(key);

      onChange(val);
      dispatch(setProvinceId(val));

      // Penting: Reset CityId di Redux agar dropdown Kota ikut ter-reset
      dispatch(setCityId(null));
    }
  };

  return (
    <Autocomplete
      classNames={{
        base: "max-w-full",
        listboxWrapper: "max-h-[300px]",
        selectorButton: "text-gray-400",
      }}
      inputProps={{
        classNames: {
          inputWrapper:
            "border-gray-200 group-data-[focus=true]:border-gray-800 shadow-none bg-white",
        },
      }}
      isClearable={false}
      label="Provinsi"
      labelPlacement="outside"
      placeholder="Cari provinsi..."
      selectedKey={value?.toString()}
      variant="bordered"
      onSelectionChange={handleSelectionChange}
      {...props}
    >
      {mappedProvinces.map((prov) => (
        <AutocompleteItem
          key={prov.id.toString()}
          className="capitalize"
          textValue={prov.name}
        >
          {prov.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
