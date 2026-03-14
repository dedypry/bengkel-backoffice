import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useRef, useEffect } from "react";

import { getSupplierList } from "@/stores/features/supplier/supplier-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

interface Props {
  value: number;
  onChange: (val: number) => void;
  size?: "sm" | "md" | "lg" | undefined;
  isInvalid?: boolean;
  errorMessage?: string;
}
export default function SupplierList({
  value,
  onChange,
  size = "sm",
  isInvalid,
  errorMessage,
}: Props) {
  const { data: suppliers } = useAppSelector((state) => state.supplier);

  const dispatch = useAppDispatch();
  const hasFetch = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;

      dispatch(getSupplierList());

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, []);

  return (
    <Autocomplete
      classNames={{
        clearButton: "text-gray-700",
      }}
      defaultItems={suppliers}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      selectedKey={String(value)}
      size={size}
      onSelectionChange={(val) => onChange(Number(val))}
    >
      {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
    </Autocomplete>
  );
}
