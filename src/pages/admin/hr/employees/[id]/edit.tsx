import { useParams } from "react-router-dom";
import { useEffect } from "react";

import CreateEmployeePage from "../create";
import Detail404 from "../components/detail-404";
import DetailSkeleton from "../components/detail-skeleton";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getEmployeDetail } from "@/stores/features/employe/employe-action";
import {
  setCityId,
  setDistrictId,
  setProvinceId,
} from "@/stores/features/region/region-slice";

export default function Edit() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { detail, detailLoading: loading } = useAppSelector(
    (state) => state.employe,
  );

  useEffect(() => {
    if (id) {
      dispatch(getEmployeDetail(id));
    }
  }, [id]);

  useEffect(() => {
    if (detail) {
      dispatch(setProvinceId(detail.profile?.province_id));
      dispatch(setCityId(detail.profile?.city_id));
      dispatch(setDistrictId(detail.profile?.district_id));
    }
  }, [detail]);

  if (loading) return <DetailSkeleton />;
  if (!detail) return <Detail404 />;

  return (
    <CreateEmployeePage
      id={id}
      userForm={{
        photo: detail.profile?.photo_url,
        name: detail.name,
        email: detail.email,
        phone: detail.profile?.phone_number!,
        role_ids: detail.roles.map((e) => e.id),
        department: detail.department,
        join_date: detail.profile?.join_date!,
        status: detail.status,
        province_id: detail.profile?.province_id!,
        city_id: detail.profile?.city_id!,
        district_id: detail.profile?.district_id!,
        address: detail.profile?.address!,
        gender: detail.profile?.gender! as any,
        place_birth: detail.profile?.place_birth!,
        birth_date: detail.profile?.birth_date!,
        emergency_name: detail.profile?.emergency_name!,
        emergency_contact: detail.profile?.emergency_contact!,
      }}
    />
  );
}
