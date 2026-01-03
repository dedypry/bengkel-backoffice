import { useEffect, useState } from "react";

import { getCategories } from "@/stores/features/product/product-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import Combobox from "@/components/ui/combobox";
import { setProductQuery } from "@/stores/features/product/product-slice";

export default function SelectCategories() {
  const { company } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.product);
  const [value, setValue] = useState(999);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getCategories({}));
    }
  }, [company]);

  console.log(categories);

  return (
    <Combobox
      className="w-fit"
      items={[
        { value: 999, label: "All" },
        ...categories.map((e) => ({ value: e.id, label: e.name })),
      ]}
      placeholder="Pilih Kategory"
      value={value}
      onChange={(val) => {
        setValue(val);
        dispatch(
          setProductQuery({ categoryId: val !== 999 ? val : undefined }),
        );
      }}
    />
  );
}
