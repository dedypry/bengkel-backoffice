import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IVehicle } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getVehicle } from "./vehicle-action";

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    vehicles: null as IPagination<IVehicle> | null,
    vehicleQuery: {
      page: 1,
      pageSize: 10,
      q: "",
    },
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
    builder.addCase(getVehicle.fulfilled, (state, action) => {
      state.vehicles = action.payload;
    }),
});

export const { setVehicleQuery } = vehicleSlice.actions;
export default vehicleSlice.reducer;
