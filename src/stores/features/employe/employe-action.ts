import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getEmployeSummary = createAsyncThunk(
  "employe-summary",
  async () => {
    try {
      const { data } = await http.get("/employees/summary");

      return data;
    } catch (error) {
      console.error(error);
    }
  },
);

interface Query {
  pageSize?: number;
  page?: number;
}
export const getEmploye = createAsyncThunk(
  "employe-list",
  async (query: Query) => {
    try {
      const { data } = await http.get("/employees", {
        params: query,
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
export const getEmployeDetail = createAsyncThunk(
  "employe-detail",
  async (id: string) => {
    try {
      const { data } = await http.get(`/employees/${id}`);

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
