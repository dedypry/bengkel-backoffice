import type { ICompany, IUser } from "@/utils/interfaces/IUser";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: null as IUser | null,
  company: null as ICompany | null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.company = action.payload.companies[0];
    },
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },

    authClear: (state) => {
      state.user = null;
      state.company = null;
    },
  },
});

export const { setAuth, authClear, setCompany, setToken } = authSlice.actions;
export default authSlice.reducer;
