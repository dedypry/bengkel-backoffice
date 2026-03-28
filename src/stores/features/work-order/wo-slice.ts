import type { IPagination } from "@/utils/interfaces/IPagination";
import type { IProduct } from "@/utils/interfaces/IProduct";
import type { IService, IServiceSettings } from "@/utils/interfaces/IService";
import type { ICustomer, IWOItems, IWorkOrder } from "@/utils/interfaces/IUser";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getPaymentListService, getWo, getWoDetail } from "./wo-action";

export interface IWo extends IService {
  qty?: number;
  suplier_name?: string;
}
export interface ISparepart extends IProduct {
  qty?: number;
  price?: number;
  total_price?: number;
  suplier_name?: string;
  disc_value?: number;
  disc_percentage?: number;
  tax?: number;
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
      date_from: "",
      date_to: "",
      date: new Date().toISOString(),
    },
    services: [] as IWo[],
    sparepart: [] as ISparepart[],
    workOrder: null as IWorkOrder | null,
    products: [] as ISparepart[],
    customer: null as ICustomer | null,
    detail: null as IWorkOrder | null,
    isLoadingDetail: false,
    isLoadingOrder: false,
    isLoadingProduct: false,
    tabCashier: "customer",
    settings: {} as IServiceSettings,
    servicePayments: [] as IWOItems<IService>[],
  },
  reducers: {
    setWoSetting: (state, action) => {
      state.settings = action.payload;
    },
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
    updateRowService: (state, action: PayloadAction<IWOItems<IService>>) => {
      const item = action.payload;

      if (state.workOrder) {
        const index = state.workOrder?.services.findIndex(
          (e) => e.id === item.id,
        );

        if (index !== -1) {
          state.workOrder.services[index] = {
            ...state.workOrder?.services[index],
            ...item,
            total_price: (
              Number(item.price) * Number(item.qty) -
              Number(item.disc_value || 0)
            ).toString(),
          };
        }
      }
    },
    updateRowPart: (state, action: PayloadAction<IWOItems<ISparepart>>) => {
      const item = action.payload;

      if (state.workOrder) {
        const index = state.workOrder.spareparts?.findIndex(
          (e) => e.id === item.id,
        );

        if (index !== undefined && index !== -1 && state.workOrder.spareparts) {
          state.workOrder.spareparts[index] = {
            ...state.workOrder.spareparts[index],
            ...item,
            total_price: (
              Number(item.price) * Number(item.qty) -
              Number(item.disc_value || 0)
            ).toString(),
          };
        }
      }
    },
    removeRowPart: (state, action: PayloadAction<IWOItems<ISparepart>>) => {
      const item = action.payload;

      if (state.workOrder) {
        const parts = state.workOrder.spareparts || [];

        state.workOrder = {
          ...state.workOrder,
          spareparts: parts.filter((e) => e.id !== item.id),
        };
      }
    },
    removeRowService: (state, action: PayloadAction<IWOItems<IService>>) => {
      const item = action.payload;

      if (state.workOrder) {
        const services = state.workOrder.services || [];

        state.workOrder = {
          ...state.workOrder,
          services: services.filter((e) => e.id !== item.id),
        };
      }
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
        state.isLoadingOrder = false;
      })
      .addCase(getWo.pending, (state) => {
        state.isLoadingOrder = true;
      })
      .addCase(getWoDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.workOrder = action.payload;
        state.isLoadingDetail = false;
      })
      .addCase(getPaymentListService.fulfilled, (state, action) => {
        state.servicePayments = action.payload;
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
  setWoSetting,
  updateRowService,
  updateRowPart,
  removeRowPart,
  removeRowService,
} = woSlice.actions;

export default woSlice.reducer;
