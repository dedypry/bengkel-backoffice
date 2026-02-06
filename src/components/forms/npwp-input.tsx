import { Input, InputProps } from "@heroui/react";

export default function NpwpInput({ ...props }: InputProps) {
  // Fungsi format NPWP: 00.000.000.0-000.000
  const formatNPWP = (value: string = "") => {
    // 1. Ambil hanya angka, maksimal 15 digit
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
    const cleanValue = formatted.replace(/\D/g, ""); // Simpan hanya angka ke state form

    // Support HeroUI onValueChange
    if (props.onValueChange) {
      props.onValueChange(cleanValue);
    }

    // Support React Hook Form onChange
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
      placeholder="00.000.000.0-000.000"
      {...props}
      value={displayValue}
      onChange={handleChange}
    />
  );
}
