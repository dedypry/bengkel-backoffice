import { useEffect } from "react";
import { useParams } from "react-router-dom";

import FormStock from "../add";

import { getProductDetail } from "@/stores/features/product/product-action";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";

export default function EditProduct() {
  const { product } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }
  }, [id]);

  return <FormStock initialData={product} />;
}
