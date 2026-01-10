import { Autocomplete } from "@mui/joy";

interface Props {
  value: any;
  onChange: (val: any) => void;
  items: {
    label: string;
    value: any;
    description?: string;
  }[];
  placeholder?: string;
  titleEmpty?: string;
  className?: string;
  isClearable?: boolean;
  isMulti?: boolean;
}

export default function Combobox({
  value,
  onChange,
  items,
  placeholder = "Pilih...",
  titleEmpty = "Data tidak ditemukan",
  className,
  isClearable = true,
  isMulti = false,
}: Props) {
  const getSelectedValue = () => {
    if (isMulti) {
      return items.filter((item) => value?.includes(item.value)) || [];
    }

    return items.find((item) => item.value === value) || null;
  };

  return (
    <Autocomplete
      className={className}
      disableClearable={!isClearable}
      getOptionLabel={(option) => option.label || ""}
      isOptionEqualToValue={(option, val) => option.value === val?.value}
      multiple={isMulti}
      noOptionsText={titleEmpty}
      options={items}
      placeholder={placeholder}
      slotProps={{
        input: {
          autoComplete: "new-password",
        },
      }}
      value={getSelectedValue()}
      onChange={(_, val: any) => {
        if (isMulti) {
          onChange(val?.length > 0 ? val.map((e: any) => e.value) : []);
        } else {
          onChange(val ? val.value : null);
        }
      }}
    />
  );
}
