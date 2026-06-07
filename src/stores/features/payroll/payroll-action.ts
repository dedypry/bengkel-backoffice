import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getPayrolls = createAsyncThunk(
  "payroll-list",
  async (params: any) => {
    try {
      const { data } = await http.get("/payrolls", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getPayrollSummary = createAsyncThunk(
  "payroll-summary",
  async () => {
    try {
      const { data } = await http.get("/payrolls/summary");

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getPayrollDetail = createAsyncThunk(
  "payroll-detail",
  async (id: string) => {
    try {
      const { data } = await http.get(`/payrolls/${id}`);

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getSalaries = createAsyncThunk(
  "payroll-salaries",
  async (params: any) => {
    try {
      const { data } = await http.get("/payrolls/salaries", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
