import type { IProvince } from "@/utils/interfaces/IRegion";

import { createSlice } from "@reduxjs/toolkit";

import { getCity, getDistrict, getProvince } from "./region-action";

const regionSlice = createSlice({
  name: "region",
  initialState: {
    provinces: [] as IProvince[],
    cities: [] as IProvince[],
    district: [] as IProvince[],
    province_id: null as number | null,
    city_id: null as number | null,
    district_id: null as number | null,
  },
  reducers: {
    setProvinceId: (state, action) => {
      state.province_id = action.payload;
      state.city_id = null;
      state.district_id = null;
      state.district = [];
    },
    setCityId: (state, action) => {
      state.city_id = action.payload;
    },
    setDistrictId: (state, action) => {
      state.district_id = action.payload;
    },
  },
  extraReducers: (build) =>
    build
      .addCase(getProvince.fulfilled, (state, action) => {
        state.provinces = action.payload;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(getDistrict.fulfilled, (state, action) => {
        state.district = action.payload;
      }),
});

export const { setCityId, setDistrictId, setProvinceId } = regionSlice.actions;
export default regionSlice.reducer;
