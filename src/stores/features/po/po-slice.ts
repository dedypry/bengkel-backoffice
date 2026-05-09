import { createSlice } from "@reduxjs/toolkit";

import { fetchPo, fetchPoDetail } from "./po-action";

import { IPagination } from "@/utils/interfaces/IPagination";
import { IPo } from "@/utils/interfaces/po";

const poSlice = createSlice({
  name: "po",
  initialState: {
    list: null as IPagination<IPo> | null,
    poQuery: {
      q: "",
      page: 1,
      pageSize: 10,
      date: "",
      supplier_id: undefined,
      date_from: "",
      date_to: "",
    },
    detail: null as IPo | null,
    detailLoading: false,
    loading: false,
  },
  reducers: {
    setPoQuery: (state, action) => {
      state.poQuery = { ...state.poQuery, ...action.payload };
    },
  },
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
      })
      .addCase(fetchPoDetail.pending, (state) => {
        state.detail = null;
        state.detailLoading = true;
      })
      .addCase(fetchPoDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchPoDetail.rejected, (state) => {
        state.detailLoading = false;
      });
  },
});

export const { setPoQuery } = poSlice.actions;
export default poSlice.reducer;
