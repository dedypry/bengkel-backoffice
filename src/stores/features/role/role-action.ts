/* eslint-disable no-console */
import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getRole = createAsyncThunk("get-role", async () => {
  try {
    const { data } = await http.get("/roles");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
