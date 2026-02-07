import { useEffect, useMemo, useRef, forwardRef } from "react";
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

const Province = forwardRef<HTMLInputElement, Props & any>(
  ({ value, onChange, ...props }, ref) => {
    const { provinces } = useAppSelector((state) => state.region);
    const dispatch = useAppDispatch();
    const hasFetched = useRef(false);

    useEffect(() => {
      if (provinces.length === 0 && !hasFetched.current) {
        hasFetched.current = true;
        dispatch(getProvince());

        const timer = setTimeout(() => {
          hasFetched.current = false;
        }, 1000);

        return () => clearTimeout(timer);
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

        // Reset CityId di Redux agar dropdown Kota ikut ter-reset secara sistem
        dispatch(setCityId(null));
      }
    };

    return (
      <Autocomplete
        ref={ref}
        isClearable={false}
        label="Provinsi"
        placeholder="CARI PROVINSI..."
        radius="sm"
        selectedKey={value?.toString()}
        onSelectionChange={handleSelectionChange}
        {...props}
      >
        {mappedProvinces.map((prov) => (
          <AutocompleteItem
            key={prov.id.toString()}
            className="capitalize font-bold text-gray-700"
            textValue={prov.name}
          >
            {prov.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    );
  },
);

Province.displayName = "Province";

export default Province;
