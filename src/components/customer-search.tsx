import type { ICustomer } from "@/utils/interfaces/IUser";

import {
  Autocomplete,
  AutocompleteOption,
  createFilterOptions,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { Search, User2 } from "lucide-react";

import { useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";

interface Props {
  value: any;
  onChange: (val: ICustomer) => void;
  placeholder?: string;
}

const filter = createFilterOptions<any>();

export default function CustomerSearch({
  value,
  onChange,
  placeholder,
}: Props) {
  const { customers } = useAppSelector((state) => state.customer);

  const getSelectedValue = () =>
    customers?.data.find((item) => item.id === value) || {
      name: value,
    };

  return (
    <Autocomplete
      disableClearable
      freeSolo
      endDecorator={<Search />}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Jika input tidak kosong dan tidak ada di list, tampilkan opsi "Add"
        const isExisting = options.some((option) => inputValue === option.name);

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            name: inputValue,
            label: `Tambah "${inputValue}"`,
            isNew: true, // Flag untuk menandai ini data baru
          });
        }

        return filtered;
      }}
      getOptionLabel={(option: any) => {
        if (typeof option === "string") return option;
        if (option.isNew) return option.name;

        return option.name || "";
      }}
      options={customers?.data || []}
      placeholder={placeholder}
      renderOption={(props, option: any) => {
        return (
          <AutocompleteOption {...props} key={option.id}>
            {!option.isNew && (
              <ListItemDecorator>
                <img
                  alt=""
                  loading="lazy"
                  src={
                    option.profile?.photo_url || getAvatarByName(option.name)
                  }
                  width="20"
                />
              </ListItemDecorator>
            )}

            <ListItemContent sx={{ fontSize: "sm" }}>
              {option.isNew ? option.label : option.name}
              <Typography level="body-xs">{option.phone}</Typography>
            </ListItemContent>
          </AutocompleteOption>
        );
      }}
      slotProps={{
        input: {
          autoComplete: "new-password", // disable autocomplete and autofill
        },
      }}
      startDecorator={<User2 />}
      type="search"
      value={getSelectedValue()}
      onChange={(_, val) => {
        onChange(val as any);
      }}
    />
  );
}
