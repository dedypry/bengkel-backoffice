import { useEffect, useMemo, forwardRef } from "react"; // Tambah forwardRef
import { Autocomplete, AutocompleteItem } from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDistrict } from "@/stores/features/region/region-action";

interface Props {
  value: number | string | undefined;
  onChange: (val: number) => void;
}

// Gunakan forwardRef agar Controller dari React Hook Form bisa menyuntikkan ref
const District = forwardRef<HTMLInputElement, Props & any>(
  ({ value, onChange, ...props }, ref) => {
    const { city_id, district } = useAppSelector((state) => state.region);
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (city_id) {
        dispatch(getDistrict(city_id));
      }
    }, [city_id, dispatch]);

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
        // Teruskan ref ke Autocomplete agar fokus/validasi RHF bekerja
        ref={ref}
        isDisabled={!city_id || district.length === 0}
        label="Kecamatan"
        labelPlacement="outside"
        placeholder={city_id ? "PILIH KECAMATAN..." : "PILIH KOTA DAHULU"}
        radius="sm"
        selectedKey={value?.toString()}
        variant="bordered"
        onSelectionChange={handleSelectionChange}
        {...props}
      >
        {mappedDistricts.map((item) => (
          <AutocompleteItem
            key={item.id.toString()}
            className="capitalize font-bold text-gray-700"
            textValue={item.name}
          >
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    );
  },
);

District.displayName = "District";

export default District;
