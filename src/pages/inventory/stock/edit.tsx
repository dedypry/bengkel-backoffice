import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import FormAddStock from "./add";

import { getProductDetail } from "@/stores/features/product/product-action";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";

export default function EditProduct() {
  const { product } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getProductDetail(id));
      const timer = setTimeout(() => {
        hasFetched.current = false;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [id]);

  return <FormAddStock initialData={product} />;
}
