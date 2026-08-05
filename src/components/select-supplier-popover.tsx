import {
  Autocomplete,
  AutocompleteItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { ReactNode, useState } from "react";

import { asArray } from "@/utils/helpers/as-array";
import { ISupplier } from "@/utils/interfaces/ISupplier";

interface Props {
  value: number;
  suppliers: ISupplier[] | any;
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
  const safeSuppliers = asArray<ISupplier>(suppliers);

  return (
    <Popover
      isOpen={isOpen}
      placement="right"
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="p-0">
        <Autocomplete
          defaultItems={safeSuppliers}
          placeholder="Pilih Supplier"
          selectedKey={value?.toString()}
          onSelectionChange={(val) => {
            const find = safeSuppliers.find((e) => e.id == val);

            if (find) onSelectionChange(find);
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
