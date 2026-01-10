import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getPromo = createAsyncThunk("get-promo", async () => {
  try {
    const { data } = await http.get("/promos");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
