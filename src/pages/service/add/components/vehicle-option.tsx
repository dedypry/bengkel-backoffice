import type { IVehicle } from "@/utils/interfaces/IUser";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Car } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getVehicle } from "@/stores/features/vehicle/vehicle-action";
import debounce from "@/utils/helpers/debounce";

interface Props {
  value: string;
  onChange: (val: IVehicle | any) => void;
}

export default function VehicleOption({ value, onChange }: Props) {
  const dispatch = useAppDispatch();
  const { vehicles: dataVehicles } = useAppSelector((state) => state.vehicle);
  const { company } = useAppSelector((state) => state.auth);
  const hasFetched = useRef(false);

  const vehicles = useMemo(
    () => (Array.isArray(dataVehicles?.data) ? dataVehicles?.data || [] : []),
    [dataVehicles?.data],
  );

  const searchDebounce = useMemo(
    () =>
      debounce((q: string) => {
        dispatch(
          getVehicle({
            page: 1,
            pageSize: 500,
            q: q || undefined,
          }),
        );
      }, 400),
    [dispatch],
  );

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getVehicle({ page: 1, pageSize: 500 }));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, dispatch]);

  const handleSelectionChange = (key: string | number | null) => {
    if (!key) return;

    const selected = vehicles.find((v) => v.plate_number === key);

    if (selected) {
      onChange(selected);
    }
  };

  const normalizePlate = (plate: string) =>
    plate.replace(/\s/g, "").toLowerCase();

  const handleInputChange = (val: string) => {
    searchDebounce(val.trim());

    if (!val.trim()) {
      onChange({ plate_number: "", isNew: true });

      return;
    }

    const existing = vehicles.find(
      (v) => normalizePlate(v.plate_number) === normalizePlate(val),
    );

    if (existing) {
      onChange(existing);
    } else {
      onChange({
        plate_number: val.toUpperCase(),
        isNew: true,
      });
    }
  };

  return (
    <Autocomplete
      allowsCustomValue
      aria-label="Pilih Kendaraan"
      className="max-w-full"
      defaultItems={vehicles}
      inputValue={value || ""}
      label="No. Polisi (Nopol)"
      labelPlacement="outside"
      listboxProps={{
        emptyContent:
          "Kendaraan tidak ditemukan, tekan Enter untuk mendaftarkan plat ini.",
      }}
      placeholder="Pilih atau ketik No. Polisi..."
      scrollShadowProps={{
        isEnabled: false,
      }}
      startContent={<Car />}
      onInputChange={handleInputChange}
      onSelectionChange={(key) => handleSelectionChange(key as string)}
    >
      {(item) => (
        <AutocompleteItem key={item.plate_number} textValue={item.plate_number}>
          {item.plate_number}
          {/* <div className="flex flex-col gap-0.5 py-0.5">
            <span className="font-medium">{item.plate_number}</span>
            {(item.brand || item.model) && (
              <span className="text-xs text-default-500">
                {[item.brand, item.model, item.year].filter(Boolean).join(" ")}
              </span>
            )}
          </div> */}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
