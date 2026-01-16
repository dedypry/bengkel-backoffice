import type { IProduct } from "@/utils/interfaces/IProduct";

import { Autocomplete } from "@mui/joy";
import { useEffect, useState } from "react";

import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import debounce from "@/utils/helpers/debounce";

interface Props {
  value: number;
  onChange: (val: number) => void;
}
export default function SearchProduct({ onChange, value }: Props) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (value && value > 0 && !product) {
      http.get(`/products/${value}`).then(({ data }) => {
        setProduct(data);
      });
    }
  }, [value]);

  function getProduct(q: string = "") {
    setLoading(true);
    http
      .get("/products", {
        params: {
          q,
        },
      })
      .then(({ data }) => {
        setProducts(data.data);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  const searchDebounce = debounce((q) => getProduct(q), 500);

  return (
    <Autocomplete
      getOptionKey={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      loading={loading}
      options={products}
      placeholder="Cari nama product..."
      value={product}
      onChange={(_, val) => {
        if (val) {
          setProduct(val!);
          onChange(val.id);
        }
      }}
      onInputChange={(_, val) => searchDebounce(val)}
    />
  );
}
