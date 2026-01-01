import type { IUser } from "@/utils/interfaces/IUser";

import { createSlice } from "@reduxjs/toolkit";

import { getMechanic } from "./mechanic-action";

const mechanicSlice = createSlice({
  name: "mechanic",
  initialState: {
    mechanics: [] as IUser[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getMechanic.fulfilled, (state, action) => {
      state.mechanics = action.payload;
    }),
});

export default mechanicSlice.reducer;
