import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getService = createAsyncThunk(
  "get-service",
  async (query: IQuery) => {
    try {
      const { data } = await http.get(`/services`, {
        params: query,
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
export const getCategories = createAsyncThunk("get-categories", async () => {
  try {
    const { data } = await http.get(`/services/categories`);

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
});
