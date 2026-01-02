import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getCategories = createAsyncThunk(
  "categories",
  async (query: any) => {
    try {
      const { data } = await http.get("/products/categories", {
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
    const { data } = await http.get("/products/uoms");

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
