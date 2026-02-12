import { createSlice } from "@reduxjs/toolkit";

import { getExpense, getExpenseCategories } from "./expense-action";

import { IExpense, IExpenseCategorie } from "@/utils/interfaces/IExpense";
import { IPagination } from "@/utils/interfaces/IPagination";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    categories: [] as IExpenseCategorie[],
    expense: null as IPagination<IExpense> | null,
  },
  reducers: {},
  extraReducers: (build) =>
    build
      .addCase(getExpenseCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getExpense.fulfilled, (state, action) => {
        state.expense = action.payload;
      }),
});

export default expenseSlice.reducer;
