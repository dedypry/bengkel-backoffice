import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Layers } from "lucide-react";

import { getCategories } from "@/stores/features/product/product-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setProductQuery } from "@/stores/features/product/product-slice";

export default function SelectCategories() {
  const { company } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.product);

  // Menggunakan string "all" untuk initial state agar sesuai dengan key Select HeroUI
  const [selectedKey, setSelectedKey] = useState<string>("all");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getCategories({}));
    }
  }, [company, dispatch]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;

    setSelectedKey(val);

    // Dispatch query: jika "all", kirim undefined untuk menghapus filter kategori
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
      {[...categories, { id: "all", name: "Semua Kategori" }].map((cat) => (
        <SelectItem key={cat.id.toString()} textValue={cat.name}>
          <span className="text-small font-semibold text-gray-800 uppercase tracking-tight">
            {cat.name}
          </span>
        </SelectItem>
      ))}
    </Select>
  );
}
