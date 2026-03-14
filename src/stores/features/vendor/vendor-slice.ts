import { createSlice } from "@reduxjs/toolkit";

import {
  getVendorPayment,
  getVendorPaymentDetail,
  getVendorTransaction,
  getVendorTrxDetail,
} from "./vendor-action";

import { IPagination } from "@/utils/interfaces/IPagination";
import {
  IVendorPayment,
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
    paymentQuery: {
      page: 1,
      pageSize: 10,
      q: "",
    },
    payments: null as IPagination<IVendorPayment> | null,
    trxDetail: null as IVendorTrxDetail | null,
  },
  reducers: {
    setVendorQuery: (state, action) => {
      state.vendorQuery = {
        ...state.vendorQuery,
        ...action.payload,
      };
    },
    setPaymentQuery: (state, action) => {
      state.paymentQuery = {
        ...state.paymentQuery,
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
      })
      .addCase(getVendorPayment.fulfilled, (state, action) => {
        state.payments = action.payload;
      })
      .addCase(getVendorPaymentDetail.fulfilled, (state, action) => {
        state.trxDetail = action.payload;
      }),
});

export const { setVendorQuery, setPaymentQuery } = vendorSlice.actions;
export default vendorSlice.reducer;
