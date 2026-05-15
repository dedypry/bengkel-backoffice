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
      noStats: undefined as number | undefined,
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
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        // const existingIds = new Set(state.categories.map((c) => c.id));
        // const newCategories = (action.payload as IProductCategory[]).filter(
        //   (c) => !existingIds.has(c.id),
        // );

        // state.categories = [...state.categories, ...newCategories];
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

export const { setCategoryQuery, setProductQuery, setCategories } =
  productSlice.actions;
export default productSlice.reducer;
