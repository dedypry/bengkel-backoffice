import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";
interface WoQuery extends IQuery {
  status?: string;
}
export const getWo = createAsyncThunk("get-wo", async (params: WoQuery) => {
  try {
    const { data } = await http.get(`/work-order`, { params });

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
});
export const getWoDetail = createAsyncThunk(
  "get-wo-detail",
  async (id: string | number) => {
    try {
      const { data } = await http.get(`/work-order/${id}`);

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
