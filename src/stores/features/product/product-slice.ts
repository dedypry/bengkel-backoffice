import type { IProductCategory, IUom } from "@/utils/interfaces/IProduct";

import { createSlice } from "@reduxjs/toolkit";

import { getCategories, getUoms } from "./product-action";

const productSlice = createSlice({
  name: "product",
  initialState: {
    categories: [] as IProductCategory[],
    uoms: [] as IUom[],
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
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getUoms.fulfilled, (state, action) => {
        state.uoms = action.payload;
      }),
});

export const { setCategoryQuery } = productSlice.actions;
export default productSlice.reducer;
