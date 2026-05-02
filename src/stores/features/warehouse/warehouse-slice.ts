import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getWarehouse } from "./warehouse-action";

import { IWarehouse } from "@/utils/interfaces/warehouse";
import { IPagination } from "@/utils/interfaces/IPagination";
import { IQuery } from "@/utils/interfaces/global";

export const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: {
    warehouses: null as IPagination<IWarehouse> | null,
    warehouseQuery: { q: "", page: 1, limit: 10 } as IQuery,
  },
  reducers: {
    setWarehouseQuery: (state, action: PayloadAction<IQuery>) => {
      state.warehouseQuery = { ...state.warehouseQuery, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getWarehouse.fulfilled,
      (state, action: PayloadAction<IPagination<IWarehouse>>) => {
        state.warehouses = action.payload;
      },
    );
  },
});

export const { setWarehouseQuery } = warehouseSlice.actions;
export default warehouseSlice.reducer;
