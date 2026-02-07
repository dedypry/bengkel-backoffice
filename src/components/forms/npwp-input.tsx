import { Input, InputProps } from "@heroui/react";
import { forwardRef } from "react"; // 1. Import forwardRef

const NpwpInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // Fungsi format NPWP: 00.000.000.0-000.000
  const formatNPWP = (value: string = "") => {
    const digits = value.replace(/\D/g, "").slice(0, 15);
    let res = "";

    if (digits.length > 0) res += digits.substring(0, 2);
    if (digits.length > 2) res += "." + digits.substring(2, 5);
    if (digits.length > 5) res += "." + digits.substring(5, 8);
    if (digits.length > 8) res += "." + digits.substring(8, 9);
    if (digits.length > 9) res += "-" + digits.substring(9, 12);
    if (digits.length > 12) res += "." + digits.substring(12, 15);

    return res;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatNPWP(rawValue);
    const cleanValue = formatted.replace(/\D/g, "");

    if (props.onValueChange) {
      props.onValueChange(cleanValue);
    }

    if (props.onChange) {
      const event = {
        ...e,
        target: {
          ...e.target,
          value: cleanValue,
        },
      };

      props.onChange(event as any);
    }
  };

  const displayValue = formatNPWP(String(props.value || ""));

  return (
    <Input
      ref={ref} // 2. Teruskan ref ke komponen Input internal
      classNames={{
        inputWrapper:
          "border-gray-200 group-data-[focus=true]:border-gray-900 shadow-none bg-white",
        label: "text-[10px] font-black uppercase tracking-widest text-gray-500",
      }}
      labelPlacement="outside"
      placeholder="00.000.000.0-000.000"
      radius="sm"
      variant="bordered"
      {...props}
      value={displayValue}
      onChange={handleChange}
    />
  );
});

// 3. Set display name untuk debugging
NpwpInput.displayName = "NpwpInput";

export default NpwpInput;
