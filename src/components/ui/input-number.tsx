import { useEffect, useState } from "react";
import { Input, type InputProps } from "@mui/joy";

import { switchCommasToDots, switchDotsToCommas } from "@/utils/helpers/format";

interface Props {
  onInput?: (val: number) => void;
  maxInput?: number;
  minimumOrderQuantity?: number;
  isAllowDecimal?: boolean;
  maxDecimal?: number;
}
export default function InputNumber({
  onInput,
  maxInput,
  minimumOrderQuantity,
  isAllowDecimal = true,
  maxDecimal = 4,
  ...props
}: Props & InputProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (props.value !== undefined && props.value !== null) {
      setValue(
        formatIndonesianNumber(switchDotsToCommas(props.value.toString())),
      );
    }
  }, [props.value]);

  useEffect(() => {
    setTimeout(() => {
      if (
        minimumOrderQuantity !== undefined &&
        (props.value ? Number(props.value) : 0) < minimumOrderQuantity
      ) {
        setValue(switchDotsToCommas(minimumOrderQuantity));
        onInput?.(minimumOrderQuantity);
      }
    }, 500);
  }, [props.value]);

  // Function to format numbers in Indonesian format (e.g., "1.234,56")
  function formatIndonesianNumber(input: string): string {
    if (!input) return "";

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = input.split(",");

    // Add thousand separators to the integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    if (isAllowDecimal) {
      if (decimalPart?.length > maxDecimal) {
        return `${formattedInteger},${decimalPart.slice(0, maxDecimal)}`;
      }
    } else {
      return `${formattedInteger}`;
    }

    // If there's no decimal part but a trailing comma exists, preserve it
    if (input.endsWith(",")) {
      return `${formattedInteger},`;
    }

    // Combine formatted integer with the decimal part (if present)
    return decimalPart !== undefined
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
  }

  function handleInput(input: string) {
    // Allow only numbers, commas, and dots
    const sanitizedInput = input.replace(/[^0-9,]/g, "");
    const commaCount = (sanitizedInput.match(/,/g) || []).length;

    // Prevent more than one comma
    if (commaCount > 1) return;

    // Update the value with the formatted Indonesian number
    setValue(formatIndonesianNumber(sanitizedInput));

    // Convert sanitized input to a number
    const numericValue = switchCommasToDots(sanitizedInput);

    // Validate maximum input value
    if (maxInput && numericValue > maxInput) return;

    // Call the onInput callback with the numeric value
    onInput?.(numericValue);
  }

  return (
    <Input
      {...(props as any)}
      value={value}
      onChange={(e) => handleInput(e.target.value)}
    />
    // <InputGroup>
    //   <InputGroupInput
    //     {...props}
    //     value={value}
    //     onChange={(e) => handleInput(e.target.value)}
    //   />
    //   {props.prefix && <InputGroupAddon>{props.prefix}</InputGroupAddon>}
    //   {prefixIcon && <InputGroupAddon>{prefixIcon}</InputGroupAddon>}

    //   {suffixIcon && (
    //     <InputGroupAddon align="inline-end">{suffixIcon}</InputGroupAddon>
    //   )}
    // </InputGroup>
    // <Input
    //   {...props}
    //   value={value}
    //   onChange={(e) => handleInput(e.target.value)}
    // />
  );
}
