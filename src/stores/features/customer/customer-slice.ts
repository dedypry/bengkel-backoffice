import type { IPagination } from "@/utils/interfaces/IPagination";
import type { ICustomer } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getCustomer, getDetailCustomer } from "./customer-action";

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: null as IPagination<ICustomer> | null,
    detail: null as ICustomer | null,
    detailLoading: false,
    query: {
      page: 1,
      pageSize: 10,
      q: "",
    },
  },
  reducers: {
    setCustomerQuery: (state, action) => {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.customers = action.payload;
      })
      .addCase(getDetailCustomer.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.detailLoading = false;
      })
      .addCase(getDetailCustomer.pending, (state) => {
        state.detailLoading = true;
      }),
});
export const { setCustomerQuery } = customerSlice.actions;

export default customerSlice.reducer;
