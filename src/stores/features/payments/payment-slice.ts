import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IPayment } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getPayment } from "./payment-action";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: null as IPagination<IPayment> | null,
    paymentQuery: {
      page: 1,
      pageSize: 10,
      q: "",
    },
  },
  reducers: {
    setPaymentQuery: (state, action) => {
      state.paymentQuery = {
        ...state.paymentQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder.addCase(getPayment.fulfilled, (state, action) => {
      state.payments = action.payload;
    }),
});

export const { setPaymentQuery } = paymentSlice.actions;
export default paymentSlice.reducer;
