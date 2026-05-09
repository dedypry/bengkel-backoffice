import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Controller } from "react-hook-form";

export default function AutocompleteControl({
  control,
  items,
  name,
  label,
  placeholder,
  keyValue = "id",
  keyLabel = "name",
}: {
  control: any;
  items: any[];
  name: string;
  label: string;
  placeholder?: string;
  keyValue?: string;
  keyLabel?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          defaultItems={items}
          errorMessage={fieldState.error?.message}
          inputProps={{
            classNames: {
              label: "w-28 text-sm",
              mainWrapper: "w-full",
            },
          }}
          isInvalid={!!fieldState.error}
          label={label}
          labelPlacement="outside-left"
          placeholder={placeholder}
          selectedKey={field.value?.toString()}
          size="sm"
          onSelectionChange={(val) => field.onChange(Number(val))}
        >
          {(item) => (
            <AutocompleteItem key={item[keyValue]} textValue={item[keyLabel]}>
              {item[keyLabel]}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
