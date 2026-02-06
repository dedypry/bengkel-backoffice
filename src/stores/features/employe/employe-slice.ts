import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IUser } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import {
  getEmploye,
  getEmployeDetail,
  getEmployeSummary,
} from "./employe-action";

export const employeSlice = createSlice({
  name: "employee",
  initialState: {
    list: null as IPagination<IUser> | null,
    summary: { total: 0, permanent: 0, department: 0 },
    detail: null as IUser | null,
    detailLoading: false,
    searchQuery: {
      page: 1,
      pageSize: 10,
      q: "",
    },
  },
  reducers: {
    setQuerySearch: (state, action) => {
      state.searchQuery = {
        ...state.searchQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (build) =>
    build
      .addCase(getEmployeSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(getEmploye.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getEmployeDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.detailLoading = false;
      })
      .addCase(getEmployeDetail.pending, (state) => {
        state.detailLoading = true;
      }),
});

export const { setQuerySearch } = employeSlice.actions;
export default employeSlice.reducer;
