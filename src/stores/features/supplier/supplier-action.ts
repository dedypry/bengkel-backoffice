import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getSupplier = createAsyncThunk(
  "get-supplier",
  async (params: IQuery) => {
    try {
      const { data } = await http.get("/suppliers", {
        params,
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
