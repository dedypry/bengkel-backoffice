import { useMemo, useState } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { ArrowRight, ChevronRight, Layers } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setProductQuery } from "@/stores/features/product/product-slice";
import { IProductCategory } from "@/utils/interfaces/IProduct";

const ALL_CATEGORY = { id: "all", name: "Semua Kategori" };

function getCategoryLabel(
  categories: IProductCategory[],
  selectedKey: string,
): string {
  if (selectedKey === "all") return ALL_CATEGORY.name;

  for (const category of categories) {
    if (String(category.id) === selectedKey) return category.name;

    const child = (category.children || []).find(
      (item) => String(item.id) === selectedKey,
    );

    if (child) return child.name;
  }

  return ALL_CATEGORY.name;
}

export default function SelectCategories() {
  const { products } = useAppSelector((state) => state.product);
  const [selectedKey, setSelectedKey] = useState<string>("all");
  const [parentName, setParentName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const categories: IProductCategory[] = products?.stats?.categories || [];
  const selectedLabel = useMemo(
    () => getCategoryLabel(categories, selectedKey),
    [categories, selectedKey],
  );

  const handleSelectionChange = (val: string) => {
    setSelectedKey(val);
    setIsOpen(false);
    dispatch(
      setProductQuery({
        categoryId: val !== "all" ? Number(val) : undefined,
      }),
    );
  };

  return (
    <Popover isOpen={isOpen} placement="bottom-start" onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          className="flex items-center gap-2"
          size="md"
          startContent={<Layers className="text-gray-400" size={16} />}
          variant="bordered"
        >
          {parentName} <ArrowRight className="text-gray-400" size={16} />{" "}
          {selectedLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="flex min-w-[220px] flex-col gap-1">
          <button
            className="rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100"
            type="button"
            onClick={() => handleSelectionChange("all")}
          >
            {ALL_CATEGORY.name}
          </button>
          {categories.map((cat: IProductCategory) => (
            <div key={cat.id}>
              {(cat.children || []).length ? (
                <Popover
                  className="ml-2"
                  placement="right-start"
                  triggerType="tree"
                >
                  <PopoverTrigger>
                    <button
                      className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-left text-sm hover:bg-gray-100"
                      type="button"
                      onClick={() => {
                        setParentName(cat.name);
                      }}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="text-gray-400" size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-1">
                    <div className="flex max-h-[300px] min-w-[200px] flex-col gap-1 overflow-y-auto">
                      {(cat.children || []).map((child: IProductCategory) => (
                        <button
                          key={child.id}
                          className="rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100"
                          type="button"
                          onClick={() =>
                            handleSelectionChange(String(child.id))
                          }
                        >
                          {child.name || "Tidak ada nama"}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <button
                  className="rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100"
                  type="button"
                  onClick={() => {
                    handleSelectionChange(String(cat.id));
                    console.log("CAT", cat);
                    setParentName(cat.name);
                  }}
                  onMouseEnter={() => {
                    handleSelectionChange(String(cat.id));
                    console.log("CAT", cat);
                    setParentName(cat.name);
                  }}
                >
                  {cat.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
