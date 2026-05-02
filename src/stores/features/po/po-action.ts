import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";
import { IQuery } from "@/utils/interfaces/global";

interface IQueryPo extends IQuery {
  q?: string;
  status?: string;
  supplier_id?: number;
}

export const fetchPo = createAsyncThunk(
  "po/fetchPo",
  async (query: IQueryPo) => {
    try {
      const { data } = await http.get("/po", { params: query });

      return data;
    } catch (_) {
      return null;
    }
  },
);

export const fetchPoDetail = createAsyncThunk(
  "po/fetchPoDetail",
  async (id: number) => {
    try {
      const { data } = await http.get(`/po/${id}`);

      return data;
    } catch (_) {
      return null;
    }
  },
);
