import { useEffect } from "react";
import { useParams } from "react-router-dom";

import CustomerFormPage from "../create";

import Detail404 from "@/pages/admin/hr/employees/components/detail-404";
import DetailSkeleton from "@/pages/admin/hr/employees/components/detail-skeleton";
import { getDetailCustomer } from "@/stores/features/customer/customer-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

export default function EditPage() {
  const { id } = useParams();

  const { detail: data, detailLoading } = useAppSelector(
    (state) => state.customer,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getDetailCustomer(id));
    }
  }, [id]);

  if (detailLoading) return <DetailSkeleton />;
  if (!data) return <Detail404 id={id} />;

  return <CustomerFormPage data={data} />;
}
