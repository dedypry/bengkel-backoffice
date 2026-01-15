import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getDashboard = createAsyncThunk("get-dashboard", async () => {
  try {
    const { data } = await http.get("/dashboard");

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
});
