import { useEffect, useMemo, forwardRef } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCity } from "@/stores/features/region/region-action";
import { setCityId } from "@/stores/features/region/region-slice";

interface Props {
  value: number | string | undefined;
  onChange: (val: number) => void;
}

// Membungkus dengan forwardRef untuk menangani ref dari React Hook Form
const City = forwardRef<HTMLInputElement, Props & any>(
  ({ value, onChange, ...props }, ref) => {
    const { province_id, cities } = useAppSelector((state) => state.region);
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (province_id) {
        dispatch(getCity(province_id));
      }
    }, [province_id, dispatch]);

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
        ref={ref}
        allowsCustomValue={false}
        isDisabled={!province_id || cities.length === 0}
        label="Kota/Kabupaten"
        placeholder={province_id ? "CARI KOTA..." : "PILIH PROVINSI DAHULU"}
        selectedKey={value?.toString()}
        showScrollIndicators={true}
        onSelectionChange={handleSelectionChange}
        {...props}
      >
        {mappedCities.map((city) => (
          <AutocompleteItem
            key={city.id.toString()}
            className="capitalize font-bold text-gray-700"
            textValue={city.name}
          >
            {city.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    );
  },
);

City.displayName = "City";

export default City;
