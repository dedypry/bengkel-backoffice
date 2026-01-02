import type {
  IProduct,
  IProductCategory,
  IUom,
} from "@/utils/interfaces/IProduct";
import type { IPagination } from "@/utils/interfaces/IPagination";

import { createSlice } from "@reduxjs/toolkit";

import { getCategories, getProduct, getUoms } from "./product-action";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: null as IPagination<IProduct> | null,
    categories: [] as IProductCategory[],
    uoms: [] as IUom[],
    categoryQuery: {
      q: "",
    },
    productQuery: {
      q: "",
      page: 1,
      pageSize: 10,
    },
  },
  reducers: {
    setCategoryQuery: (state, action) => {
      state.categoryQuery = {
        ...state.categoryQuery,
        ...action.payload,
      };
    },
    setProductQuery: (state, action) => {
      state.productQuery = {
        ...state.productQuery,
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
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.products = action.payload;
      }),
});

export const { setCategoryQuery, setProductQuery } = productSlice.actions;
export default productSlice.reducer;
