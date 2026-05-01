import { createSlice } from "@reduxjs/toolkit";

import { fetchPo } from "./po-action";

interface Po {
  id: string;
  kode: string;
  tanggal: string;
  supplier: string;
  status: string;
  total: number;
  tanggal_diminta: string;
  catatan: string;
}

const poSlice = createSlice({
  name: "po",
  initialState: {
    list: [] as Po[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default poSlice.reducer;
