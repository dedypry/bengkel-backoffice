import type {
  IProduct,
  IProductCategory,
  IReceipt,
  IUom,
} from "@/utils/interfaces/IProduct";
import type { IPagination } from "@/utils/interfaces/IPagination";

import { createSlice } from "@reduxjs/toolkit";

import {
  getCategories,
  getProduct,
  getProductDetail,
  getProductReceipt,
  getProductReceiptDetail,
  getUoms,
} from "./product-action";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: null as IPagination<IProduct> | null,
    product: null as IProduct | null,
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
    recepipts: null as IPagination<IReceipt> | null,
    recepipt: null as IReceipt | null,
    isLoadingProduct: false,
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
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.product = action.payload;
        state.isLoadingProduct = false;
      })
      .addCase(getProductDetail.pending, (state) => {
        state.isLoadingProduct = true;
      })
      .addCase(getProductReceiptDetail.fulfilled, (state, action) => {
        state.recepipt = action.payload;
      })
      .addCase(getProductReceipt.fulfilled, (state, action) => {
        state.recepipts = action.payload;
      }),
});

export const { setCategoryQuery, setProductQuery } = productSlice.actions;
export default productSlice.reducer;
