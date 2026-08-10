import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export type RevenueTrendPeriod = "7d" | "1m" | "3m" | "1y";

export const getDashboard = createAsyncThunk("get-dashboard", async () => {
  try {
    const { data } = await http.get("/dashboard");

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
});

export const getRevenueTrend = createAsyncThunk(
  "get-revenue-trend",
  async (period: RevenueTrendPeriod = "7d") => {
    const { data } = await http.get("/dashboard/revenue-trend", {
      params: { period },
    });

    return data;
  },
);
