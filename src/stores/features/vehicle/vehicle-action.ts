import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getVehicle = createAsyncThunk("get-vehicle", async () => {
  try {
    const { data } = await http.get("/vehicles");

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
});
