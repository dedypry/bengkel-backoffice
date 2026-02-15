import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IBooking } from "@/utils/interfaces/IBooking";

import { createSlice } from "@reduxjs/toolkit";

import { getBooking } from "./booking-action";

const bookingSlice = createSlice({
  name: "booking-slice",
  initialState: {
    bookings: null as IPagination<IBooking> | null,
    bookingQuery: {
      page: 1,
      pageSize: 10,
      q: "",
      status: "all",
      date: new Date().toISOString(),
    },
  },
  reducers: {
    setBookingQuery: (state, action) => {
      state.bookingQuery = {
        ...state.bookingQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (build) =>
    build.addCase(getBooking.fulfilled, (state, action) => {
      state.bookings = action.payload;
    }),
});

export const { setBookingQuery } = bookingSlice.actions;
export default bookingSlice.reducer;
