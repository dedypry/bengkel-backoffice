import type { IDashboard } from "@/utils/interfaces/IDashboard";

import { createSlice } from "@reduxjs/toolkit";

import { getDashboard } from "./dashboard-action";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: null as IDashboard | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getDashboard.fulfilled, (state, action) => {
      state.dashboard = action.payload;
    }),
});

export default dashboardSlice.reducer;
