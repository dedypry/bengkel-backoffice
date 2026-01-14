import type { IPagination } from "@/utils/interfaces/IPagination";
import type { ISupplier } from "@/utils/interfaces/ISupplier";

import { createSlice } from "@reduxjs/toolkit";

import { getSupplier } from "./supplier-action";

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    suppliers: null as IPagination<ISupplier> | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getSupplier.fulfilled, (state, action) => {
      state.suppliers = action.payload;
    }),
});

export default supplierSlice.reducer;
