import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PoCreatePage from "./create";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchPoDetail } from "@/stores/features/po/po-action";

export default function PoEditPage() {
  const { detail } = useAppSelector((state) => state.po);
  const { id } = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchPoDetail(parseInt(id)));
    }
  }, [id]);

  if (!detail) return null;

  return <PoCreatePage po={detail} />;
}
