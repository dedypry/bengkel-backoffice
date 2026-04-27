import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IVehicle, IWorkOrder } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import {
  getMasterVehicle,
  getVehicle,
  getVehicleHistory,
  getVehicleListMaster,
} from "./vehicle-action";

import { IMasterVehicle, IVehicleItem } from "@/utils/interfaces/IMaster";

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    vehicles: null as IPagination<IVehicle> | null,
    histories: [] as IWorkOrder[],
    vehicleMaster: null as IPagination<IVehicleItem> | null,
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
    resetHistory: (state) => {
      state.histories = [];
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getVehicleListMaster.fulfilled, (state, action) => {
        state.vehicleMaster = action.payload;
      })
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.vehicles = action.payload;
      })
      .addCase(getVehicleHistory.fulfilled, (state, action) => {
        state.histories = action.payload;
      })
      .addCase(getMasterVehicle.fulfilled, (state, action) => {
        state.master = action.payload;
      }),
});

export const { setVehicleQuery, resetHistory } = vehicleSlice.actions;
export default vehicleSlice.reducer;
