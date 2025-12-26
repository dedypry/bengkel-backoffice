import { useEffect } from "react";

import Combobox from "../ui/combobox";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCity } from "@/stores/features/region/region-action";
import { setCityId } from "@/stores/features/region/region-slice";

interface Props {
  value: number;
  onChange: (val: number) => void;
}
export default function City({ value, onChange }: Props) {
  const { province_id, cities } = useAppSelector((state) => state.region);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (province_id) {
      dispatch(getCity(province_id!));
    }
  }, [province_id]);

  return (
    <Combobox
      items={cities.map((e) => ({ label: e.name, value: e.id }))}
      placeholder="Pilih Kota"
      value={value}
      onChange={(val) => {
        onChange(val);
        dispatch(setCityId(val));
      }}
    />
  );
}
