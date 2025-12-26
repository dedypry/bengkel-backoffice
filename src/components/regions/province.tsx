import { useEffect } from "react";

import Combobox from "../ui/combobox";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProvince } from "@/stores/features/region/region-action";
import { setProvinceId } from "@/stores/features/region/region-slice";

interface Props {
  value: number;
  onChange: (val: number) => void;
}
export default function Province({ value, onChange }: Props) {
  const { provinces } = useAppSelector((state) => state.region);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProvince());
  }, []);

  return (
    <Combobox
      items={provinces.map((e) => ({ label: e.name, value: e.id }))}
      placeholder="Pilih Provinsi"
      value={value}
      onChange={(val) => {
        onChange(val);
        dispatch(setProvinceId(val));
      }}
    />
  );
}
