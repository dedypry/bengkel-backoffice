import type { IQuery } from "@/utils/interfaces/global";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";

export const getVehicleHistory = createAsyncThunk(
  "get-vehicle-history",
  async (plateNo: string) => {
    try {
      const { data } = await http.get(`/vehicles/${plateNo}`);

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
export const getVehicle = createAsyncThunk(
  "get-vehicle",
  async (params: IQuery) => {
    try {
      const { data } = await http.get("/vehicles", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
export const getVehicleListMaster = createAsyncThunk(
  "get-vehicle-master",
  async (params: IQuery) => {
    try {
      const { data } = await http.get("/vehicle-master", { params });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);

export const getMasterVehicle = createAsyncThunk(
  "get-master",
  async (params?: IQuery) => {
    try {
      const { data } = await http.get(`vehicle-master`, { params });

      return data;
    } catch (_) {
      return [];
    }
  },
);
