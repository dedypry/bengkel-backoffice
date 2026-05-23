import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";
import { IServiceSettings } from "@/utils/interfaces/IService";

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    settings: null as IServiceSettings | null,
  },
  reducers: {
    setSettings: (state, action: PayloadAction<IServiceSettings>) => {
      state.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
    });
  },
});

export const getSettings = createAsyncThunk("setting/getSettings", async () => {
  try {
    const response = await http.get("/settings");

    return response.data;
  } catch (error) {
    console.error(error);

    return null;
  }
});

export const { setSettings } = settingSlice.actions;
export default settingSlice.reducer;
