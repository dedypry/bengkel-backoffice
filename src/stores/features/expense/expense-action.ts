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

export const getExpense = createAsyncThunk("get-expense", async () => {
  try {
    const { data } = await http.get("/expense");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
