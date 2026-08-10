import type { IDashboard } from "@/utils/interfaces/IDashboard";

import { createSlice } from "@reduxjs/toolkit";

import {
  getDashboard,
  getRevenueTrend,
  type RevenueTrendPeriod,
} from "./dashboard-action";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: null as IDashboard | null,
    isLoadingDashboard: false,
    revenueTrendPeriod: "7d" as RevenueTrendPeriod,
    revenueTrendLoading: false,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getDashboard.pending, (state) => {
        state.isLoadingDashboard = true;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.isLoadingDashboard = false;
        state.revenueTrendPeriod = "7d";
      })
      .addCase(getDashboard.rejected, (state) => {
        state.isLoadingDashboard = false;
      })
      .addCase(getRevenueTrend.pending, (state, action) => {
        state.revenueTrendLoading = true;
        state.revenueTrendPeriod = action.meta.arg;
      })
      .addCase(getRevenueTrend.fulfilled, (state, action) => {
        state.revenueTrendLoading = false;

        if (!action.payload || !state.dashboard) {
          return;
        }

        state.dashboard.trends = action.payload.trends;
        state.dashboard.revenueComparison = action.payload.revenueComparison;
      })
      .addCase(getRevenueTrend.rejected, (state) => {
        state.revenueTrendLoading = false;
      }),
});

export default dashboardSlice.reducer;
