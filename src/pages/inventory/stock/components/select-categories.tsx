import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { ArrowRight, ChevronRight, Layers } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setProductQuery } from "@/stores/features/product/product-slice";
import { IProductCategory } from "@/utils/interfaces/IProduct";

const ALL_CATEGORY_KEY = "all";

function getCategoryLabel(
  categories: IProductCategory[],
  selectedKey: string,
  allLabel: string,
): string {
  if (selectedKey === ALL_CATEGORY_KEY) return allLabel;

  for (const category of categories) {
    if (String(category.id) === selectedKey) return category.name;

    const child = (category.children || []).find(
      (item) => String(item.id) === selectedKey,
    );

    if (child) return child.name;
  }

  return allLabel;
}

export default function SelectCategories() {
  const { t } = useTranslation();
  const { products } = useAppSelector((state) => state.product);
  const [selectedKey, setSelectedKey] = useState<string>(ALL_CATEGORY_KEY);
  const [parentName, setParentName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const categories: IProductCategory[] = products?.stats?.categories || [];
  const allCategoryLabel = t("inventory.stock.select_categories.all");
  const selectedLabel = useMemo(
    () => getCategoryLabel(categories, selectedKey, allCategoryLabel),
    [categories, selectedKey, allCategoryLabel],
  );

  const handleSelectionChange = (val: string) => {
    setSelectedKey(val);
    setIsOpen(false);
    dispatch(
      setProductQuery({
        categoryId: val !== ALL_CATEGORY_KEY ? Number(val) : undefined,
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
            onClick={() => handleSelectionChange(ALL_CATEGORY_KEY)}
          >
            {allCategoryLabel}
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
                          {child.name || t("inventory.stock.select_categories.no_name")}
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
