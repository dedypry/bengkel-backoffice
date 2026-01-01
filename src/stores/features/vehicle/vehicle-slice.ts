import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IVehicle } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getVehicle } from "./vehicle-action";

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    vehicles: null as IPagination<IVehicle> | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getVehicle.fulfilled, (state, action) => {
      state.vehicles = action.payload;
    }),
});

export default vehicleSlice.reducer;
