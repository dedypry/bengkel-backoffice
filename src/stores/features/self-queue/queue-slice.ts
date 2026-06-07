import type { IPagination } from "@/utils/interfaces/IPagination";
import type {
  IQueue,
  IQueueCategory,
  IQueueDisplay,
} from "@/utils/interfaces/IQueue";

import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import { getQueueCategories, getQueueDisplay, getQueues } from "./queue-action";

const queueSlice = createSlice({
  name: "selfQueue",
  initialState: {
    categories: [] as IQueueCategory[],
    queues: null as IPagination<IQueue> | null,
    display: null as IQueueDisplay | null,
    query: {
      q: "",
      status: "",
      date: dayjs().format("YYYY-MM-DD"),
      page: 1,
      pageSize: 10,
    },
  },
  reducers: {
    setQueueQuery: (state, action) => {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getQueueCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
      })
      .addCase(getQueues.fulfilled, (state, action) => {
        state.queues = action.payload;
      })
      .addCase(getQueueDisplay.fulfilled, (state, action) => {
        state.display = action.payload;
      }),
});

export const { setQueueQuery } = queueSlice.actions;
export default queueSlice.reducer;
