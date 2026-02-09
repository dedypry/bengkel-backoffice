import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getExpenseCategories = createAsyncThunk(
  "get-categories",
  async () => {
    try {
      const { data } = await http.get("/expense/categories");

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);
