import {
  Autocomplete,
  AutocompleteItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { ReactNode, useState } from "react";

import { ISupplier } from "@/utils/interfaces/ISupplier";

interface Props {
  value: number;
  suppliers: ISupplier[];
  children: ReactNode;
  onSelectionChange: (val: ISupplier) => void;
}
export default function SelectSupplierPopover({
  value,
  suppliers = [],
  children,
  onSelectionChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      placement="right"
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="p-0">
        <Autocomplete
          defaultItems={suppliers}
          selectedKey={value?.toString()}
          onSelectionChange={(val) => {
            const find = suppliers.find((e) => e.id == val);

            onSelectionChange(find!);
            setIsOpen(false);
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.id} textValue={item.name}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </PopoverContent>
    </Popover>
  );
}
