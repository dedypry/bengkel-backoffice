import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getMechanic = createAsyncThunk("get-mechanic", async () => {
  try {
    const { data } = await http.get("/mechanics");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
