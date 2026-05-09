import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PoInvoiceCreatePage from "./create";

import { fetchPoDetail } from "@/stores/features/po/po-action";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";

export default function PoInvoiceEditPage() {
  const { detail } = useAppSelector((state) => state.po);
  const { id } = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchPoDetail(parseInt(id)));
    }
  }, [id]);

  if (!detail) return null;

  return <PoInvoiceCreatePage po={detail} />;
}
