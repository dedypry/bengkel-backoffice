import type { IPromo } from "@/utils/interfaces/IPromo";

import { createSlice } from "@reduxjs/toolkit";

import { getPromo } from "./promo-action";

const promo = createSlice({
  name: "promo",
  initialState: {
    promos: [] as IPromo[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getPromo.fulfilled, (state, action) => {
      state.promos = action.payload;
    }),
});

export default promo.reducer;
