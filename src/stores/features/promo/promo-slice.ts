import type { IPromo } from "@/utils/interfaces/IPromo";

import { createSlice } from "@reduxjs/toolkit";

import { getPromo } from "./promo-action";

const promo = createSlice({
  name: "promo",
  initialState: {
    promos: [] as IPromo[],
    queryPromo: {
      q: "",
      status: "all",
    },
  },
  reducers: {
    setQueryPromo: (state, action) => {
      state.queryPromo = {
        ...state.queryPromo,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder.addCase(getPromo.fulfilled, (state, action) => {
      state.promos = action.payload;
    }),
});

export const { setQueryPromo } = promo.actions;
export default promo.reducer;
