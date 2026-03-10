import { Input, InputProps } from "@heroui/react";
import { Control, Controller, FieldValues } from "react-hook-form";

interface Props {
  name: any;
  control: Control<FieldValues, any, FieldValues> | undefined;
}
export default function InputControl({
  name,
  control,
  ...props
}: Props & InputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          className="items-center"
          classNames={{ label: "w-40 text-xs shrink-0", inputWrapper: "h-8" }}
          errorMessage={fieldState.error?.message}
          isInvalid={!!fieldState.error}
          size="sm"
          {...props}
        />
      )}
    />
  );
}
