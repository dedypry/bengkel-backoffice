import { Button } from "@heroui/react";

import InputNumber from "./input-number";

interface Props {
  value: number;
  isDisabled?: boolean;
  handleQty: (qty: number) => void;
}
export default function InputQty({ value, handleQty, isDisabled }: Props) {
  return (
    <InputNumber
      classNames={{
        input: "text-center font-bold text-xs",
        inputWrapper: "px-0",
      }}
      endContent={
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => handleQty(value + 1)}
        >
          +
        </Button>
      }
      isDisabled={isDisabled}
      size="sm"
      startContent={
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => {
            if (value >= 0) {
              handleQty(value - 1);
            }
          }}
        >
          -
        </Button>
      }
      value={value as any}
      onInput={(val) => handleQty(Number(val))}
    />
  );
}
