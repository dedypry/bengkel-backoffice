import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IService, IServiceCategory } from "@/utils/interfaces/IService";
import type { IQuery } from "@/utils/interfaces/global";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getCategories, getService } from "./service-action";

interface ServiceState {
  services: IPagination<IService> | null;
  query: IQuery;
  categories: IServiceCategory[];
}

const initialState: ServiceState = {
  services: null,
  query: {
    page: 1,
    pageSize: 8,
  },
  categories: [],
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setServiceQuery: (state, action: PayloadAction<Partial<IQuery>>) => {
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
        state.categories = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      }),
});

export const { setServiceQuery } = serviceSlice.actions;
export default serviceSlice.reducer;
