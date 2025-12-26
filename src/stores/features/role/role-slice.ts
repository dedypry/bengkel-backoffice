import type { IRole } from "@/utils/interfaces/IRole";

import { createSlice } from "@reduxjs/toolkit";

import { getRole } from "./role-action";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roles: [] as IRole[],
  },
  reducers: {},
  extraReducers: (build) =>
    build.addCase(getRole.fulfilled, (state, action) => {
      state.roles = action.payload;
    }),
});

export default roleSlice.reducer;
