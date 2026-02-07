import { Input, InputProps } from "@heroui/react";
import { forwardRef } from "react";

const PhoneInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
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

  const displayValue = formatPhoneNumber(String(props.value || ""));

  return (
    <Input
      ref={ref}
      placeholder="08xx-xxxx-xxxx"
      radius="sm"
      {...props}
      value={displayValue}
      onChange={handleChange}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
