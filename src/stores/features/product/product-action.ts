import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getCategories = createAsyncThunk(
  "categories",
  async (query: any) => {
    try {
      const { data } = await http.get("/products/categories", {
        params: query,
      });

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);
