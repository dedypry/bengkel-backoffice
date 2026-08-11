import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  type KeyboardEvent,
} from "react";
import { Input, type InputProps } from "@heroui/react";

import { switchCommasToDots, switchDotsToCommas } from "@/utils/helpers/format";

interface Props {
  onInput?: (val: number) => void;
  maxInput?: number;
  minimumOrderQuantity?: number;
  isAllowDecimal?: boolean;
  maxDecimal?: number;
}

// 2. Bungkus dengan forwardRef
const InputNumber = forwardRef<
  HTMLInputElement,
  Props & Omit<InputProps, "onInput">
>(
  (
    {
      onInput,
      maxInput,
      minimumOrderQuantity,
      isAllowDecimal = true,
      maxDecimal = 4,
      ...props
    },
    ref, // 3. Terima parameter ref di sini
  ) => {
    const [value, setValue] = useState("");
    const isFocusedRef = useRef(false);

    function syncFromPropValue(nextValue: string | number | undefined | null) {
      if (nextValue === undefined || nextValue === null) return;

      setValue(
        formatIndonesianNumber(switchDotsToCommas(nextValue.toString())),
      );

      if (maxInput && Number(nextValue) > maxInput) {
        setValue(
          formatIndonesianNumber(switchDotsToCommas(maxInput.toString())),
        );
        onInput?.(maxInput);

        if (props.onValueChange) {
          props.onValueChange(String(maxInput));
        }
      }
    }

    useEffect(() => {
      if (isFocusedRef.current) return;

      syncFromPropValue(props.value);
    }, [props.value]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (
          minimumOrderQuantity !== undefined &&
          (props.value ? Number(props.value) : 0) < minimumOrderQuantity
        ) {
          const formattedMin = switchDotsToCommas(minimumOrderQuantity);

          setValue(formatIndonesianNumber(formattedMin));
          onInput?.(minimumOrderQuantity);
        }
      }, 500);

      return () => clearTimeout(timer);
    }, [props.value, minimumOrderQuantity]);

    function formatIndonesianNumber(input: string): string {
      if (!input) return "";

      const [integerPart, decimalPart] = input.split(",");
      const formattedInteger = integerPart
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      e.stopPropagation();
      props.onKeyDown?.(e);
    }

    return (
      <Input
        ref={ref} // 4. Teruskan ref ke HeroUI Input
        {...props}
        value={value}
        onBlur={(e) => {
          isFocusedRef.current = false;
          syncFromPropValue(props.value);
          props.onBlur?.(e);
        }}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={(e) => {
          isFocusedRef.current = true;
          props.onFocus?.(e);
        }}
        onKeyDown={handleKeyDown}
        onKeyDownCapture={(e) => {
          e.stopPropagation();
          props.onKeyDownCapture?.(e);
        }}
      />
    );
  },
);

// 5. Atur displayName untuk kemudahan debugging
InputNumber.displayName = "InputNumber";

export default InputNumber;
