import { useEffect } from "react";

import Combobox from "../ui/combobox";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDistrict } from "@/stores/features/region/region-action";

interface Props {
  value: number;
  onChange: (val: number) => void;
}
export default function District({ value, onChange }: Props) {
  const { city_id, district, province_id } = useAppSelector((state) => state.region);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (city_id) {
      dispatch(getDistrict(city_id!));
    }
  }, [city_id, province_id]);

  return (
    <Combobox
      items={district.map((e) => ({ label: e.name, value: e.id }))}
      placeholder="Pilih Kecamatan"
      value={value}
      onChange={onChange}
    />
  );
}
