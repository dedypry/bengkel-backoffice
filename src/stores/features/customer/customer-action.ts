import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

interface CustomerQuery extends IQuery {
  noStats?: boolean;
}
export const getCustomer = createAsyncThunk(
  "get-customer",
  async (query: CustomerQuery) => {
    try {
      const { data } = await http.get("/customers", {
        params: query,
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
export const getDetailCustomer = createAsyncThunk(
  "get-customer-detail",
  async (id: string) => {
    try {
      const { data } = await http.get(`/customers/${id}`);

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
