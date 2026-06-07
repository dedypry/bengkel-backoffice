import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getQueueCategories = createAsyncThunk(
  "self-queue-categories",
  async (companyId?: number) => {
    try {
      const { data } = await http.get("/queue/categories", {
        params: companyId ? { company_id: companyId } : undefined,
      });

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
);

export const getQueues = createAsyncThunk(
  "self-queue-list",
  async (params: any) => {
    try {
      const { data } = await http.get("/queue", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getQueueDisplay = createAsyncThunk(
  "self-queue-display",
  async (companyId?: number) => {
    try {
      const { data } = await http.get("/queue/display", {
        params: companyId ? { company_id: companyId } : undefined,
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
