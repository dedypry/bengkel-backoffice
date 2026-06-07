import type { IPagination } from "@/utils/interfaces/IPagination";
import type {
  IEmployeeSalary,
  IPayroll,
  IPayrollSummary,
} from "@/utils/interfaces/IPayroll";

import { createSlice } from "@reduxjs/toolkit";

import {
  getPayrollDetail,
  getPayrolls,
  getPayrollSummary,
  getSalaries,
} from "./payroll-action";

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    payrolls: null as IPagination<IPayroll> | null,
    detail: null as IPayroll | null,
    detailLoading: false,
    salaries: null as IPagination<IEmployeeSalary> | null,
    summary: { total_run: 0, paid_amount: 0 } as IPayrollSummary,
    payrollQuery: {
      q: "",
      period_type: "",
      status: "",
      page: 1,
      pageSize: 10,
    },
    salaryQuery: {
      q: "",
      page: 1,
      pageSize: 10,
    },
  },
  reducers: {
    setPayrollQuery: (state, action) => {
      state.payrollQuery = { ...state.payrollQuery, ...action.payload };
    },
    setSalaryQuery: (state, action) => {
      state.salaryQuery = { ...state.salaryQuery, ...action.payload };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getPayrolls.fulfilled, (state, action) => {
        state.payrolls = action.payload;
      })
      .addCase(getPayrollSummary.fulfilled, (state, action) => {
        if (action.payload) state.summary = action.payload;
      })
      .addCase(getSalaries.fulfilled, (state, action) => {
        state.salaries = action.payload;
      })
      .addCase(getPayrollDetail.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getPayrollDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.detailLoading = false;
      }),
});

export const { setPayrollQuery, setSalaryQuery } = payrollSlice.actions;
export default payrollSlice.reducer;
