import { Edit } from "lucide-react";
import { useState } from "react";

import Modal from "@/components/modal";
import InputNumber from "@/components/ui/input-number";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProduct } from "@/stores/features/product/product-action";

interface Props {
  id: number;
  name: string;
  currentStock: number;
}
export default function UpdateStock({ id, name, currentStock }: Props) {
  const { productQuery } = useAppSelector((state) => state.product);

  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState<number>(0);

  const dispatch = useAppDispatch();

  function onSubmit() {
    http
      .patch(`/products/update-stock/${id}`, { stock })
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        setStock(0);
        dispatch(getProduct(productQuery));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Modal
        open={open}
        title={`Update Stock ${name}`}
        onOpenChange={setOpen}
        onSave={onSubmit}
      >
        <p>Stok sebelumnya {currentStock}</p>
        <InputNumber value={stock} onInput={(val) => setStock(val as any)} />
      </Modal>
      <Edit
        className="text-amber-600 cursor-pointer"
        size={15}
        onClick={() => setOpen(true)}
      />
    </>
  );
}
