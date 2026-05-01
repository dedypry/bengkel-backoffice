import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const fetchPo = createAsyncThunk("po/fetchPo", async () => {
  const response = await http.get("/po");

  return response.data;
});
