import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getSupplier = createAsyncThunk(
  "get-supplier",
  async (params: IQuery) => {
    try {
      const { data } = await http.get("/suppliers", {
        params,
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
export const getSupplierList = createAsyncThunk(
  "get-supplier-list",
  async () => {
    try {
      const { data } = await http.get("/suppliers");

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getSupplierAll = createAsyncThunk("get-supplier-all", async () => {
  try {
    const { data } = await http.get("/suppliers/all");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
