import { useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Layers } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setProductQuery } from "@/stores/features/product/product-slice";

export default function SelectCategories() {
  const { products } = useAppSelector((state) => state.product);

  const [selectedKey, setSelectedKey] = useState<string>("all");
  const dispatch = useAppDispatch();

  const categories = products?.stats?.categories || [];

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;

    setSelectedKey(val);

    dispatch(
      setProductQuery({
        categoryId: val !== "all" ? Number(val) : undefined,
      }),
    );
  };

  return (
    <Select
      disallowEmptySelection
      aria-label="Pilih Kategori"
      className="max-w-xs"
      classNames={{
        trigger:
          "border-gray-200 shadow-none hover:border-gray-400 focus-within:border-gray-800",
        value: "text-small font-medium text-gray-700",
        popoverContent: "border border-gray-100 shadow-xl",
      }}
      placeholder="Kategori"
      selectedKeys={[selectedKey]}
      size="md"
      startContent={<Layers className="text-gray-400" size={16} />}
      variant="bordered"
      onChange={handleSelectionChange}
    >
      {[{ id: "all", name: "Semua Kategori" }, ...categories].map((cat) => (
        <SelectItem key={cat.id.toString()} textValue={cat.name}>
          <span className="text-small font-semibold text-gray-800 uppercase tracking-tight">
            {cat.name}
          </span>
        </SelectItem>
      ))}
    </Select>
  );
}
