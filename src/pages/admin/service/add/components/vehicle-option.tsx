import type { IVehicle } from "@/utils/interfaces/IUser";

import {
  Autocomplete,
  AutocompleteOption,
  createFilterOptions,
  ListItemContent,
} from "@mui/joy";

import { useAppSelector } from "@/stores/hooks";
const filter = createFilterOptions<any>();

interface Props {
  value: string;
  onChange: (val: IVehicle) => void;
}
export default function VehicleOption({ value, onChange }: Props) {
  const { customer } = useAppSelector((state) => state.wo);

  const getSelectedValue = () =>
    (customer?.vehicles || []).find((item) => item.plate_number === value) || {
      plate_number: value,
    };

  return (
    <Autocomplete
      disableClearable
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.plate_number,
        );

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            plate_number: inputValue,
            label: `Tambah "${inputValue}"`,
            isNew: true,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option: any) => {
        if (typeof option === "string") return option;
        if (option.isNew) return option.plate_number;

        return option.plate_number || "";
      }}
      options={customer?.vehicles || []}
      placeholder="Pilih No. Polisi"
      renderOption={(props, option: any) => {
        return (
          <AutocompleteOption {...props} key={option.id}>
            <ListItemContent sx={{ fontSize: "sm" }}>
              {option.isNew ? option.label : option.plate_number}
            </ListItemContent>
          </AutocompleteOption>
        );
      }}
      slotProps={{
        input: {
          autoComplete: "new-password",
        },
      }}
      value={getSelectedValue()}
      onChange={(_, val) => {
        onChange(val as any);
      }}
    />
  );
}
