import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getCategories = createAsyncThunk(
  "categories",
  async (query: any) => {
    try {
      const { data } = await http.get("/products/categories/list", {
        params: query,
      });

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);

export const getUoms = createAsyncThunk("uoms", async () => {
  try {
    const { data } = await http.get("/products/uoms/list");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});

export const getProduct = createAsyncThunk("product", async (query: IQuery) => {
  try {
    const { data } = await http.get("/products", {
      params: query,
    });

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});

export const getProductDetail = createAsyncThunk(
  "product-detail",
  async (id: any) => {
    try {
      const { data } = await http.get(`/products/${id}`);

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);

export const getProductReceipt = createAsyncThunk(
  "product-receipt",
  async (query: IQuery) => {
    try {
      const { data } = await http.get("/products/receipt/list", {
        params: query,
      });

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);
export const getProductReceiptDetail = createAsyncThunk(
  "product-receipt-detail",
  async (id: number | string) => {
    try {
      const { data } = await http.get(`/products/receipt/${id}`);

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);
