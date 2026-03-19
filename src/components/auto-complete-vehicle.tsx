import { Autocomplete, AutocompleteItem, InputProps } from "@heroui/react";

interface Props {
  items: any[];
  value: string;
  onValueChange: (val: string) => void;
}
export default function AutoCompleteVehilce({
  items,
  onValueChange,
  value,
  ...props
}: Props & InputProps) {
  const defaultItem = items.map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <Autocomplete
      allowsCustomValue
      defaultFilter={(textValue, filterValue) =>
        textValue?.toLowerCase().includes(filterValue?.toLowerCase())
      }
      defaultItems={defaultItem}
      inputProps={props}
      inputValue={value}
      listboxProps={{
        emptyContent:
          "Kendaraan tidak ditemukan, tekan Enter untuk tambah baru.",
      }}
      placeholder="Pilih Merk"
      onInputChange={onValueChange}
      onSelectionChange={(val) => onValueChange(val as string)}
    >
      {(item) => (
        <AutocompleteItem key={item.value} textValue={item.value}>
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
