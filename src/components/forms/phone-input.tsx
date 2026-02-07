import { Input, InputProps } from "@heroui/react";

export default function PhoneInput({ ...props }: InputProps) {
  // Fungsi untuk memformat angka menjadi 0000-0000-0000
  const formatPhoneNumber = (value: string = "") => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 13);
    const match = limited.match(/.{1,4}/g);

    return match ? match.join("-") : limited;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    const cleanValue = formatted.replace(/-/g, "");

    // 1. Jalankan onValueChange milik HeroUI jika ada
    if (props.onValueChange) {
      props.onValueChange(cleanValue);
    }

    // 2. Jalankan onChange manual jika digunakan oleh React Hook Form
    if (props.onChange) {
      // Kita buat tiruan event agar React Hook Form menerima nilai bersih
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

  // Selalu format value yang datang dari props untuk ditampilkan
  const displayValue = formatPhoneNumber(String(props.value || ""));

  return (
    <Input
      labelPlacement="outside"
      placeholder="08xx-xxxx-xxxx"
      variant="bordered"
      {...props} // Pindahkan ke atas agar tidak menimpa value & onChange di bawah
      value={displayValue}
      onChange={handleChange}
    />
  );
}
