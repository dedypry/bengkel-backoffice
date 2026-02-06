import { useEffect, useMemo } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDistrict } from "@/stores/features/region/region-action";

interface Props {
  value: number | string | undefined;
  onChange: (val: number) => void;
}

export default function District({ value, onChange, ...props }: Props & any) {
  const { city_id, district } = useAppSelector((state) => state.region);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (city_id) {
      dispatch(getDistrict(city_id));
    }
  }, [city_id, dispatch]);

  // Optimasi mapping data untuk list kecamatan
  const mappedDistricts = useMemo(
    () =>
      district.map((d) => ({
        id: d.id,
        name: d.name,
      })),
    [district],
  );

  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      onChange(Number(key));
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
      isDisabled={!city_id || district.length === 0}
      label="Kecamatan"
      labelPlacement="outside"
      placeholder={city_id ? "Cari kecamatan..." : "Pilih kota dahulu"}
      selectedKey={value?.toString()}
      showScrollIndicators={true}
      variant="bordered"
      onSelectionChange={handleSelectionChange}
      {...props}
    >
      {mappedDistricts.map((item) => (
        <AutocompleteItem
          key={item.id.toString()}
          className="capitalize"
          textValue={item.name}
        >
          {item.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
