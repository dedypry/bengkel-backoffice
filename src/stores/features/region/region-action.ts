import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getProvince = createAsyncThunk("get-province", async () => {
  try {
    const { data } = await http.get("/region/province");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
export const getCity = createAsyncThunk("get-city", async (id: number) => {
  try {
    const { data } = await http.get(`/region/${id}/city`);

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
export const getDistrict = createAsyncThunk(
  "get-district",
  async (id: number) => {
    try {
      const { data } = await http.get(`/region/${id}/district`);

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);
