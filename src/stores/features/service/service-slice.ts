import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IService, IServiceCategory } from "@/utils/interfaces/IService";

import { createSlice } from "@reduxjs/toolkit";

import { getCategories, getService } from "./service-action";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: null as IPagination<IService> | null,
    query: {
      page: 1,
      pageSize: 8,
    },
    categories: [] as IServiceCategory[],
  },
  reducers: {
    setServiceQuery: (state, action) => {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
  },
  extraReducers: (build) =>
    build
      .addCase(getService.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      }),
});

export const { setServiceQuery } = serviceSlice.actions;
export default serviceSlice.reducer;
