import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IProduct } from "@/utils/interfaces/IProduct";
import type { IService } from "@/utils/interfaces/IService";
import type { ICustomer, IWorkOrder } from "@/utils/interfaces/IUser";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getWo, getWoDetail } from "./wo-action";

export interface IWo extends IService {
  qty?: number;
}
interface ISparepart extends IProduct {
  qty?: number;
  price?: number;
}

const woSlice = createSlice({
  name: "wo",
  initialState: {
    orders: null as IPagination<IWorkOrder> | null,
    woQuery: {
      page: 1,
      pageSize: 10,
      q: "",
      status: "all",
    },
    services: [] as IWo[],
    sparepart: [] as ISparepart[],
    workOrder: {} as IWorkOrder,
    products: [] as ISparepart[],
    customer: null as ICustomer | null,
    detail: null as IWorkOrder | null,
    isLoadingDetail: false,
    tabCashier: "customer",
  },
  reducers: {
    setWoQuery: (state, action) => {
      state.woQuery = {
        ...state.woQuery,
        ...action.payload,
      };
    },
    setTabCashier: (state, action) => {
      state.tabCashier = action.payload;
    },
    setWoProducts: (state, action: PayloadAction<ISparepart>) => {
      const find = state.products.findIndex((e) => action.payload.id == e.id);

      if (find >= 0) {
        state.products[find] = action.payload;
      } else {
        state.products = [...state.products, action.payload];
      }
    },
    removeWoProduct: (state, action: PayloadAction<ISparepart>) => {
      state.products = state.products.filter((e) => e.id !== action.payload.id);
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setWo: (state, action) => {
      state.workOrder = action.payload;
    },
    addWoService: (state, action: PayloadAction<IWo>) => {
      const find = state.services.findIndex((e) => action.payload.id == e.id);

      if (find >= 0) {
        state.services[find] = action.payload;
      } else {
        state.services = [...state.services, action.payload];
      }
    },
    removeWoService: (state, action: PayloadAction<IWo>) => {
      state.services = state.services.filter((e) => e.id !== action.payload.id);
    },
    addSparepartService: (state, action: PayloadAction<ISparepart>) => {
      const find = state.sparepart.findIndex((e) => action.payload.id == e.id);

      if (find >= 0) {
        state.sparepart[find] = action.payload;
      } else {
        state.sparepart = [...state.sparepart, action.payload];
      }
    },
    removeSparepartService: (state, action: PayloadAction<ISparepart>) => {
      state.sparepart = state.sparepart.filter(
        (e) => e.id !== action.payload.id,
      );
    },
    setWoService: (state, action) => {
      state.services = action.payload;
    },
    setWoSparepart: (state, action) => {
      state.sparepart = action.payload;
    },
    formWoClear: (state) => {
      state.services = [];
      state.sparepart = [];
      state.customer = null;
      state.products = [];
      state.workOrder = {} as any;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getWo.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getWoDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.workOrder = action.payload;
        state.isLoadingDetail = false;
      })
      .addCase(getWoDetail.pending, (state) => {
        state.isLoadingDetail = true;
      }),
});

export const {
  setWoService,
  setWoSparepart,
  addWoService,
  removeWoService,
  addSparepartService,
  removeSparepartService,
  setWo,
  formWoClear,
  setCustomer,
  setWoQuery,
  setTabCashier,
  setWoProducts,
  removeWoProduct,
} = woSlice.actions;

export default woSlice.reducer;
