import { createSlice } from "@reduxjs/toolkit";

const sidebar = createSlice({
  name: "sidebar",
  initialState: {
    sidebarOpen: true,
  },
  reducers: {
    setSidebar: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setSidebar } = sidebar.actions;
export default sidebar.reducer;
