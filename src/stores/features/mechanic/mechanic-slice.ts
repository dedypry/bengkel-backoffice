import type { IUser } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getMechanic } from "./mechanic-action";

const mechanicSlice = createSlice({
  name: "mechanic",
  initialState: {
    mechanics: [] as IUser[],
    mechanicIds: [] as number[],
    mechanicQuery: {
      q: "",
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
    builder.addCase(getMechanic.fulfilled, (state, action) => {
      state.mechanics = action.payload;
    }),
});

export const { setMechanic, setMechanicQuery } = mechanicSlice.actions;
export default mechanicSlice.reducer;
