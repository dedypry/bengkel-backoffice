import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";
import { IQuery } from "@/utils/interfaces/global";

export const getVendorTransaction = createAsyncThunk(
  "get-vendor",
  async (params?: IQuery) => {
    try {
      const { data } = await http.get("/vendor-transaction", { params });

      return data;
    } catch (_) {
      return null;
    }
  },
);

export const getVendorTrxDetail = createAsyncThunk(
  "get-vendor-detail",
  async (id: any) => {
    try {
      const { data } = await http.get(`/vendor-transaction/${id}`);

      return data;
    } catch (_) {
      return null;
    }
  },
);
