import type { IVehicle } from "@/utils/interfaces/IUser";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Car } from "lucide-react";

import { useAppSelector } from "@/stores/hooks";

interface Props {
  value: string;
  onChange: (val: IVehicle | any) => void;
}

export default function VehicleOption({ value, onChange }: Props) {
  const { customer } = useAppSelector((state) => state.wo);

  // Mengambil daftar kendaraan milik customer yang sedang dipilih
  const vehicles = customer?.vehicles || [];

  const handleSelectionChange = (key: string | number | null) => {
    if (!key) return;

    const selected = vehicles.find((v) => v.plate_number === key);

    if (selected) {
      onChange(selected);
    }
  };

  const handleInputChange = (val: string) => {
    // Jika mengetik plat nomor baru yang tidak ada di list
    if (
      val &&
      !vehicles.some((v) => v.plate_number.toLowerCase() === val.toLowerCase())
    ) {
      onChange({
        plate_number: val.toUpperCase(), // Standarisasi plat nomor ke uppercase
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
      startContent={<Car />}
      onInputChange={handleInputChange}
      onSelectionChange={(key) => handleSelectionChange(key as string)}
    >
      {(item) => (
        <AutocompleteItem key={item.plate_number} textValue={item.plate_number}>
          <div className="flex flex-col">
            <span className="font-bold text-small uppercase">
              {item.plate_number}
            </span>
            <span className="text-tiny">
              {item.brand} {item.model} ({item.year})
            </span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
