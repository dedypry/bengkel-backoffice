import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getAttendance = createAsyncThunk(
  "attendance-list",
  async (params: any) => {
    try {
      const { data } = await http.get("/attendances", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getAttendanceSummary = createAsyncThunk(
  "attendance-summary",
  async (params: any) => {
    try {
      const { data } = await http.get("/attendances/summary", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getAttendanceDevices = createAsyncThunk(
  "attendance-devices",
  async () => {
    try {
      const { data } = await http.get("/attendances/devices");

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);

export const getAttendanceLogs = createAsyncThunk(
  "attendance-logs",
  async (params: any) => {
    try {
      const { data } = await http.get("/attendances/logs", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
