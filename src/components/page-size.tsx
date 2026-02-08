import { Select, SelectItem, SelectProps } from "@heroui/react";

export default function PageSize({ ...props }: Omit<SelectProps, "children">) {
  const items = [5, 10, 25, 50, 100];

  return (
    <Select className="w-28" {...props}>
      {items.map((e) => (
        <SelectItem key={e} textValue={e.toString()}>
          {e}
        </SelectItem>
      ))}
    </Select>
  );
}
