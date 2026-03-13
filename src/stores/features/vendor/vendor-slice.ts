import { createSlice } from "@reduxjs/toolkit";

import { getVendorTransaction, getVendorTrxDetail } from "./vendor-action";

import { IPagination } from "@/utils/interfaces/IPagination";
import {
  IVendorTransaction,
  IVendorTrxDetail,
} from "@/utils/interfaces/IVendor";

const vendorSlice = createSlice({
  name: "vendor-slice",
  initialState: {
    transactions: null as IPagination<IVendorTransaction> | null,
    vendorQuery: {
      page: 1,
      pageSize: 10,
      q: "",
    },
    trxDetail: null as IVendorTrxDetail | null,
  },
  reducers: {
    setVendorQuery: (state, action) => {
      state.vendorQuery = {
        ...state.vendorQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getVendorTransaction.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(getVendorTrxDetail.fulfilled, (state, action) => {
        state.trxDetail = action.payload;
      }),
});

export const { setVendorQuery } = vendorSlice.actions;
export default vendorSlice.reducer;
