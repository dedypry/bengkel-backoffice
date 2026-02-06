import { useEffect, useMemo } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCity } from "@/stores/features/region/region-action";
import { setCityId } from "@/stores/features/region/region-slice";

interface Props {
  value: number | string | undefined;
  onChange: (val: number) => void;
}

export default function City({ value, onChange, ...props }: Props & any) {
  const { province_id, cities } = useAppSelector((state) => state.region);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (province_id) {
      dispatch(getCity(province_id));
    }
  }, [province_id, dispatch]);

  // Format data untuk Autocomplete
  const mappedCities = useMemo(
    () =>
      cities.map((city) => ({
        id: city.id,
        name: city.name,
      })),
    [cities],
  );

  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      const val = Number(key);

      onChange(val);
      dispatch(setCityId(val));
    }
  };

  return (
    <Autocomplete
      allowsCustomValue={false}
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
      isDisabled={!province_id || cities.length === 0}
      label="Kota/Kabupaten"
      labelPlacement="outside"
      placeholder="Ketik nama kota..."
      selectedKey={value?.toString()}
      showScrollIndicators={true}
      variant="bordered"
      onSelectionChange={handleSelectionChange}
      {...props}
    >
      {mappedCities.map((city) => (
        <AutocompleteItem
          key={city.id.toString()}
          className="capitalize"
          textValue={city.name}
        >
          {city.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
