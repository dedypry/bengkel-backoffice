import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IVehicle } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getMasterVehicle, getVehicle } from "./vehicle-action";

import { IMasterVehicle } from "@/utils/interfaces/IMaster";

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    vehicles: null as IPagination<IVehicle> | null,
    vehicleQuery: {
      page: 1,
      pageSize: 10,
      q: "",
    },
    master: [] as IMasterVehicle[],
  },
  reducers: {
    setVehicleQuery: (state, action) => {
      state.vehicleQuery = {
        ...state.vehicleQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.vehicles = action.payload;
      })
      .addCase(getMasterVehicle.fulfilled, (state, action) => {
        state.master = action.payload;
      }),
});

export const { setVehicleQuery } = vehicleSlice.actions;
export default vehicleSlice.reducer;
