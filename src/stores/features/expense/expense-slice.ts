import { createSlice } from "@reduxjs/toolkit";

import { getExpenseCategories } from "./expense-action";

import { IExpenseCategorie } from "@/utils/interfaces/IExpense";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    categories: [] as IExpenseCategorie[],
  },
  reducers: {},
  extraReducers: (build) =>
    build.addCase(getExpenseCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    }),
});

export default expenseSlice.reducer;
