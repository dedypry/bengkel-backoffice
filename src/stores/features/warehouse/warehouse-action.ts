import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";
import { IQuery } from "@/utils/interfaces/global";

export const getWarehouse = createAsyncThunk(
  "get-warehouse",
  async (params?: IQuery) => {
    try {
      const { data } = await http.get("/warehouse", { params });

      return data;
    } catch (_) {
      return null;
    }
  },
);
