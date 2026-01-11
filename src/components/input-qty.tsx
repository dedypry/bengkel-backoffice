import { IconButton } from "@mui/joy";

import InputNumber from "./ui/input-number";

interface Props {
  value: number;
  handleQty: (qty: number) => void;
}
export default function InputQty({ value, handleQty }: Props) {
  return (
    <InputNumber
      endDecorator={
        <IconButton onClick={() => handleQty(value + 1)}>+</IconButton>
      }
      slotProps={{
        input: {
          style: {
            textAlign: "center", // Membuat teks value di tengah
          },
        },
      }}
      startDecorator={
        <IconButton
          onClick={() => {
            if (value >= 0) {
              handleQty(value - 1);
            }
          }}
        >
          -
        </IconButton>
      }
      value={value}
      onInput={(val: any) => handleQty(val)}
    />
  );
}
