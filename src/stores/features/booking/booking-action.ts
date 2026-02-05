import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getBooking = createAsyncThunk(
  "get-booking",
  async (params: IQuery) => {
    try {
      const { data } = await http.get("/bookings", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
