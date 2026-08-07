import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Controller } from "react-hook-form";

import { asArray } from "@/utils/helpers/as-array";

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
  items: any;
  name: string;
  label: string;
  placeholder?: string;
  keyValue?: string;
  keyLabel?: string;
}) {
  const safeItems = asArray(items);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          aria-label={label}
          defaultItems={safeItems}
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
          selectedKey={
            field.value != null && field.value !== ""
              ? String(field.value)
              : null
          }
          size="sm"
          onSelectionChange={(val) =>
            field.onChange(val == null ? undefined : Number(val))
          }
        >
          {(item) => (
            <AutocompleteItem
              key={item[keyValue]}
              textValue={String(item[keyLabel] ?? "")}
            >
              {item[keyLabel]}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
