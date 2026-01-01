import type { IProductCategory } from "@/utils/interfaces/IProduct";

import { createSlice } from "@reduxjs/toolkit";

import { getCategories } from "./product-action";

const productSlice = createSlice({
  name: "product",
  initialState: {
    categories: [] as IProductCategory[],
    categoryQuery: {
      q: "",
    },
  },
  reducers: {
    setCategoryQuery: (state, action) => {
      state.categoryQuery = {
        ...state.categoryQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    }),
});

export const { setCategoryQuery } = productSlice.actions;
export default productSlice.reducer;
