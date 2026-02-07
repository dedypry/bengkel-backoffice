import { useEffect, useState } from "react";
import { Input, type InputProps } from "@heroui/react"; // Import dari HeroUI

import { switchCommasToDots, switchDotsToCommas } from "@/utils/helpers/format";

interface Props {
  onInput?: (val: number) => void;
  maxInput?: number;
  minimumOrderQuantity?: number;
  isAllowDecimal?: boolean;
  maxDecimal?: number;
  // HeroUI Input props yang sering digunakan
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  labelPlacement?: "inside" | "outside" | "outside-left";
}

// Kita gabungkan dengan InputProps HeroUI
export default function InputNumber({
  onInput,
  maxInput,
  minimumOrderQuantity,
  isAllowDecimal = true,
  maxDecimal = 4,
  ...props
}: Props & Omit<InputProps, "onInput">) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (props.value !== undefined && props.value !== null) {
      setValue(
        formatIndonesianNumber(switchDotsToCommas(props.value.toString())),
      );
    }
  }, [props.value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        minimumOrderQuantity !== undefined &&
        (props.value ? Number(props.value) : 0) < minimumOrderQuantity
      ) {
        setValue(switchDotsToCommas(minimumOrderQuantity));
        onInput?.(minimumOrderQuantity);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [props.value, minimumOrderQuantity]);

  function formatIndonesianNumber(input: string): string {
    if (!input) return "";

    const [integerPart, decimalPart] = input.split(",");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    if (isAllowDecimal) {
      if (decimalPart?.length > maxDecimal) {
        return `${formattedInteger},${decimalPart.slice(0, maxDecimal)}`;
      }
    } else {
      return `${formattedInteger}`;
    }

    if (input.endsWith(",")) {
      return `${formattedInteger},`;
    }

    return decimalPart !== undefined
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
  }

  function handleInput(input: string) {
    // Sanitasi: hanya angka dan koma
    const sanitizedInput = input.replace(/[^0-9,]/g, "");
    const commaCount = (sanitizedInput.match(/,/g) || []).length;

    if (commaCount > 1) return;

    const numericValue = switchCommasToDots(sanitizedInput);

    if (maxInput !== undefined && numericValue > maxInput) return;

    setValue(formatIndonesianNumber(sanitizedInput));
    onInput?.(numericValue);
    if (props.onValueChange) {
      props.onValueChange(String(numericValue));
    }
  }

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => handleInput(e.target.value)}
    />
  );
}
