import type { IUser } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getMechanic } from "./mechanic-action";

const mechanicSlice = createSlice({
  name: "mechanic",
  initialState: {
    mechanics: [] as IUser[],
    mechanicIds: [] as number[],
    isLoadingMechanics: false,
    mechanicQuery: {
      q: "",
      min_rating: "",
    },
  },
  reducers: {
    setMechanic: (state, action) => {
      state.mechanicIds = action.payload;
    },
    setMechanicQuery: (state, action) => {
      state.mechanicQuery = {
        ...state.mechanicQuery,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getMechanic.pending, (state) => {
        state.isLoadingMechanics = true;
      })
      .addCase(getMechanic.fulfilled, (state, action) => {
        state.isLoadingMechanics = false;
        state.mechanics = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getMechanic.rejected, (state) => {
        state.isLoadingMechanics = false;
      }),
});

export const { setMechanic, setMechanicQuery } = mechanicSlice.actions;
export default mechanicSlice.reducer;
