import type { IPagination } from "@/utils/interfaces/IPagination";
import type {
  IAttendance,
  IAttendanceDevice,
  IAttendanceLog,
  IAttendanceSummary,
} from "@/utils/interfaces/IAttendance";

import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import {
  getAttendance,
  getAttendanceDevices,
  getAttendanceLogs,
  getAttendanceSummary,
} from "./attendance-action";

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    attendances: null as IPagination<IAttendance> | null,
    summary: {
      date: "",
      total: 0,
      present: 0,
      late: 0,
      leave: 0,
      absent: 0,
    } as IAttendanceSummary,
    devices: [] as IAttendanceDevice[],
    logs: null as IPagination<IAttendanceLog> | null,
    attendanceQuery: {
      q: "",
      date: dayjs().format("YYYY-MM-DD"),
      status: "",
      page: 1,
      pageSize: 10,
    },
  },
  reducers: {
    setAttendanceQuery: (state, action) => {
      state.attendanceQuery = {
        ...state.attendanceQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.attendances = action.payload;
      })
      .addCase(getAttendanceSummary.fulfilled, (state, action) => {
        if (action.payload) state.summary = action.payload;
      })
      .addCase(getAttendanceDevices.fulfilled, (state, action) => {
        state.devices = action.payload || [];
      })
      .addCase(getAttendanceLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
      }),
});

export const { setAttendanceQuery } = attendanceSlice.actions;
export default attendanceSlice.reducer;
